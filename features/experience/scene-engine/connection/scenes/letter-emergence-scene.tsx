"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";
import { BloomGiftBox } from "@/features/experience/scene-engine/shared/bloom-gift-box";

const STATIC_PETALS = [
  { top: "12%", left: "10%", size: 14, rotate: -16 },
  { top: "18%", left: "78%", size: 12, rotate: 22 },
  { top: "58%", left: "6%", size: 15, rotate: 8 },
  { top: "62%", left: "88%", size: 13, rotate: -12 },
  { top: "78%", left: "22%", size: 11, rotate: 18 },
  { top: "82%", left: "70%", size: 14, rotate: -8 },
] as const;

function SakuraMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="15"
          rx="10"
          ry="16"
          fill="#F4A0B8"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="6.5" fill="#FFF6E8" />
      <circle cx="32" cy="32" r="2.4" fill="#E8A850" />
    </svg>
  );
}

function PetalMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * connection.letter-emergence — Scene 10 transition (Founder).
 * Locked gift finally opens; letter head shows To/From only.
 * Auto-advance ~1.4s — no “Tap to continue” (unlike Moments Scene 3).
 */
export function ConnectionLetterEmergenceScene({
  payload,
}: ConnectionSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const toName = payload.experience.greeting_name;
  const fromName = payload.experience.closing_name;

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-x-clip overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch] bg-[#F9C8D4]">
      <style>{`
        @keyframes le-glow {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(0.96); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.06); }
        }
        @keyframes le-sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @media (prefers-reduced-motion: reduce) {
          .le-anim-glow, .le-anim-sparkle { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 90% at 50% 55%, #FFE8F0 0%, #F9C8D4 48%, #EFA0B8 100%)",
        }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STATIC_PETALS.map((p, i) => (
          <div
            key={i}
            className="absolute opacity-75"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size * 1.35,
              transform: `rotate(${p.rotate}deg)`,
            }}
          >
            <PetalMark className="h-full w-full" />
          </div>
        ))}
      </div>

      {!reduceMotion
        ? [
            { top: "28%", left: "22%", delay: "0s" },
            { top: "24%", left: "72%", delay: "0.4s" },
            { top: "48%", left: "30%", delay: "0.8s" },
            { top: "44%", left: "68%", delay: "0.2s" },
          ].map((s, i) => (
            <span
              key={i}
              aria-hidden
              className="le-anim-sparkle pointer-events-none absolute text-[10px] text-[#FFF8E0]"
              style={{
                top: s.top,
                left: s.left,
                animation: `le-sparkle 2s ease-in-out ${s.delay} infinite`,
              }}
            >
              ✦
            </span>
          ))
        : null}

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-5 py-10">
        <div className="relative mx-auto w-full max-w-sm">
          <div
            aria-hidden
            className="le-anim-glow pointer-events-none absolute top-[32%] left-1/2 z-0 h-48 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-56 sm:w-64"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,248,220,0.95) 0%, rgba(255,210,160,0.5) 40%, transparent 70%)",
              animation: reduceMotion
                ? undefined
                : "le-glow 2.4s ease-in-out infinite",
            }}
          />

          <motion.div
            className="relative z-20 mx-auto w-[11.5rem] sm:w-[13rem]"
            initial={reduceMotion ? false : { y: 72, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.85,
              ease: [0.22, 1, 0.36, 1],
              delay: reduceMotion ? 0 : 0.12,
            }}
            role="img"
            aria-label={`Letter to ${toName} from ${fromName}`}
          >
            <div className="relative overflow-hidden rounded-md border border-[#E8A0B4]/75 bg-[#FFF8F5] px-4 pt-5 pb-6 shadow-[0_18px_40px_-18px_rgba(160,70,100,0.45)] sm:px-5 sm:pt-6 sm:pb-7">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-2 rounded-sm border border-[#E8A0B4]/55"
              />
              <SakuraMark className="pointer-events-none absolute top-3 right-3 h-5 w-5 opacity-85" />
              <SakuraMark className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 opacity-75" />

              <p className="text-center text-[10px] font-semibold tracking-[0.22em] text-[#C45B7A] uppercase sm:text-[11px]">
                To:
              </p>
              <p className="mt-1 text-center font-serif text-2xl font-semibold text-[#8B2E3E] sm:text-3xl">
                {toName}
              </p>

              <div className="my-4 flex items-center justify-center gap-2 text-[#E8A0B4]">
                <span className="h-px w-8 bg-current" aria-hidden />
                <span className="text-xs" aria-hidden>
                  ♥
                </span>
                <span className="h-px w-8 bg-current" aria-hidden />
              </div>

              <p className="text-center text-[10px] font-semibold tracking-[0.22em] text-[#C45B7A] uppercase sm:text-[11px]">
                From:
              </p>
              <p className="mt-1 text-center font-serif text-xl font-semibold text-[#8B2E3E] sm:text-2xl">
                {fromName}
              </p>
            </div>
          </motion.div>

          <div
            className="relative z-10 -mt-8 flex justify-center sm:-mt-10"
            aria-hidden
          >
            <BloomGiftBox
              variant="open"
              animateLid
              reduceMotion={reduceMotion}
              className="h-36 w-[18rem] sm:h-40 sm:w-[20rem]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
