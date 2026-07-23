"use client";

import { useMemo } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import { WarmGiftBox } from "@/features/experience/scene-engine/warm/moments/warm-gift-box";
import type { WarmTreasuresScenePayload } from "@/features/experience/scene-engine/warm/treasures/types";
import {
  getWarmTreasuresLabEnvelope,
  WARM_TREASURES_LAB_ENVELOPES,
  type WarmTreasuresLabEnvelope,
} from "@/features/theme-lab/config/warm-treasures-fixtures";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_POP = [0.16, 1.2, 0.3, 1] as const;

const INK = "#3A1A14";
const INK_SOFT = "#5C3428";
const GOLD = "#C9A24A";
const GOLD_SOFT = "#E8D090";
const ROSE = "#A51C28";

const FALLING_PETALS = [
  { left: "4%", delay: 0.1, duration: 7.8, size: 16, x: 16 },
  { left: "14%", delay: 0.9, duration: 8.6, size: 14, x: -12 },
  { left: "28%", delay: 1.6, duration: 7.4, size: 17, x: 10 },
  { left: "48%", delay: 0.4, duration: 9.0, size: 15, x: -14 },
  { left: "68%", delay: 1.1, duration: 8.2, size: 16, x: 12 },
  { left: "82%", delay: 0.65, duration: 7.6, size: 14, x: -10 },
  { left: "92%", delay: 1.9, duration: 8.8, size: 13, x: -8 },
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
        opacity="0.88"
      />
    </svg>
  );
}

function GoldCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 56" className={className} aria-hidden fill="none">
      <path
        d="M8 48 C8 32 14 22 26 14 C20 24 22 32 34 38 C24 36 16 40 8 48Z"
        fill={GOLD}
        opacity="0.88"
      />
      <path
        d="M10 46 C16 34 26 28 38 26"
        stroke={GOLD_SOFT}
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.75"
      />
      <circle cx="16" cy="40" r="2.2" fill={GOLD_SOFT} />
      <circle cx="26" cy="32" r="1.6" fill={GOLD} opacity="0.7" />
      <path
        d="M6 18 L6 8 L16 8"
        stroke={GOLD}
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

function CrimsonWaxSeal({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-12 w-12 items-center justify-center rounded-full",
        className,
      )}
      style={{
        background: `radial-gradient(circle at 35% 30%, #C42838 0%, ${ROSE} 55%, #6B1018 100%)`,
        boxShadow:
          "0 8px 18px -6px rgba(60,8,12,0.5), 0 0 0 2px rgba(201,162,74,0.4)",
      }}
      aria-hidden
    >
      <svg viewBox="0 0 20 18" className="h-5 w-5" fill="none">
        <path
          d="M10 16C4 11 1 8 1 5.2 1 2.8 2.9 1 5.2 1 7 1 8.6 2 10 3.4 11.4 2 13 1 14.8 1 17.1 1 19 2.8 19 5.2 19 8 16 11 10 16Z"
          fill={GOLD_SOFT}
          opacity="0.95"
        />
      </svg>
    </div>
  );
}

function GoldHeartDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2.5", className)}
      aria-hidden
    >
      <span
        className="h-px w-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD})`,
        }}
      />
      <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
        <path
          d="M7 11S1.8 7.5.8 4.8C.1 3.2 1.2 1.4 3 1.4c1.1 0 2 .7 2.4 1.5C5.8 2.1 6.7 1.4 7.8 1.4c1.8 0 2.9 1.8 2.2 3.4C9.2 7.5 7 11 7 11Z"
          fill={GOLD}
        />
      </svg>
      <span
        className="h-px w-10"
        style={{
          background: `linear-gradient(90deg, ${GOLD}, transparent)`,
        }}
      />
    </div>
  );
}

type WarmTreasuresGiftContentSceneProps = {
  payload: WarmTreasuresScenePayload;
  sortOrder: number;
  openedSortOrders: ReadonlySet<number>;
  onBack: () => void;
};

/**
 * warm.treasures.gift-content.{n} — Scene 7.
 * Mirrors Bloom Treasures: softened gift grid behind + stationery letter object.
 * Warm crimson/gold only. Back edge → gift-grid (FD-S11-02). Tap outside to close.
 */
export function WarmTreasuresGiftContentScene({
  sortOrder,
  openedSortOrders,
  onBack,
}: WarmTreasuresGiftContentSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const envelope: WarmTreasuresLabEnvelope = useMemo(
    () =>
      getWarmTreasuresLabEnvelope(sortOrder) ?? {
        sortOrder,
        isFinal: false,
        title: `Gift ${sortOrder}`,
        messageText: "A small surprise, just for you.",
        photoUrl: null,
      },
    [sortOrder],
  );

  const gridGifts = useMemo(
    () =>
      WARM_TREASURES_LAB_ENVELOPES.map((e) => ({
        sortOrder: e.sortOrder,
        isFinal: e.isFinal,
        isOpened:
          openedSortOrders.has(e.sortOrder) || e.sortOrder === sortOrder,
        isActive: e.sortOrder === sortOrder,
      })),
    [openedSortOrders, sortOrder],
  );

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
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

      {/* Softened Scene 6 grid behind the letter */}
      <div className="pointer-events-none absolute inset-0 z-[11] flex items-center justify-center px-4 pt-4 pb-10">
        <ul
          className="grid w-full max-w-4xl grid-cols-3 gap-x-2 gap-y-3 sm:gap-x-5 sm:gap-y-5"
          aria-hidden
        >
          {gridGifts.map((gift) => (
            <li key={gift.sortOrder} className="flex justify-center">
              <div
                className={cn(
                  "relative w-full max-w-[13.5rem] transition-all duration-500 sm:max-w-[15rem]",
                  gift.isActive
                    ? "scale-100 opacity-90 drop-shadow-[0_0_24px_rgba(201,162,74,0.45)]"
                    : "scale-[0.94] opacity-35",
                )}
              >
                <div className="relative mx-auto aspect-[5/5.4] w-full">
                  <WarmGiftBox
                    className="h-full w-full"
                    variant={gift.isOpened ? "open" : "closed"}
                    tone={gift.isFinal ? "gold" : "crimson"}
                    reduceMotion={reduceMotion}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[12]"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 45%, rgba(255,249,242,0.12) 0%, rgba(58,8,12,0.34) 100%)",
        }}
      />

      <div
        className="relative z-20 min-h-0 flex-1 overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
        onClick={onBack}
        role="presentation"
      >
        <div className="mx-auto flex w-full max-w-[24rem] flex-col items-center px-4 pt-10 pb-24 sm:pt-12 sm:pb-28">
          <motion.div
            className="relative w-full pt-7"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 48, scale: 0.92, rotate: -1.5 }
            }
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 0.65, ease: EASE_POP }}
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 top-0 rounded-[2.5rem] blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(255,246,236,0.9) 0%, rgba(201,162,74,0.28) 48%, transparent 72%)",
              }}
            />

            <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2">
              <CrimsonWaxSeal />
            </div>

            <article
              className="relative rounded-[1.5rem] px-6 pt-11 pb-7 sm:px-8 sm:pt-12 sm:pb-8"
              style={{
                background:
                  "linear-gradient(165deg, #FFFCF8 0%, #FFF6EC 45%, #F5E8D8 100%)",
                boxShadow:
                  "0 28px 60px -22px rgba(40,8,12,0.5), 0 0 0 1px rgba(201,162,74,0.4), inset 0 1px 0 rgba(255,255,255,0.75)",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-[11px] rounded-[1.15rem] border"
                style={{ borderColor: "rgba(201,162,74,0.4)" }}
              />

              <GoldCorner className="absolute top-2.5 left-2.5 h-11 w-11" />
              <GoldCorner className="absolute top-2.5 right-2.5 h-11 w-11 rotate-90" />
              <GoldCorner className="absolute bottom-2.5 left-2.5 h-11 w-11 -rotate-90 opacity-70" />
              <GoldCorner className="absolute right-2.5 bottom-2.5 h-11 w-11 rotate-180 opacity-70" />

              <div className="relative">
                <p
                  className="text-center font-serif text-[11px] tracking-[0.22em] uppercase"
                  style={{ color: GOLD }}
                >
                  {envelope.isFinal ? "Final treasure" : "A little treasure"}
                </p>
                <h2
                  className="mt-2 text-center font-serif text-[1.65rem] leading-tight font-semibold sm:text-[1.85rem]"
                  style={{ color: INK }}
                >
                  {envelope.title}
                </h2>

                <GoldHeartDivider className="mt-4" />

                {envelope.messageText ? (
                  <div className="mt-5">
                    <p
                      className="text-center font-serif text-sm italic"
                      style={{ color: ROSE }}
                    >
                      For you
                    </p>
                    <p
                      className="mt-3 text-center font-serif text-[1.05rem] leading-[1.75] sm:text-[1.15rem]"
                      style={{ color: INK_SOFT }}
                    >
                      {envelope.messageText}
                    </p>
                  </div>
                ) : null}

                {envelope.photoUrl ? (
                  <div className="mt-6">
                    <GoldHeartDivider />
                    <motion.div
                      className="mx-auto mt-5 max-w-[15rem] rotate-[-1.5deg]"
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.25,
                        duration: 0.45,
                        ease: EASE_OUT,
                      }}
                    >
                      <div
                        className="rounded-[0.65rem] p-2.5 pb-8"
                        style={{
                          background:
                            "linear-gradient(165deg, #FFFCF8 0%, #F8EDE0 100%)",
                          boxShadow:
                            "0 14px 32px -12px rgba(40,8,12,0.35), 0 0 0 1px rgba(201,162,74,0.35)",
                        }}
                      >
                        <div className="overflow-hidden rounded-[0.35rem] bg-[#EDE0D0]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={envelope.photoUrl}
                            alt=""
                            className="aspect-[4/3] w-full object-cover"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ) : null}

                <div className="mt-6 flex justify-center">
                  <CrimsonWaxSeal className="h-9 w-9 scale-90 opacity-85" />
                </div>
              </div>
            </article>
          </motion.div>

          <p
            className="pointer-events-none mt-8 text-center font-serif text-sm"
            style={{ color: `${ROSE}CC` }}
          >
            Tap outside the letter to close
          </p>
        </div>
      </div>
    </div>
  );
}
