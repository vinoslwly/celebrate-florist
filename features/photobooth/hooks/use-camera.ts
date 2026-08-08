"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import type { CameraStatus } from "@/features/photobooth/lib/types";

type UseCameraResult = {
  videoRef: RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  errorMessage: string | null;
  isLive: boolean;
  enableCamera: () => Promise<void>;
  stopCamera: () => void;
};

function classifyMediaError(err: unknown): {
  status: Exclude<CameraStatus, "idle" | "requesting" | "live">;
  message: string;
} {
  const name =
    err && typeof err === "object" && "name" in err
      ? String((err as { name: string }).name)
      : "";

  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return {
      status: "denied",
      message:
        "Camera access was denied. Allow the camera in your browser settings, then try again.",
    };
  }

  if (
    name === "NotFoundError" ||
    name === "DevicesNotFoundError" ||
    name === "NotReadableError" ||
    name === "TrackStartError"
  ) {
    return {
      status: "unavailable",
      message:
        "No usable camera was found, or another app is using it. Check your device and try again.",
    };
  }

  if (typeof window !== "undefined" && !window.isSecureContext) {
    return {
      status: "unavailable",
      message: "Camera requires a secure context (HTTPS or localhost).",
    };
  }

  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    return {
      status: "unavailable",
      message: "Camera access is not supported in this browser.",
    };
  }

  return {
    status: "unavailable",
    message: "Camera could not be started. Please try again.",
  };
}

/**
 * Camera lifecycle — getUserMedia, attach to video, stop all tracks on cleanup.
 * Permission must be triggered by user action (call enableCamera from a click).
 */
export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      video.srcObject = null;
    }
    setStatus((prev) =>
      prev === "live" || prev === "requesting" ? "idle" : prev,
    );
  }, []);

  const enableCamera = useCallback(async () => {
    setErrorMessage(null);
    setStatus("requesting");

    stopCamera();

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "user" },
        },
      });

      streamRef.current = mediaStream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = mediaStream;
        await video.play().catch(() => {
          /* autoplay policies — playsInline + muted should allow */
        });
      }

      setStatus("live");
    } catch (err) {
      const classified = classifyMediaError(err);
      setStatus(classified.status);
      setErrorMessage(classified.message);
      streamRef.current = null;
    }
  }, [stopCamera]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  return {
    videoRef,
    status,
    errorMessage,
    isLive: status === "live",
    enableCamera,
    stopCamera,
  };
}
