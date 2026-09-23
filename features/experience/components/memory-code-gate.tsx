"use client";

import { useCallback, useId, useRef, useState, type ReactNode } from "react";

import { verifyMemoryCodeAction } from "@/features/access/actions/verify-memory-code";
import { MEMORY_CODE_PIN_LENGTH } from "@/schemas/studio-memory-code";

const SKY =
  "radial-gradient(ellipse 90% 70% at 50% 0%, #E8F2FB 0%, #C5DCEF 42%, #A9CDE4 100%)";
const INK = "#1E3A5F";
const MUTED = "#5A7A9A";
const ACCENT = "#5B9BC8";
const KEY =
  "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(232,242,251,0.88) 100%)";
const ENTER = "linear-gradient(180deg, #8EBFDE 0%, #5B9BC8 100%)";

type MemoryCodeGateProps = {
  experienceToken: string;
  greetingName?: string;
};

export function MemoryCodeGate({
  experienceToken,
  greetingName,
}: MemoryCodeGateProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const submittingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();
  const helperId = useId();
  const toName = greetingName?.trim() || "you";

  const submitPin = useCallback(
    async (code: string) => {
      if (code.length !== MEMORY_CODE_PIN_LENGTH || submittingRef.current) {
        return;
      }

      submittingRef.current = true;
      setBusy(true);
      setError(null);

      const result = await verifyMemoryCodeAction({
        experienceToken,
        memoryCode: code,
      });

      submittingRef.current = false;
      setBusy(false);

      if (!result.ok) {
        setError(result.error.message);
        setPin("");
        setShake(true);
        window.setTimeout(() => setShake(false), 420);
        inputRef.current?.focus();
        return;
      }

      window.location.reload();
    },
    [experienceToken],
  );

  function applyDigits(next: string) {
    const digits = next.replace(/\D/g, "").slice(0, MEMORY_CODE_PIN_LENGTH);
    setPin(digits);
    setError(null);
    if (digits.length === MEMORY_CODE_PIN_LENGTH) {
      void submitPin(digits);
    }
  }

  function pressDigit(digit: string) {
    if (busy) return;
    const next = pin.length >= MEMORY_CODE_PIN_LENGTH ? pin : `${pin}${digit}`;
    if (next === pin) return;
    setPin(next);
    setError(null);
    if (next.length === MEMORY_CODE_PIN_LENGTH) {
      void submitPin(next);
    }
  }

  function pressBackspace() {
    if (busy) return;
    setPin((current) => current.slice(0, -1));
    setError(null);
  }

  function pressEnter() {
    if (busy) return;
    if (pin.length === MEMORY_CODE_PIN_LENGTH) {
      void submitPin(pin);
    }
  }

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

  return (
    <div
      className="fixed inset-0 z-10 overflow-y-auto"
      style={{ background: SKY }}
    >
      <div className="flex min-h-[100svh] items-center justify-center px-5 py-8">
        <div
          className="w-full max-w-[22rem] rounded-[2rem] border border-white/55 px-6 py-8 shadow-[0_24px_60px_-24px_rgba(30,58,95,0.45)]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(244,248,252,0.55) 100%)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div className="text-center">
            <p className="text-3xl" aria-hidden>
              🌸
            </p>
            <h1
              className="mt-3 font-serif text-[1.65rem] leading-snug font-semibold"
              style={{ color: INK }}
            >
              For {toName}
            </h1>
            <p id={helperId} className="mt-2 text-sm" style={{ color: MUTED }}>
              Enter our secret code
            </p>
          </div>

          <div
            className={`mt-7 flex justify-center gap-3 ${shake ? "sky-pin-shake" : ""}`}
            aria-hidden
          >
            {Array.from({ length: MEMORY_CODE_PIN_LENGTH }, (_, index) => {
              const filled = index < pin.length;
              return (
                <span
                  key={index}
                  className="h-3.5 w-3.5 rounded-full border-2 transition-colors"
                  style={{
                    borderColor: filled ? ACCENT : "rgba(30,58,95,0.28)",
                    background: filled ? ACCENT : "transparent",
                  }}
                />
              );
            })}
          </div>

          <label htmlFor="recipient-memoryCode" className="sr-only">
            6-digit code
          </label>
          <input
            ref={inputRef}
            id="recipient-memoryCode"
            className="sr-only pointer-events-none"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={MEMORY_CODE_PIN_LENGTH}
            value={pin}
            disabled={busy}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${helperId} ${errorId}` : helperId}
            onChange={(event) => applyDigits(event.target.value)}
          />

          {error ? (
            <p
              id={errorId}
              role="alert"
              className="mt-4 text-center text-sm"
              style={{ color: "#9B3D5A" }}
            >
              {error}
            </p>
          ) : (
            <p className="mt-4 text-center text-sm" style={{ color: MUTED }}>
              {busy ? "Opening gift…" : "\u00a0"}
            </p>
          )}

          <div
            className="mt-5 grid grid-cols-3 gap-3"
            role="group"
            aria-label="Number pad"
          >
            {keys.map((digit) => (
              <KeyButton
                key={digit}
                label={digit}
                disabled={busy}
                onPress={() => pressDigit(digit)}
              />
            ))}
            <KeyButton
              label="Delete"
              disabled={busy || pin.length === 0}
              onPress={pressBackspace}
            >
              <span aria-hidden className="text-lg font-medium">
                ×
              </span>
            </KeyButton>
            <KeyButton
              label="0"
              disabled={busy}
              onPress={() => pressDigit("0")}
            />
            <KeyButton
              label="Open gift"
              disabled={busy || pin.length !== MEMORY_CODE_PIN_LENGTH}
              onPress={pressEnter}
              variant="enter"
            >
              <EnterArrow />
            </KeyButton>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sky-pin-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .sky-pin-shake {
          animation: sky-pin-shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

function KeyButton({
  label,
  disabled,
  onPress,
  variant = "key",
  children,
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
  variant?: "key" | "enter";
  children?: ReactNode;
}) {
  const isEnter = variant === "enter";

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onPress}
      className="flex h-[3.35rem] items-center justify-center rounded-full text-xl font-medium disabled:opacity-40"
      style={{
        background: isEnter ? ENTER : KEY,
        color: isEnter ? "#fff" : INK,
        boxShadow: isEnter
          ? "0 10px 22px -10px rgba(30,58,95,0.55)"
          : "0 8px 18px -12px rgba(30,58,95,0.4)",
        border: isEnter ? "none" : "1px solid rgba(255,255,255,0.8)",
      }}
    >
      {children ?? label}
    </button>
  );
}

function EnterArrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="none">
      <path
        d="M5 12h12M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
