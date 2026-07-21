"use client";

import { useMemo } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import { BloomGiftBox } from "@/features/experience/scene-engine/shared/bloom-gift-box";
import type { TreasuresScenePayload } from "@/features/experience/scene-engine/treasures/types";
import type { BloomTreasuresLabEnvelope } from "@/features/theme-lab/config/bloom-treasures-fixtures";
import {
  BLOOM_TREASURES_LAB_ENVELOPES,
  getBloomTreasuresLabEnvelope,
} from "@/features/theme-lab/config/bloom-treasures-fixtures";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_POP = [0.16, 1.2, 0.3, 1] as const;

const FALLING_PETALS = [
  { left: "4%", delay: 0.1, duration: 7.8, size: 18, x: 18 },
  { left: "12%", delay: 0.9, duration: 8.6, size: 15, x: -14 },
  { left: "22%", delay: 1.8, duration: 7.4, size: 20, x: 10 },
  { left: "38%", delay: 0.35, duration: 9.0, size: 16, x: -12 },
  { left: "52%", delay: 1.2, duration: 8.2, size: 22, x: 16 },
  { left: "66%", delay: 0.55, duration: 7.6, size: 17, x: -18 },
  { left: "78%", delay: 1.5, duration: 8.8, size: 19, x: 8 },
  { left: "88%", delay: 0.75, duration: 7.9, size: 14, x: -10 },
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
        fill="#F7A8BE"
        opacity="0.92"
      />
    </svg>
  );
}

function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 56" className={className} aria-hidden fill="none">
      <path
        d="M8 48 C8 32 14 22 26 14 C20 24 22 32 34 38 C24 36 16 40 8 48Z"
        fill="#F4B8C8"
        opacity="0.9"
      />
      <path
        d="M10 46 C16 34 26 28 38 26"
        stroke="#E890A8"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.75"
      />
      <circle cx="16" cy="40" r="2.4" fill="#F7A8BE" />
      <circle cx="26" cy="32" r="1.8" fill="#F7C4D4" />
      <circle cx="34" cy="28" r="1.2" fill="#FFE4EE" />
    </svg>
  );
}

function WaxSeal({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-12 w-12 items-center justify-center rounded-full shadow-[0_6px_16px_-4px_rgba(180,60,100,0.45)]",
        className,
      )}
      style={{
        background:
          "radial-gradient(circle at 35% 30%, #F7C4D4 0%, #E8799A 55%, #C45B7A 100%)",
      }}
      aria-hidden
    >
      <svg viewBox="0 0 20 18" className="h-5 w-5" fill="none">
        <path
          d="M10 16C4 11 1 8 1 5.2 1 2.8 2.9 1 5.2 1 7 1 8.6 2 10 3.4 11.4 2 13 1 14.8 1 17.1 1 19 2.8 19 5.2 19 8 16 11 10 16Z"
          fill="#FFF6F0"
          opacity="0.95"
        />
      </svg>
    </div>
  );
}

function FloralDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      aria-hidden
    >
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#E8A0B4]/70" />
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="12"
            cy="7"
            rx="3.2"
            ry="5.5"
            fill="#F7A8BE"
            transform={`rotate(${deg} 12 12)`}
            opacity="0.85"
          />
        ))}
        <circle cx="12" cy="12" r="2.2" fill="#FFF4E8" />
      </svg>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#E8A0B4]/70" />
    </div>
  );
}

type GridGift = {
  sortOrder: number;
  isFinal: boolean;
  isOpened: boolean;
  isActive: boolean;
};

type TreasuresGiftContentSceneProps = {
  payload: TreasuresScenePayload;
  sortOrder: number;
  openedSortOrders: ReadonlySet<number>;
  onBack: () => void;
};

/**
 * Scene 7 — Individual Gift content (Theme Lab living).
 * Scene 6 atmosphere + neat 3×2 gift grid behind a stationery letter object.
 * Back edge → gift-grid (FD-S11-02). Click outside letter closes.
 */
export function TreasuresGiftContentScene({
  sortOrder,
  openedSortOrders,
  onBack,
}: TreasuresGiftContentSceneProps) {
  const reduceMotion = useReducedMotion();
  const envelope: BloomTreasuresLabEnvelope = useMemo(
    () =>
      getBloomTreasuresLabEnvelope(sortOrder) ?? {
        sortOrder,
        isFinal: false,
        title: `Envelope ${sortOrder}`,
        messageText: "A small surprise, just for you.",
        photoUrl: null,
      },
    [sortOrder],
  );

  const gridGifts: GridGift[] = useMemo(
    () =>
      BLOOM_TREASURES_LAB_ENVELOPES.map((e) => ({
        sortOrder: e.sortOrder,
        isFinal: e.isFinal,
        isOpened:
          openedSortOrders.has(e.sortOrder) || e.sortOrder === sortOrder,
        isActive: e.sortOrder === sortOrder,
      })),
    [openedSortOrders, sortOrder],
  );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Scene 6 atmosphere */}
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
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 40%, rgba(180,80,110,0.14) 100%)",
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
              <SoftPetal size={petal.size} />
            </motion.div>
          ))
        : null}

      {!reduceMotion
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

      {/* Grid layer — Scene 6 neat 3×2, softened behind the letter */}
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
                    ? "scale-100 opacity-90 drop-shadow-[0_0_24px_rgba(232,121,154,0.5)]"
                    : "scale-[0.94] opacity-40",
                )}
              >
                <div className="relative mx-auto aspect-[5/5.4] w-full">
                  <BloomGiftBox
                    className="h-full w-full"
                    variant={gift.isOpened ? "open" : "closed"}
                    tone={gift.isFinal ? "gold" : "bloom"}
                    reduceMotion={!!reduceMotion}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Soft focus veil */}
      <div
        className="pointer-events-none absolute inset-0 z-[12]"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 45%, rgba(255,248,250,0.15) 0%, rgba(160,70,100,0.28) 100%)",
        }}
      />

      {/*
        Scrollable layer — must accept pointer events (wheel/touch).
        Click empty padding dismisses; letter stops propagation.
        justify-start + top padding so the wax seal is never clipped.
      */}
      <div
        className="relative z-20 min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
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
              className="pointer-events-none absolute -inset-8 top-0 rounded-[2.5rem] blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(255,240,230,0.95) 0%, rgba(247,168,190,0.4) 50%, transparent 72%)",
              }}
            />

            {/* Seal sits in reserved top padding — not clipped */}
            <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2">
              <WaxSeal />
            </div>

            <article
              className="relative rounded-[1.5rem] px-6 pt-11 pb-7 sm:px-8 sm:pt-12 sm:pb-8"
              style={{
                background:
                  "linear-gradient(165deg, #FFFCF8 0%, #FFF5F7 42%, #FFE8EF 100%)",
                boxShadow:
                  "0 28px 60px -22px rgba(140,55,90,0.5), 0 0 0 1px rgba(240,180,200,0.55), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.5rem] opacity-45"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.75) 0%, transparent 35%), radial-gradient(circle at 80% 85%, rgba(247,168,190,0.28) 0%, transparent 40%)",
                }}
              />

              <CornerFlourish className="absolute top-2 left-2 h-12 w-12 opacity-90" />
              <CornerFlourish className="absolute top-2 right-2 h-12 w-12 scale-x-[-1] opacity-90" />
              <CornerFlourish className="absolute bottom-2 left-2 h-12 w-12 scale-y-[-1] opacity-65" />
              <CornerFlourish className="absolute right-2 bottom-2 h-12 w-12 scale-[-1] opacity-65" />

              <div className="relative">
                <p className="text-center font-serif text-[11px] tracking-[0.22em] text-[#C45B7A]/90 uppercase">
                  A little treasure
                </p>
                <h2 className="mt-2 text-center font-serif text-[1.65rem] leading-tight font-semibold text-[#6B3048] sm:text-[1.85rem]">
                  {envelope.title}
                </h2>

                <FloralDivider className="mt-4" />

                {envelope.messageText ? (
                  <div className="mt-5">
                    <p className="text-center font-serif text-sm italic text-[#D46888]">
                      For you
                    </p>
                    <p className="mt-3 text-center font-serif text-[1.05rem] leading-[1.75] text-[#5C3A2E] sm:text-[1.15rem]">
                      {envelope.messageText}
                    </p>
                  </div>
                ) : null}

                {envelope.photoUrl ? (
                  <div className="mt-6">
                    <FloralDivider />
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
                        className="rounded-[0.65rem] bg-white p-2.5 pb-8"
                        style={{
                          boxShadow:
                            "0 14px 32px -12px rgba(120,50,80,0.4), 0 0 0 1px rgba(240,200,210,0.5)",
                        }}
                      >
                        <div className="overflow-hidden rounded-[0.35rem] bg-[#F8E8EC]">
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
                  <WaxSeal className="h-9 w-9 scale-90 opacity-80" />
                </div>
              </div>
            </article>
          </motion.div>

          <p className="pointer-events-none mt-8 text-center text-sm text-[#7A2F48]/90">
            Tap outside the letter to close 🤍
          </p>
        </div>
      </div>
    </div>
  );
}
