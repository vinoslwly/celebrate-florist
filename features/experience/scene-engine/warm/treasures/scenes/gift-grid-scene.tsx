"use client";

import { useMemo, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import { WarmGiftBox } from "@/features/experience/scene-engine/warm/moments/warm-gift-box";
import type { WarmTreasuresSceneProps } from "@/features/experience/scene-engine/warm/treasures/types";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_POP = [0.22, 1.35, 0.36, 1] as const;

const INK = "#5C1A22";
const GOLD = "#C9A24A";
const GOLD_SOFT = "#E8D090";
const ROSE = "#A51C28";

/** Theme Lab default — 5 crimson + 1 Final Gold. */
export const WARM_TREASURES_LAB_GRID_GIFT_COUNT = 6;

type LabGift = {
  sortOrder: number;
  isFinal: boolean;
};

const FALLING_PETALS = [
  { left: "4%", delay: 0.1, duration: 7.8, size: 16, x: 16 },
  { left: "14%", delay: 0.9, duration: 8.6, size: 14, x: -12 },
  { left: "28%", delay: 1.6, duration: 7.4, size: 17, x: 10 },
  { left: "48%", delay: 0.4, duration: 9.0, size: 15, x: -14 },
  { left: "68%", delay: 1.1, duration: 8.2, size: 16, x: 12 },
  { left: "82%", delay: 0.65, duration: 7.6, size: 14, x: -10 },
  { left: "92%", delay: 1.9, duration: 8.8, size: 13, x: -8 },
] as const;

const OPEN_BURST = [
  { x: -36, y: -48, rotate: -20 },
  { x: 40, y: -52, rotate: 18 },
  { x: -52, y: -8, rotate: -8 },
  { x: 56, y: -4, rotate: 12 },
  { x: -18, y: -68, rotate: 6 },
  { x: 22, y: -70, rotate: -10 },
] as const;

function SoftPetal({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 32"
      width={size}
      height={size * 1.33}
      aria-hidden
      fill="none"
    >
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#C42838"
        opacity="0.9"
      />
    </svg>
  );
}

function TinyGoldHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 18" className={className} aria-hidden fill="none">
      <path
        d="M10 16C4 11 1 8 1 5.2 1 2.8 2.9 1 5.2 1 7 1 8.6 2 10 3.4 11.4 2 13 1 14.8 1 17.1 1 19 2.8 19 5.2 19 8 16 11 10 16Z"
        fill={GOLD}
      />
    </svg>
  );
}

/** Gold seal padlock — Final Treasure presentation lock (FD-S11-17). */
function GoldPadlockBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full shadow-lg",
        className,
      )}
      style={{
        background: `radial-gradient(circle at 35% 30%, ${GOLD_SOFT} 0%, ${GOLD} 55%, #8B6B28 100%)`,
        boxShadow:
          "0 8px 18px -6px rgba(80,40,10,0.45), 0 0 0 2px rgba(232,208,144,0.35)",
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
          fill="#5C3428"
          stroke="#3A1A14"
          strokeWidth="1.2"
        />
        <path
          d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11"
          stroke="#3A1A14"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="15.5" r="1.3" fill={GOLD_SOFT} />
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
            <TinyGoldHeart className="h-3.5 w-3.5" />
          ) : (
            <span
              className="block h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: GOLD_SOFT,
                boxShadow: "0 0 8px rgba(232,208,144,0.8)",
              }}
            />
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

export type WarmTreasuresGiftGridSceneProps = WarmTreasuresSceneProps & {
  openedSortOrders: ReadonlySet<number>;
  onSelectGift: (sortOrder: number) => void;
};

/**
 * warm.treasures.gift-grid — Scene 6.
 * 5 crimson + 1 Final Gold. Final locked until all non-final opened (FD-S11-17).
 * Mirrors Bloom Treasures grid; Warm red/gold only.
 */
export function WarmTreasuresGiftGridScene({
  openedSortOrders,
  onSelectGift,
}: WarmTreasuresGiftGridSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const gifts = useMemo(
    () => buildLabGifts(WARM_TREASURES_LAB_GRID_GIFT_COUNT),
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
    <div
      className={SCENE_VIEWPORT_SCROLL}
      style={{
        backgroundColor: "#EDE0D0",
        backgroundImage: [
          "radial-gradient(ellipse 120% 80% at 50% -5%, rgba(255,249,242,0.95) 0%, transparent 55%)",
          "radial-gradient(ellipse 70% 50% at 18% 70%, rgba(201,162,74,0.12) 0%, transparent 55%)",
          "radial-gradient(ellipse 65% 45% at 85% 75%, rgba(165,28,40,0.08) 0%, transparent 50%)",
          "radial-gradient(ellipse 90% 70% at 50% 100%, rgba(90,18,26,0.1) 0%, transparent 55%)",
          "linear-gradient(180deg, #FFF6EC 0%, #F5E8D8 38%, #EDE0D0 72%, #E5D4C2 100%)",
        ].join(", "),
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 min-h-full opacity-[0.08] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {!reduceMotion
        ? FALLING_PETALS.map((petal, i) => (
            <motion.div
              key={`petal-${i}`}
              className="pointer-events-none absolute top-[-10%] z-[1]"
              style={{ left: petal.left }}
              animate={{
                y: ["0vh", "115vh"],
                opacity: [0, 0.75, 0.6, 0],
                rotate: [0, 45, -25, 18],
                x: [0, petal.x, petal.x * 0.4],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <SoftPetal size={petal.size} />
            </motion.div>
          ))
        : null}

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-4xl flex-col items-center px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-14">
        <motion.div
          className="flex max-w-lg flex-col items-center gap-2.5"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
        >
          <div
            className="flex w-full max-w-[16rem] items-center gap-2"
            aria-hidden
          >
            <span
              className="h-px flex-1"
              style={{
                background: `linear-gradient(90deg, transparent, ${GOLD})`,
              }}
            />
            <svg width="12" height="10" viewBox="0 0 14 12" fill="none">
              <path
                d="M7 11S1.8 7.5.8 4.8C.1 3.2 1.2 1.4 3 1.4c1.1 0 2 .7 2.4 1.5C5.8 2.1 6.7 1.4 7.8 1.4c1.8 0 2.9 1.8 2.2 3.4C9.2 7.5 7 11 7 11Z"
                fill={GOLD}
              />
            </svg>
            <span
              className="h-px flex-1"
              style={{
                background: `linear-gradient(90deg, ${GOLD}, transparent)`,
              }}
            />
          </div>
          <p
            className="text-center font-serif text-[1.3rem] leading-snug font-semibold sm:text-[1.55rem]"
            style={{ color: INK }}
            aria-live="polite"
          >
            {headline}
          </p>
          <div
            className="h-px w-full max-w-[14rem]"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            }}
            aria-hidden
          />
        </motion.div>

        <ul
          className="mt-6 grid w-full grid-cols-3 gap-x-2 gap-y-3 sm:mt-8 sm:gap-x-5 sm:gap-y-5"
          aria-label="Your gifts"
        >
          {gifts.map((gift, index) => {
            const isOpened = openedSortOrders.has(gift.sortOrder);
            const isLockedFinal = gift.isFinal && !finalUnlocked;
            const canTap = !isLockedFinal;
            const showBurst = burstKey === gift.sortOrder && !isOpened;
            const tone = gift.isFinal ? "gold" : "crimson";

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
                    "relative flex w-full max-w-[13.5rem] flex-col items-center border-0 bg-transparent p-0.5 shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24A]/60 sm:max-w-[15rem]",
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
                    canTap && !reduceMotion ? { scale: 1.05, y: -5 } : undefined
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
                        "drop-shadow-[0_0_28px_rgba(201,162,74,0.55)]",
                      canTap &&
                        !isOpened &&
                        !gift.isFinal &&
                        "drop-shadow-[0_12px_28px_rgba(100,16,24,0.28)]",
                      isOpened && "drop-shadow-none",
                    )}
                    animate={
                      !reduceMotion && canTap && !isOpened
                        ? { y: [0, -6, 0] }
                        : { y: 0 }
                    }
                    transition={
                      canTap && !isOpened && !reduceMotion
                        ? {
                            duration: 2.6 + (index % 3) * 0.25,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.15,
                          }
                        : undefined
                    }
                  >
                    {canTap && !isOpened && !reduceMotion ? (
                      <motion.div
                        className={cn(
                          "pointer-events-none absolute inset-x-[10%] top-[16%] bottom-[20%] rounded-full blur-2xl",
                          gift.isFinal ? "bg-[#F0D78A]/55" : "bg-[#A51C28]/35",
                        )}
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                          scale: [0.9, 1.08, 0.9],
                        }}
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.12,
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
                            <WarmGiftBox
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
                            <WarmGiftBox
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
                          <GoldPadlockBadge />
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
          className="mt-6 shrink-0 font-mono text-[10px] tracking-widest uppercase sm:mt-8"
          style={{ color: `${ROSE}66` }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          warm.treasures.gift-grid · Theme Lab
        </motion.p>
      </div>
    </div>
  );
}
