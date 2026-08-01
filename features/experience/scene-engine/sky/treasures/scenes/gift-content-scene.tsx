"use client";

import { useMemo } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";
import { SkyGiftBox } from "@/features/experience/scene-engine/sky/moments/sky-gift-box";
import type { SkyTreasuresScenePayload } from "@/features/experience/scene-engine/sky/treasures/types";
import {
  getSkyTreasuresLabEnvelope,
  SKY_TREASURES_LAB_ENVELOPES,
  type SkyTreasuresLabEnvelope,
} from "@/features/theme-lab/config/sky-treasures-fixtures";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_POP = [0.16, 1.2, 0.3, 1] as const;

const INK = "#1E3A5F";
const INK_SOFT = "#3D7AAD";
const SKY_SOFT = "#C5DCEF";
const CREAM = "#FFFEFB";

type GridGift = {
  sortOrder: number;
  isFinal: boolean;
  isOpened: boolean;
  isActive: boolean;
};

function SkyWaxSeal({
  className,
  pearl,
}: {
  className?: string;
  pearl?: boolean;
}) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill="none">
      <circle
        cx="24"
        cy="24"
        r="18"
        fill={pearl ? "#E8F0F8" : "#7EB6D9"}
        stroke={pearl ? "#A8C8E0" : "#5A9BC4"}
        strokeWidth="2"
      />
      <circle
        cx="24"
        cy="24"
        r="12"
        fill={pearl ? "#FFFEFB" : "#A8D0EA"}
        opacity="0.9"
      />
      <path
        d="M24 16c-3.2 2.6-5.2 4.2-5.2 6.5 0 1.7 1.3 2.9 2.8 2.9 1 0 1.9-.55 2.4-1.5.5.95 1.4 1.5 2.4 1.5 1.5 0 2.8-1.2 2.8-2.9 0-2.3-2-3.9-5.2-6.5Z"
        fill={pearl ? "#7EB6D9" : "#FFFEFB"}
      />
    </svg>
  );
}

type SkyTreasuresGiftContentSceneProps = {
  payload: SkyTreasuresScenePayload;
  sortOrder: number;
  openedSortOrders: ReadonlySet<number>;
  onBack: () => void;
};

/**
 * sky.treasures.gift-content.{n} — Scene 7.
 * Grid atmosphere + stationery letter. Back → gift-grid (FD-S11-02).
 * Final uses pearl tone (white), not gold.
 */
export function SkyTreasuresGiftContentScene({
  sortOrder,
  openedSortOrders,
  onBack,
}: SkyTreasuresGiftContentSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const envelope: SkyTreasuresLabEnvelope = useMemo(
    () =>
      getSkyTreasuresLabEnvelope(sortOrder) ?? {
        sortOrder,
        isFinal: false,
        title: `Gift ${sortOrder}`,
        messageText: "A small surprise, just for you.",
        photoUrl: null,
      },
    [sortOrder],
  );

  const gridGifts: GridGift[] = useMemo(
    () =>
      SKY_TREASURES_LAB_ENVELOPES.map((e) => ({
        sortOrder: e.sortOrder,
        isFinal: e.isFinal,
        isOpened:
          openedSortOrders.has(e.sortOrder) || e.sortOrder === sortOrder,
        isActive: e.sortOrder === sortOrder,
      })),
    [openedSortOrders, sortOrder],
  );

  return (
    <div className={SCENE_VIEWPORT_LOCK} style={{ backgroundColor: SKY_SOFT }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 80% 55% at 50% -6%, rgba(255,255,255,0.55) 0%, transparent 55%)",
            `linear-gradient(180deg, #E4F0F9 0%, ${SKY_SOFT} 48%, ${SKY_SOFT} 100%)`,
          ].join(", "),
        }}
      />

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
                    ? "scale-100 opacity-90 drop-shadow-[0_0_24px_rgba(255,255,255,0.55)]"
                    : "scale-[0.94] opacity-35",
                )}
              >
                <div className="relative mx-auto aspect-[5/5.4] w-full">
                  <SkyGiftBox
                    className="h-full w-full"
                    variant={gift.isOpened ? "open" : "closed"}
                    tone={gift.isFinal ? "pearl" : "sky"}
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
            "radial-gradient(ellipse 55% 50% at 50% 45%, rgba(255,255,255,0.12) 0%, rgba(30,58,95,0.22) 100%)",
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
                background: envelope.isFinal
                  ? "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.95) 0%, rgba(200,220,236,0.45) 48%, transparent 72%)"
                  : "radial-gradient(circle at 50% 40%, rgba(232,244,252,0.95) 0%, rgba(126,182,217,0.35) 48%, transparent 72%)",
              }}
            />

            <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2">
              <SkyWaxSeal
                className="h-12 w-12 drop-shadow-md"
                pearl={envelope.isFinal}
              />
            </div>

            <article
              className="relative rounded-[1.5rem] px-6 pt-11 pb-7 sm:px-8 sm:pt-12 sm:pb-8"
              style={{
                background: envelope.isFinal
                  ? `linear-gradient(165deg, ${CREAM} 0%, #F4F8FC 45%, #E4EEF7 100%)`
                  : `linear-gradient(165deg, ${CREAM} 0%, #F0F7FC 45%, #D6EAF6 100%)`,
                boxShadow: envelope.isFinal
                  ? "0 28px 60px -22px rgba(30,58,95,0.35), 0 0 0 1px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.95)"
                  : "0 28px 60px -22px rgba(30,58,95,0.4), 0 0 0 1px rgba(168,208,234,0.55), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-[11px] rounded-[1.15rem] border"
                style={{
                  borderColor: envelope.isFinal
                    ? "rgba(184,208,228,0.65)"
                    : "rgba(126,182,217,0.4)",
                }}
              />

              <div className="relative">
                <p
                  className="text-center font-serif text-[11px] tracking-[0.22em] uppercase"
                  style={{ color: INK_SOFT }}
                >
                  {envelope.isFinal ? "Final treasure" : "A little treasure"}
                </p>
                <h2
                  className="mt-2 text-center font-serif text-[1.65rem] leading-tight font-semibold sm:text-[1.85rem]"
                  style={{ color: INK }}
                >
                  {envelope.title}
                </h2>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="h-px w-8 bg-[#A8C8E0]/70" />
                  <span className="text-[#7EB6D9]">✦</span>
                  <span className="h-px w-8 bg-[#A8C8E0]/70" />
                </div>

                {envelope.messageText ? (
                  <div className="mt-5">
                    <p
                      className="text-center font-serif text-sm italic"
                      style={{ color: INK_SOFT }}
                    >
                      For you
                    </p>
                    <p
                      className="mt-3 text-center font-serif text-[1.05rem] leading-[1.75] sm:text-[1.15rem]"
                      style={{ color: INK }}
                    >
                      {envelope.messageText}
                    </p>
                  </div>
                ) : null}

                {envelope.photoUrl ? (
                  <div className="mt-6">
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-px w-8 bg-[#A8C8E0]/70" />
                      <span className="text-[#7EB6D9]">✦</span>
                      <span className="h-px w-8 bg-[#A8C8E0]/70" />
                    </div>
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
                            "0 14px 32px -12px rgba(30,58,95,0.35), 0 0 0 1px rgba(168,208,234,0.5)",
                        }}
                      >
                        <div className="overflow-hidden rounded-[0.35rem] bg-[#E8F4FC]">
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
                  <SkyWaxSeal
                    className="h-9 w-9 scale-90 opacity-80"
                    pearl={envelope.isFinal}
                  />
                </div>
              </div>
            </article>
          </motion.div>

          <p
            className="pointer-events-none mt-8 text-center text-sm"
            style={{ color: INK }}
          >
            Tap outside the letter to close
          </p>
        </div>
      </div>
    </div>
  );
}
