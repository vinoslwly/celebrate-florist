"use client";

import { Cormorant_Garamond, Great_Vibes, Outfit } from "next/font/google";

import { motion } from "framer-motion";

import { galleryCaptionCopy } from "@/features/experience/lib/photo-caption";
import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_SCROLL_PANE } from "@/features/experience/scene-engine/scene-viewport";
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_STAGGER,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const editorial = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const label = Outfit({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const INK = "#3F282C";
const ROSE = "#7A121C";
const GOLD = "#C9A227";
const CREAM = "#FFFBF5";
const PAPER = "#F4EBE0";
/** On-red field (header / closing) — high contrast vs crimson stage. */
const ON_RED = "#FFF8F0";
const ON_RED_SOFT = "#E8D4C0";
const ON_RED_GOLD = "#F0D878";

/** Deliberate Warm album strip stagger (seconds) — slightly slower than Bloom/Sky. */
const WARM_STRIP_STEP = 0.14;

/** Delicate botanical — code-built, not a sticker PNG. */
function Sprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 64" className={className} aria-hidden fill="none">
      <path
        d="M24 60 C22 40 18 24 24 6"
        stroke="#8A7048"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {[12, 22, 32, 42].map((y, i) => (
        <g key={y}>
          <circle
            cx={i % 2 === 0 ? 16 : 32}
            cy={y}
            r="3.2"
            fill="#D8C8A8"
            opacity="0.85"
          />
          <circle
            cx={i % 2 === 0 ? 14 : 34}
            cy={y + 5}
            r="2.4"
            fill="#C8B898"
            opacity="0.7"
          />
        </g>
      ))}
    </svg>
  );
}

function GoldHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 18" className={className} aria-hidden>
      <path
        d="M10 16.5S2.8 11.6 1.2 7.8C.2 5.4 1.6 2.8 4.2 2.8c1.5 0 2.7.9 3.3 2 .6-1.1 1.8-2 3.3-2 2.6 0 4 2.6 3 5C17.2 11.6 10 16.5 10 16.5Z"
        fill={GOLD}
      />
    </svg>
  );
}

function SoftRose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="11" r="7" fill="#FFF8F0" opacity="0.9" />
      <circle cx="12" cy="11" r="4.5" fill="#F0D0D0" />
      <circle cx="12" cy="11" r="2" fill="#8B1A22" />
    </svg>
  );
}

function MemoryStrip({
  photo,
  index,
  reduceMotion,
}: {
  photo: PublishedPhoto;
  index: number;
  reduceMotion: boolean;
}) {
  const { title, body } = galleryCaptionCopy(photo.caption, {
    title: "A memory",
    body: "A moment worth keeping.",
  });
  const photoLeft = index % 2 === 0;
  const n = String(index + 1).padStart(2, "0");
  const bannerTone = index % 2 === 0 ? "#7A121C" : "#A67C3A";
  const src = photo.signedUrl;

  const photoBlock = (
    <div
      className={`relative shrink-0 ${photoLeft ? "order-1" : "order-2"}`}
      style={{ rotate: photoLeft ? "-2.5deg" : "2.5deg" }}
    >
      <div
        className="bg-white p-1.5 shadow-md"
        style={{
          boxShadow: "0 10px 28px -10px rgba(60,30,20,0.28)",
        }}
      >
        <div
          className="relative h-[7.5rem] w-[6.25rem] overflow-hidden sm:h-36 sm:w-[7.5rem]"
          style={{ background: "#2A080C" }}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={title}
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, #8B1A22, #3A080C)",
              }}
            />
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: "inset 0 0 20px rgba(40,16,12,0.22)",
            }}
          />
        </div>
      </div>
      {/* Gold washi hint */}
      <div
        aria-hidden
        className={`absolute -top-1 h-2.5 w-12 opacity-80 ${photoLeft ? "left-4 rotate-[-12deg]" : "right-4 rotate-[12deg]"}`}
        style={{
          background: `linear-gradient(180deg, #F0D878, ${GOLD})`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );

  const copyBlock = (
    <div
      className={`min-w-0 flex-1 ${photoLeft ? "order-2 pl-1" : "order-1 pr-1"} ${photoLeft ? "text-left" : "text-right"}`}
    >
      <div
        className={`mb-2 inline-flex items-center px-2.5 py-0.5 ${photoLeft ? "" : "ml-auto"}`}
        style={{
          background: bannerTone,
          clipPath: photoLeft
            ? "polygon(0 0, 100% 0, 92% 100%, 0 100%)"
            : "polygon(8% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        <span
          className={`${editorial.className} text-[11px] font-semibold tracking-[0.12em] text-white`}
        >
          {n}
        </span>
      </div>
      <h2
        className={`${script.className} text-[1.65rem] leading-none sm:text-[1.85rem]`}
        style={{ color: ROSE }}
      >
        {title}
      </h2>
      <p
        className={`${editorial.className} mt-2 text-[13px] leading-relaxed sm:text-sm`}
        style={{ color: INK }}
      >
        {body}
      </p>
    </div>
  );

  return (
    <motion.article
      className="relative"
      initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: reduceMotion
          ? MOTION_DURATION.instant
          : MOTION_DURATION.ceremony,
        delay: reduceMotion ? 0 : MOTION_STAGGER.base + index * WARM_STRIP_STEP,
        ease: MOTION_EASE.out,
      }}
    >
      <div
        className="relative overflow-hidden px-3.5 py-4 sm:px-4 sm:py-5"
        style={{
          background: `linear-gradient(180deg, ${CREAM} 0%, ${PAPER} 100%)`,
          boxShadow:
            "0 14px 36px -12px rgba(10,2,4,0.45), inset 0 1px 0 rgba(255,255,255,0.75)",
          // Soft torn-edge feel via clip (subtle, not jagged clipart)
          borderRadius: "2px 3px 2px 4px",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative flex items-center gap-3 sm:gap-4">
          {photoLeft ? (
            <>
              {photoBlock}
              {copyBlock}
            </>
          ) : (
            <>
              {copyBlock}
              {photoBlock}
            </>
          )}
        </div>

        {index === 1 ? (
          <div
            className={`absolute -bottom-2 ${photoLeft ? "right-3" : "left-3"} rotate-[-4deg] px-2 py-1`}
            style={{
              background: CREAM,
              boxShadow: "0 4px 10px rgba(60,30,20,0.15)",
            }}
          >
            <p
              className={`${script.className} text-sm`}
              style={{ color: ROSE }}
            >
              The best parts
            </p>
          </div>
        ) : null}

        {index === 0 || index === 3 ? (
          <Sprig
            className={`pointer-events-none absolute h-12 w-9 opacity-70 ${photoLeft ? "-right-1 -bottom-1" : "-bottom-1 -left-1 scale-x-[-1]"}`}
          />
        ) : null}
      </div>
    </motion.article>
  );
}

/**
 * Warm Moments Scene 8 — Gallery.
 * Crimson stage + cream scrapbook strips (burgundy/gold luxury).
 * Ref: design-references/warm/moments/scene-08-gallery-reference.png
 */
export function WarmGalleryScene({ payload, onComplete }: MomentsSceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
  const photos = [...payload.photos].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const toName = payload.experience.greeting_name || "you";
  const closingDelay = reduceMotion
    ? 0
    : MOTION_STAGGER.base + Math.max(photos.length, 1) * WARM_STRIP_STEP;

  return (
    <div
      className={`${editorial.className} relative z-30 flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden`}
      style={{
        background:
          "radial-gradient(ellipse 78% 55% at 50% 18%, #8B1A22 0%, #6B0F16 42%, #4A0A10 100%)",
      }}
    >
      {/* Soft depth on crimson — not cream paper */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 55% 40% at 50% 42%, rgba(255,220,180,0.08) 0%, transparent 70%)",
            "radial-gradient(ellipse 50% 35% at 90% 8%, rgba(201,162,39,0.12) 0%, transparent 55%)",
            "radial-gradient(ellipse 40% 30% at 10% 85%, rgba(30,4,8,0.35) 0%, transparent 60%)",
          ].join(", "),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className={SCENE_SCROLL_PANE}>
        <div className="mx-auto flex w-full max-w-md flex-col px-4 pt-8 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-10">
          {/* Header — light type on red */}
          <header className="relative mb-8 sm:mb-10">
            <motion.div
              className="text-left"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion
                  ? MOTION_DURATION.instant
                  : MOTION_DURATION.ceremony,
                ease: MOTION_EASE.out,
              }}
            >
              <h1
                className={`${script.className} text-[2.6rem] leading-[1.05] sm:text-[3rem]`}
                style={{
                  color: ON_RED,
                  textShadow: "0 2px 18px rgba(20,4,8,0.35)",
                }}
              >
                Memories of Us
              </h1>
              <p
                className={`${editorial.className} mt-2 max-w-[18rem] text-[13px] leading-relaxed tracking-wide italic sm:text-sm`}
                style={{ color: ON_RED_SOFT }}
              >
                Little moments. Big meaning. Our story, one memory at a time —
                for {toName}.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className="h-px w-10"
                  style={{
                    background: `linear-gradient(90deg, ${ON_RED_GOLD}, transparent)`,
                  }}
                />
                <GoldHeart className="h-3 w-3 opacity-90" />
              </div>
            </motion.div>

            <Sprig className="pointer-events-none absolute -top-2 -left-1 h-14 w-10 opacity-75 brightness-125" />
          </header>

          {/* Timeline strips — cream paper keeps ink readable */}
          <div className="flex flex-col gap-5 sm:gap-6">
            {photos.length > 0 ? (
              photos.map((photo, i) => (
                <MemoryStrip
                  key={photo.id}
                  photo={photo}
                  index={i}
                  reduceMotion={reduceMotion}
                />
              ))
            ) : (
              <p
                className="text-center text-sm italic"
                style={{ color: ON_RED_SOFT }}
              >
                Memories will appear here once photos are ready.
              </p>
            )}
          </div>

          {/* Closing note + CTA — one continuous scrapbook ending */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-5 sm:mt-12 sm:gap-6"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: closingDelay,
              duration: reduceMotion
                ? MOTION_DURATION.instant
                : MOTION_DURATION.base,
              ease: MOTION_EASE.out,
            }}
          >
            <p
              className={`${script.className} text-center text-xl sm:text-2xl`}
              style={{
                color: ON_RED_GOLD,
                textShadow: "0 2px 14px rgba(20,4,8,0.4)",
              }}
            >
              My favorite chapter is us.
            </p>

            <div className="flex w-full flex-col items-center gap-3">
              <span
                className="h-px w-16"
                style={{
                  background: `linear-gradient(90deg, transparent, ${ON_RED_GOLD}99, transparent)`,
                }}
              />
              <motion.button
                type="button"
                aria-label="Celebrate This Moment"
                onClick={onComplete}
                className={`${label.className} flex w-full max-w-[18rem] items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[11px] font-semibold tracking-[0.14em] uppercase sm:text-xs`}
                style={{
                  color: ROSE,
                  background: `linear-gradient(180deg, ${CREAM} 0%, #F0E6D8 100%)`,
                  boxShadow: [
                    `0 0 0 1.5px ${GOLD}`,
                    "0 14px 32px -10px rgba(10,2,4,0.55)",
                  ].join(", "),
                }}
                whileHover={reduceMotion ? undefined : { scale: 1.018 }}
                whileTap={{ scale: 0.985 }}
              >
                Celebrate This Moment
                <SoftRose className="h-4 w-4 shrink-0 opacity-95" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
