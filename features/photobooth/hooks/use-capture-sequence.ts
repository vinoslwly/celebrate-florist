"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import type {
  CapturedPose,
  CapturePhase,
  CountdownSeconds,
} from "@/features/photobooth/lib/types";

type UseCaptureSequenceOptions = {
  poseCount: number;
  countdownSeconds: CountdownSeconds;
  flashEnabled: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
};

type UseCaptureSequenceResult = {
  phase: CapturePhase;
  countdownValue: number | null;
  flashVisible: boolean;
  poses: CapturedPose[];
  currentPoseIndex: number;
  captureError: string | null;
  isComplete: boolean;
  startCapture: () => void;
  retakeLast: () => void;
  resetAll: () => void;
  clearCaptureError: () => void;
};

function revokePose(pose: CapturedPose) {
  URL.revokeObjectURL(pose.objectUrl);
}

function revokeAll(poses: CapturedPose[]) {
  poses.forEach(revokePose);
}

/**
 * Capture a frame from the live video into a blob object URL.
 * Draws the unmirrored video frame (CSS mirror on preview does not affect canvas).
 */
async function captureFromVideo(
  video: HTMLVideoElement,
): Promise<string | null> {
  if (video.videoWidth === 0 || video.videoHeight === 0) return null;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92);
  });
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

/**
 * Pose sequencing: countdown → optional flash → capture → next pose.
 * Retake last / reset revoke object URLs to avoid leaks.
 */
export function useCaptureSequence({
  poseCount,
  countdownSeconds,
  flashEnabled,
  videoRef,
}: UseCaptureSequenceOptions): UseCaptureSequenceResult {
  const [phase, setPhase] = useState<CapturePhase>("ready");
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [flashVisible, setFlashVisible] = useState(false);
  const [poses, setPoses] = useState<CapturedPose[]>([]);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const timersRef = useRef<number[]>([]);
  const posesRef = useRef<CapturedPose[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const syncPoses = useCallback((next: CapturedPose[]) => {
    posesRef.current = next;
    setPoses(next);
  }, []);

  const resetAll = useCallback(() => {
    clearTimers();
    revokeAll(posesRef.current);
    syncPoses([]);
    setPhase("ready");
    setCountdownValue(null);
    setFlashVisible(false);
    setCaptureError(null);
  }, [clearTimers, syncPoses]);

  const retakeLast = useCallback(() => {
    if (posesRef.current.length === 0) return;
    clearTimers();
    const next = [...posesRef.current];
    const removed = next.pop();
    if (removed) revokePose(removed);
    syncPoses(next);
    setPhase("ready");
    setCountdownValue(null);
    setFlashVisible(false);
    setCaptureError(null);
  }, [clearTimers, syncPoses]);

  const runCapture = useCallback(async () => {
    const video = videoRef.current;
    if (!video) {
      setCaptureError("Preview is not ready. Try again.");
      setPhase("ready");
      return;
    }

    setPhase("capturing");
    try {
      const objectUrl = await captureFromVideo(video);
      if (!objectUrl) {
        setCaptureError("Capture failed. Keep the camera on and try again.");
        setPhase("ready");
        return;
      }

      const next = [
        ...posesRef.current,
        { id: `pose-${Date.now()}-${posesRef.current.length}`, objectUrl },
      ];
      syncPoses(next);
      setCaptureError(null);

      if (next.length >= poseCount) {
        setPhase("complete");
      } else {
        setPhase("ready");
      }
    } catch {
      setCaptureError("Capture failed. Keep the camera on and try again.");
      setPhase("ready");
    }
  }, [poseCount, syncPoses, videoRef]);

  const startCapture = useCallback(() => {
    if (phase === "counting" || phase === "flashing" || phase === "capturing") {
      return;
    }
    if (posesRef.current.length >= poseCount) return;

    clearTimers();
    setCaptureError(null);
    setPhase("counting");

    let remaining = countdownSeconds;
    setCountdownValue(remaining);

    const tick = () => {
      remaining -= 1;
      if (remaining > 0) {
        setCountdownValue(remaining);
        const id = window.setTimeout(tick, 1000);
        timersRef.current.push(id);
        return;
      }

      setCountdownValue(null);

      const afterFlash = () => {
        setFlashVisible(false);
        void runCapture();
      };

      if (flashEnabled) {
        setPhase("flashing");
        setFlashVisible(true);
        const id = window.setTimeout(afterFlash, 160);
        timersRef.current.push(id);
      } else {
        afterFlash();
      }
    };

    const id = window.setTimeout(tick, 1000);
    timersRef.current.push(id);
  }, [
    clearTimers,
    countdownSeconds,
    flashEnabled,
    phase,
    poseCount,
    runCapture,
  ]);

  useEffect(() => {
    return () => {
      clearTimers();
      revokeAll(posesRef.current);
    };
  }, [clearTimers]);

  /** When poseCount shrinks (e.g. B→K), drop excess captures. */
  useEffect(() => {
    if (posesRef.current.length <= poseCount) return;
    const kept = posesRef.current.slice(0, poseCount);
    const dropped = posesRef.current.slice(poseCount);
    dropped.forEach(revokePose);
    syncPoses(kept);
    setPhase(kept.length >= poseCount ? "complete" : "ready");
  }, [poseCount, syncPoses]);

  return {
    phase,
    countdownValue,
    flashVisible,
    poses,
    currentPoseIndex: poses.length,
    captureError,
    isComplete: poses.length >= poseCount && phase === "complete",
    startCapture,
    retakeLast,
    resetAll,
    clearCaptureError: () => setCaptureError(null),
  };
}
