/** Photobooth layout ids — Founder-locked (Sprint 14.1). */
export type PhotoboothLayoutId = "B" | "K";

export type CameraStatus =
  "idle" | "requesting" | "live" | "denied" | "unavailable";

export type CapturePhase =
  "ready" | "counting" | "flashing" | "capturing" | "complete";

export type CapturedPose = {
  id: string;
  /** Object URL from blob — must be revoked on reset/retake. */
  objectUrl: string;
};

export type CountdownSeconds = 3 | 5 | 10;
