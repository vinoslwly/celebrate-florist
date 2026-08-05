"use client";

import { useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { BloomGiftBox } from "@/features/experience/scene-engine/shared/bloom-gift-box";
import {
  allowAmbientLoop,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";
import type { TreasuresSceneProps } from "@/features/experience/scene-engine/treasures/types";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_POP = [0.22, 1.35, 0.36, 1] as const;

/** Theme Lab default — architecture N = 2–6; six = max cap (5 pink + 1 final). */
export const TREASURES_LAB_GRID_GIFT_COUNT = 6;

type LabGift = {
  sortOrder: number;
  isFinal: boolean;
};

const FALLING_PETALS = [
  { left: "4%", delay: 0.1, duration: 7.8, size: 18, x: 18 },
  { left: "12%", delay: 0.9, duration: 8.6, size: 15, x: -14 },
  { left: "22%", delay: 1.8, duration: 7.4, size: 20, x: 10 },
  { left: "38%", delay: 0.35, duration: 9.0, size: 16, x: -12 },
  { left: "52%", delay: 1.2, duration: 8.2, size: 22, x: 16 },
  { left: "66%", delay: 0.55, duration: 7.6, size: 17, x: -18 },
  { left: "78%", delay: 1.5, duration: 8.8, size: 19, x: 8 },
  { left: "88%", delay: 0.75, duration: 7.9, size: 14, x: -10 },
  { left: "94%", delay: 2.0, duration: 9.2, size: 16, x: -6 },
] as const;

const AMBIENT_SPARKLES = [
  { top: "12%", left: "10%", delay: 0, size: 6 },
  { top: "18%", left: "82%", delay: 0.7, size: 5 },
  { top: "28%", left: "18%", delay: 1.4, size: 7 },
  { top: "34%", left: "72%", delay: 0.3, size: 5 },
  { top: "58%", left: "8%", delay: 1.1, size: 6 },
  { top: "62%", left: "90%", delay: 0.5, size: 7 },
  { top: "78%", left: "22%", delay: 1.8, size: 5 },
  { top: "82%", left: "68%", delay: 0.9, size: 6 },
] as const;

const OPEN_BURST = [
  { x: -36, y: -48, rotate: -20 },
  { x: 40, y: -52, rotate: 18 },
  { x: -52, y: -8, rotate: -8 },
  { x: 56, y: -4, rotate: 12 },
  { x: -18, y: -68, rotate: 6 },
  { x: 22, y: -70, rotate: -10 },
] as const;

function SoftPetal({
  className,
  size = 14,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 32"
      width={size}
      height={size * 1.33}
      className={className}
      aria-hidden
      fill="none"
    >
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.92"
      />
    </svg>
  );
}

function TinyHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 18" className={className} aria-hidden fill="none">
      <path
        d="M10 16C4 11 1 8 1 5.2 1 2.8 2.9 1 5.2 1 7 1 8.6 2 10 3.4 11.4 2 13 1 14.8 1 17.1 1 19 2.8 19 5.2 19 8 16 11 10 16Z"
        fill="#E8799A"
      />
    </svg>
  );
}

function PadlockBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-lg ring-1 ring-black/8",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <rect
          x="6"
          y="11"
          width="12"
          height="9"
          rx="2"
          fill="#F5F5F5"
          stroke="#6B7280"
          strokeWidth="1.4"
        />
        <path
          d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11"
          stroke="#6B7280"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="15.5" r="1.3" fill="#6B7280" />
      </svg>
    </span>
  );
}

function OpenBurst({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {OPEN_BURST.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 0],
            x: p.x,
            y: p.y,
            scale: [0.4, 1.15, 0.7],
            rotate: p.rotate,
          }}
          transition={{ duration: 0.75, ease: EASE_OUT, delay: i * 0.02 }}
        >
          {i % 2 === 0 ? (
            <TinyHeart className="h-3.5 w-3.5" />
          ) : (
            <span className="block h-1.5 w-1.5 rounded-full bg-[#FFF6E0] shadow-[0_0_8px_#FFE8B0]" />
          )}
        </motion.span>
      ))}
    </div>
  );
}

function buildLabGifts(count: number): LabGift[] {
  const n = Math.min(6, Math.max(2, count));
  return Array.from({ length: n }, (_, i) => ({
    sortOrder: i + 1,
    isFinal: i === n - 1,
  }));
}

/**
 * Scene 6 — Treasures Grid (Theme Lab living).
 * Final Gold is presentation-locked until all non-final gifts are opened (FD-S11-17).
 * Selecting a gift navigates to Scene 7 content (lab-local; no openEnvelopeAction).
 */
export type TreasuresGiftGridSceneProps = TreasuresSceneProps & {
  openedSortOrders: ReadonlySet<number>;
  onSelectGift: (sortOrder: number) => void;
};

export function TreasuresGiftGridScene({
  openedSortOrders,
  onSelectGift,
}: TreasuresGiftGridSceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
  const gifts = useMemo(() => buildLabGifts(TREASURES_LAB_GRID_GIFT_COUNT), []);
  const nonFinalOrders = useMemo(
    () => gifts.filter((g) => !g.isFinal).map((g) => g.sortOrder),
    [gifts],
  );
  const [burstKey, setBurstKey] = useState<number | null>(null);

  const openedNonFinal = nonFinalOrders.filter((o) =>
    openedSortOrders.has(o),
  ).length;
  const remaining = nonFinalOrders.length - openedNonFinal;
  const finalUnlocked = remaining === 0;
  const headline = finalUnlocked
    ? "Your final treasure awaits."
    : `Open ${remaining} gift${remaining === 1 ? "" : "s"} to unlock the final treasure.`;

  function handleOpen(gift: LabGift) {
    if (gift.isFinal && !finalUnlocked) return;
    if (!openedSortOrders.has(gift.sortOrder)) {
      setBurstKey(gift.sortOrder);
    }
    onSelectGift(gift.sortOrder);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Atmospheric wash — fixed behind scroll */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 75% at 50% 12%, #FFF0F5 0%, #FFE0EB 28%, #F7B8CC 62%, #E890A8 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 28%, rgba(255,255,255,0.55) 0%, transparent 40%), radial-gradient(circle at 82% 68%, rgba(255,236,244,0.4) 0%, transparent 38%)",
        }}
      />
      {/* Soft vignette for intimacy */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 40%, rgba(180,80,110,0.14) 100%)",
        }}
      />

      {/* Falling petals */}
      {allowAmbientLoop(reduceMotion)
        ? FALLING_PETALS.map((petal, i) => (
            <motion.div
              key={`petal-${i}`}
              className="pointer-events-none absolute top-[-10%] z-[1]"
              style={{ left: petal.left }}
              initial={{ y: 0, opacity: 0, rotate: 0 }}
              animate={{
                y: ["0vh", "115vh"],
                opacity: [0, 0.85, 0.7, 0],
                rotate: [0, 50, -30, 20],
                x: [0, petal.x, petal.x * 0.4],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <SoftPetal
                className="opacity-90 drop-shadow-sm"
                size={petal.size}
              />
            </motion.div>
          ))
        : null}

      {/* Ambient sparkles */}
      {allowAmbientLoop(reduceMotion)
        ? AMBIENT_SPARKLES.map((s, i) => (
            <motion.span
              key={`spark-${i}`}
              className="pointer-events-none absolute z-[1] rounded-full bg-[#FFF8E8]"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                boxShadow: "0 0 10px 2px rgba(255, 232, 180, 0.75)",
              }}
              animate={{
                opacity: [0.15, 0.95, 0.2],
                scale: [0.7, 1.25, 0.8],
              }}
              transition={{
                duration: 2.4 + (i % 3) * 0.4,
                delay: s.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))
        : null}

      {/* Scrollable content — avoid justify-center clipping the headline */}
      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-5 pb-10 sm:px-6 sm:pt-7 sm:pb-12">
          <motion.p
            className="max-w-lg shrink-0 text-center font-serif text-[1.35rem] leading-snug font-semibold text-[#7A2F48] sm:text-[1.65rem]"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            aria-live="polite"
          >
            {headline}
          </motion.p>

          <ul
            className="mt-5 grid w-full grid-cols-3 gap-x-2 gap-y-3 sm:mt-7 sm:gap-x-5 sm:gap-y-5"
            aria-label="Your gifts"
          >
            {gifts.map((gift, index) => {
              const isOpened = openedSortOrders.has(gift.sortOrder);
              const isLockedFinal = gift.isFinal && !finalUnlocked;
              const canTap = !isLockedFinal;
              const showBurst = burstKey === gift.sortOrder && !isOpened;

              return (
                <li key={gift.sortOrder} className="flex justify-center">
                  <motion.button
                    type="button"
                    disabled={isLockedFinal}
                    onClick={() => handleOpen(gift)}
                    aria-disabled={isLockedFinal}
                    aria-label={
                      gift.isFinal
                        ? isLockedFinal
                          ? `Final gift — locked. Open ${remaining} more gift${remaining === 1 ? "" : "s"} first.`
                          : isOpened
                            ? "Final gift — opened, tap to view again"
                            : "Final gift — unlocked, tap to open"
                        : isOpened
                          ? `Gift ${index + 1} — opened, tap to view again`
                          : `Gift ${index + 1} — closed, tap to open`
                    }
                    className={cn(
                      "relative flex w-full max-w-[13.5rem] flex-col items-center border-0 bg-transparent p-0.5 shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8799A]/60 sm:max-w-[15rem]",
                      canTap && "cursor-pointer",
                      isLockedFinal && "cursor-not-allowed",
                    )}
                    initial={
                      reduceMotion ? false : { opacity: 0, y: 22, scale: 0.88 }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: isOpened ? 0.9 : 1,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: reduceMotion ? 0 : 0.06 + index * 0.07,
                      ease: EASE_OUT,
                    }}
                    whileHover={
                      canTap && !reduceMotion
                        ? { scale: 1.05, y: -5 }
                        : undefined
                    }
                    whileTap={
                      canTap && !reduceMotion ? { scale: 0.96 } : undefined
                    }
                  >
                    <motion.div
                      className={cn(
                        "relative w-full",
                        gift.isFinal &&
                          finalUnlocked &&
                          !isOpened &&
                          "drop-shadow-[0_0_28px_rgba(212,175,55,0.55)]",
                        canTap &&
                          !isOpened &&
                          !gift.isFinal &&
                          "drop-shadow-[0_12px_28px_rgba(196,91,122,0.32)]",
                        isOpened && "drop-shadow-none",
                      )}
                      animate={{ y: 0 }}
                    >
                      {canTap && !isOpened ? (
                        <div
                          className={cn(
                            "pointer-events-none absolute inset-x-[10%] top-[16%] bottom-[20%] rounded-full opacity-55 blur-2xl",
                            gift.isFinal ? "bg-[#F0D78A]/6" : "bg-[#FFD0E0]/65",
                          )}
                        />
                      ) : null}

                      {/* Gift motif — closed wrapped vs open (lid aside + glow) */}
                      <div className="relative mx-auto aspect-[5/5.4] w-full">
                        <AnimatePresence mode="wait" initial={false}>
                          {isOpened ? (
                            <motion.div
                              key="open"
                              className="absolute inset-x-[-4%] top-[6%] h-[90%] w-[108%]"
                              initial={
                                reduceMotion
                                  ? false
                                  : { opacity: 0, scale: 0.88, rotate: -2 }
                              }
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.45, ease: EASE_POP }}
                            >
                              <BloomGiftBox
                                className="h-full w-full"
                                variant="open"
                                tone={gift.isFinal ? "gold" : "bloom"}
                                animateLid={!reduceMotion}
                                reduceMotion={!!reduceMotion}
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="closed"
                              className="absolute inset-0"
                              initial={false}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.05 }}
                              transition={{ duration: 0.3, ease: EASE_OUT }}
                            >
                              <BloomGiftBox
                                className="h-full w-full"
                                variant="closed"
                                tone={gift.isFinal ? "gold" : "bloom"}
                                reduceMotion={!!reduceMotion}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <AnimatePresence>
                        {isLockedFinal ? (
                          <motion.div
                            key="lock"
                            className="pointer-events-none absolute inset-0 flex items-center justify-center pt-10"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85, y: -8 }}
                            transition={{ duration: 0.4, ease: EASE_OUT }}
                          >
                            <PadlockBadge />
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      <AnimatePresence>
                        {showBurst ? (
                          <motion.div
                            key={`burst-${gift.sortOrder}`}
                            className="pointer-events-none absolute inset-0"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <OpenBurst reduceMotion={!!reduceMotion} />
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  </motion.button>
                </li>
              );
            })}
          </ul>

          <motion.p
            className="mt-6 shrink-0 font-mono text-[10px] tracking-widest text-[#8B3A55]/50 uppercase sm:mt-8"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            treasures.gift-grid · Theme Lab
          </motion.p>
        </div>
      </div>
    </div>
  );
}
