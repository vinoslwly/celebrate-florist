"use client";

import { useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";
import { useCelebrateReducedMotion } from "@/features/experience/scene-engine/shared/motion";
import { SkyGiftBox } from "@/features/experience/scene-engine/sky/moments/sky-gift-box";
import type { SkyTreasuresSceneProps } from "@/features/experience/scene-engine/sky/treasures/types";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_POP = [0.22, 1.35, 0.36, 1] as const;

const INK = "#1E3A5F";
const SKY_SOFT = "#C5DCEF";
const PEARL_GLOW = "rgba(255,255,255,0.85)";

/** Theme Lab default — 5 sky + 1 Final Pearl (white). */
export const SKY_TREASURES_LAB_GRID_GIFT_COUNT = 6;

type LabGift = {
  sortOrder: number;
  isFinal: boolean;
};

const OPEN_BURST = [
  { x: -36, y: -48, rotate: -20 },
  { x: 40, y: -52, rotate: 18 },
  { x: -52, y: -8, rotate: -8 },
  { x: 56, y: -4, rotate: 12 },
  { x: -18, y: -68, rotate: 6 },
  { x: 22, y: -70, rotate: -10 },
] as const;

function SoftStar({
  className,
  fill = "#F0D878",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden fill={fill}>
      <path d="M8 0.5 9.2 6.8 15.5 8 9.2 9.2 8 15.5 6.8 9.2 0.5 8 6.8 6.8Z" />
    </svg>
  );
}

function TinySkyHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 18" className={className} aria-hidden fill="none">
      <path
        d="M10 16C4 11 1 8 1 5.2 1 2.8 2.9 1 5.2 1 7 1 8.6 2 10 3.4 11.4 2 13 1 14.8 1 17.1 1 19 2.8 19 5.2 19 8 16 11 10 16Z"
        fill="#7EB6D9"
      />
    </svg>
  );
}

/** Pearl padlock — soft silver seal for Final presentation lock. */
function PearlPadlockBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-12 w-12 items-center justify-center rounded-full",
        className,
      )}
      style={{
        background:
          "radial-gradient(circle at 32% 28%, #FFFFFF 0%, #F4F8FC 40%, #D6EAF6 78%, #A8C8E0 100%)",
        boxShadow:
          "0 10px 22px -6px rgba(30,58,95,0.4), 0 0 0 2px rgba(255,255,255,0.9), 0 0 24px rgba(255,255,255,0.55)",
      }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <rect
          x="6"
          y="11"
          width="12"
          height="9"
          rx="2"
          fill="#5A9BC4"
          stroke="#1E3A5F"
          strokeWidth="1.1"
        />
        <path
          d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11"
          stroke="#1E3A5F"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="15.5" r="1.35" fill="#FFFEFB" />
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
            <TinySkyHeart className="h-3.5 w-3.5" />
          ) : (
            <SoftStar className="h-3 w-3" fill="#FFFEFB" />
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

export type SkyTreasuresGiftGridSceneProps = SkyTreasuresSceneProps & {
  openedSortOrders: ReadonlySet<number>;
  onSelectGift: (sortOrder: number) => void;
};

/**
 * sky.treasures.gift-grid — Scene 6.
 * 5 sky gifts + Final Pearl (white, not gold). Locked until non-finals opened (FD-S11-17).
 * Quiet Sky field — gift grid is the hero.
 */
export function SkyTreasuresGiftGridScene({
  openedSortOrders,
  onSelectGift,
}: SkyTreasuresGiftGridSceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
  const gifts = useMemo(
    () => buildLabGifts(SKY_TREASURES_LAB_GRID_GIFT_COUNT),
    [],
  );
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
    <div className={SCENE_VIEWPORT_LOCK} style={{ backgroundColor: SKY_SOFT }}>
      {/* Fixed wash — covers full host; no scroll seam */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 80% 55% at 50% -6%, rgba(255,255,255,0.65) 0%, transparent 55%)",
            `linear-gradient(180deg, #E4F0F9 0%, ${SKY_SOFT} 48%, ${SKY_SOFT} 100%)`,
          ].join(", "),
        }}
      />

      {/* Sparse quiet accents */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[7%] left-1/2 z-[1] -translate-x-1/2"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 0.55, ease: EASE_OUT }}
      >
        <SoftStar className="h-4 w-4" fill="#F0D878" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[11%] left-[14%] z-[1] opacity-50"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <SoftStar className="h-2.5 w-2.5" fill="#FFFEFB" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[10%] right-[14%] z-[1] opacity-45"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ delay: 0.28, duration: 0.5 }}
      >
        <SoftStar className="h-2.5 w-2.5" fill="#D6EAF6" />
      </motion.div>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch]">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-5 pb-10 sm:px-6 sm:pt-7 sm:pb-12">
          <motion.p
            className="max-w-lg shrink-0 text-center font-serif text-[1.35rem] leading-snug font-semibold sm:text-[1.65rem]"
            style={{ color: INK }}
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
              const tone = gift.isFinal ? "pearl" : "sky";

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
                          ? `Final pearl gift — locked. Open ${remaining} more gift${remaining === 1 ? "" : "s"} first.`
                          : isOpened
                            ? "Final pearl gift — opened, tap to view again"
                            : "Final pearl gift — unlocked, tap to open"
                        : isOpened
                          ? `Gift ${index + 1} — opened, tap to view again`
                          : `Gift ${index + 1} — closed, tap to open`
                    }
                    className={cn(
                      "relative flex w-full max-w-[13.5rem] flex-col items-center border-0 bg-transparent p-0.5 shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7EB6D9]/60 sm:max-w-[15rem]",
                      canTap && "cursor-pointer",
                      isLockedFinal && "cursor-not-allowed",
                    )}
                    initial={
                      reduceMotion ? false : { opacity: 0, y: 22, scale: 0.88 }
                    }
                    animate={{
                      opacity: isLockedFinal ? 0.72 : 1,
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
                          !isOpened &&
                          "drop-shadow-[0_0_36px_rgba(255,255,255,0.9)]",
                        gift.isFinal &&
                          finalUnlocked &&
                          !isOpened &&
                          "drop-shadow-[0_0_42px_rgba(200,220,240,0.95)]",
                        canTap &&
                          !isOpened &&
                          !gift.isFinal &&
                          "drop-shadow-[0_12px_28px_rgba(30,58,95,0.28)]",
                        isOpened && "drop-shadow-none",
                      )}
                      animate={{ y: 0 }}
                    >
                      {canTap && !isOpened ? (
                        <div
                          className="pointer-events-none absolute inset-x-[10%] top-[16%] bottom-[20%] rounded-full opacity-55 blur-2xl"
                          style={{
                            background: gift.isFinal
                              ? PEARL_GLOW
                              : "rgba(168,208,234,0.65)",
                          }}
                        />
                      ) : null}

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
                              <SkyGiftBox
                                className="h-full w-full"
                                variant="open"
                                tone={tone}
                                animateLid={!reduceMotion}
                                reduceMotion={reduceMotion}
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
                              <SkyGiftBox
                                className="h-full w-full"
                                variant="closed"
                                tone={tone}
                                reduceMotion={reduceMotion}
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
                            <PearlPadlockBadge />
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
                            <OpenBurst reduceMotion={reduceMotion} />
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
            className="mt-6 shrink-0 font-mono text-[10px] tracking-widest uppercase opacity-45 sm:mt-8"
            style={{ color: INK }}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ delay: 0.7 }}
          >
            sky.treasures.gift-grid · Theme Lab
          </motion.p>
        </div>
      </div>
    </div>
  );
}
