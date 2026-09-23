"use client";

import { motion } from "framer-motion";

import { galleryCaptionCopy } from "@/features/experience/lib/photo-caption";
import { SCENE_SCROLL_PANE } from "@/features/experience/scene-engine/scene-viewport";
import {
  allowAmbientLoop,
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_STAGGER,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

const INK = "#1E3A5F";
const HAND = "#3D7AAD";
const PAPER = "#FFFEFB";
const SKY = "#C5DCEF";
const CTA_FROM = "#8EBFDE";
const CTA_TO = "#4A8FBF";

const TORN =
  "polygon(0.8% 1.2%, 12% 0%, 28% 1.5%, 47% 0.2%, 68% 1.8%, 86% 0.4%, 99.2% 1%, 100% 18%, 99% 42%, 100% 68%, 98.8% 92%, 86% 100%, 62% 98.5%, 38% 100%, 14% 98.8%, 0% 99%, 1% 72%, 0% 38%, 1.2% 12%)";

function SoftStar({
  className,
  fill = "#7EB6D9",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill={fill}>
      <path d="M24 5 L28.5 18.5 L43 20 L32 29.5 L35.5 44 L24 36 L12.5 44 L16 29.5 L5 20 L19.5 18.5 Z" />
    </svg>
  );
}

function SoftHeart({
  className,
  fill = "#6BA3C9",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 24 22" className={className} aria-hidden fill={fill}>
      <path d="M12 20S3.5 14 2.2 9.2C1.4 6.4 3.2 4 5.8 4c1.6 0 2.9 1 3.5 2.2C10 5 11.3 4 12.9 4c2.6 0 4.4 2.4 3.5 5.2C15.2 14 12 20 12 20Z" />
    </svg>
  );
}

function PaperClip({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 56"
      className={className}
      aria-hidden
      fill="none"
      stroke="#8EBFDE"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <path d="M10 18 V38 Q10 48 16 48 Q22 48 22 38 V14 Q22 6 16 6 Q10 6 10 14 V36" />
    </svg>
  );
}

function MiniFlower({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="16"
          cy="9"
          rx="4.5"
          ry="7"
          fill="#8EBFDE"
          transform={`rotate(${deg} 16 16)`}
        />
      ))}
      <circle cx="16" cy="16" r="3.2" fill="#FFFEFB" />
    </svg>
  );
}

function SoftCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 48" className={className} aria-hidden fill="white">
      <ellipse cx="36" cy="30" rx="28" ry="16" opacity="0.85" />
      <ellipse cx="62" cy="24" rx="32" ry="18" opacity="0.9" />
      <ellipse cx="90" cy="30" rx="24" ry="14" opacity="0.8" />
    </svg>
  );
}

function NumberFlag({ n, className }: { n: string; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: "linear-gradient(180deg, #8EBFDE 0%, #5B9BC8 100%)",
        clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
        boxShadow: "0 6px 14px -6px rgba(30,58,95,0.35)",
      }}
    >
      <span className="block px-2 pt-1.5 pb-3 font-mono text-[11px] font-bold tracking-wider text-white">
        {n}
      </span>
    </div>
  );
}

function MemoryCard({
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
    body: "A moment worth keeping under a clear sky.",
  });
  const photoLeft = index % 2 === 0;
  const tilt = photoLeft ? -3.5 : 3.5;
  const n = String(index + 1).padStart(2, "0");

  const polaroid = (
    <motion.div
      className="relative w-[11.5rem] shrink-0 sm:w-[14rem]"
      initial={
        reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98, rotate: tilt }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: tilt }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{
        duration: MOTION_DURATION.fast,
        ease: MOTION_EASE.out,
        delay: reduceMotion ? 0 : MOTION_STAGGER.tight,
      }}
    >
      <div
        aria-hidden
        className="absolute -bottom-1.5 left-[12%] right-[12%] h-2.5 rounded-full bg-[#1E3A5F]/15"
      />

      {/* Washi */}
      <div
        aria-hidden
        className="absolute -top-2.5 left-1/2 z-30 h-4 w-16 -translate-x-1/2 -rotate-[3deg] rounded-[1px]"
        style={{
          background:
            "linear-gradient(180deg, #E8F2FA 0%, #B8D4EA 55%, #8EBFDE 100%)",
          boxShadow: "0 2px 6px rgba(30,58,95,0.18)",
        }}
      />

      <div
        className="relative bg-white px-2.5 pt-2.5 pb-9 sm:px-3 sm:pt-3 sm:pb-11"
        style={{
          boxShadow:
            "0 0 0 1px rgba(184,212,234,0.55), 0 14px 28px -10px rgba(30,58,95,0.28)",
        }}
      >
        <div className="relative overflow-hidden rounded-[2px] bg-[#E8F2FA]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.signedUrl}
            alt={title}
            className="aspect-square w-full object-cover"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 40%, rgba(30,58,95,0.1) 100%)",
            }}
          />
        </div>
      </div>

      <PaperClip
        className={`absolute z-40 h-9 w-4 drop-shadow-sm ${
          photoLeft
            ? "-top-1 -right-1 rotate-[18deg]"
            : "-top-1 -left-1 -rotate-[18deg]"
        }`}
      />
      <SoftHeart
        className={`absolute z-40 h-5 w-5 drop-shadow-sm ${
          photoLeft ? "-right-2 bottom-6" : "-left-2 bottom-6"
        }`}
        fill={index % 2 === 0 ? "#6BA3C9" : "#8EBFDE"}
      />
    </motion.div>
  );

  const copy = (
    <motion.div
      className={`relative max-w-[10.5rem] sm:max-w-[13rem] ${
        photoLeft ? "text-left" : "text-right"
      }`}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: MOTION_DURATION.fast,
        delay: reduceMotion ? 0 : MOTION_STAGGER.tight,
        ease: MOTION_EASE.out,
      }}
    >
      <div className={`${photoLeft ? "" : "flex justify-end"}`}>
        <NumberFlag n={n} className="mb-2 inline-block" />
      </div>
      <p
        className="font-serif text-[1.25rem] leading-[1.2] font-semibold tracking-tight italic sm:text-[1.45rem]"
        style={{ color: INK }}
      >
        {title}
      </p>
      <div
        className={`mt-2 flex items-center gap-1.5 ${
          photoLeft ? "" : "flex-row-reverse"
        }`}
      >
        <SoftStar className="h-3.5 w-3.5" fill="#8EBFDE" />
        <div className="h-px w-7 bg-[#B8D4EA]" />
      </div>
      <p
        className="mt-2.5 font-serif text-[13.5px] leading-[1.65] italic sm:text-[14.5px]"
        style={{ color: HAND }}
      >
        {body}
      </p>
    </motion.div>
  );

  return (
    <article
      className={`relative mx-auto flex w-full max-w-md items-center gap-3 px-4 sm:gap-5 sm:px-6 ${
        photoLeft ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {/* Soft torn paper plate behind the pair */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-2 -inset-y-3 -z-10 sm:inset-x-4"
        style={{
          background: PAPER,
          clipPath: TORN,
          boxShadow: "0 16px 36px -18px rgba(30,58,95,0.22)",
          opacity: 0.92,
        }}
      />
      {polaroid}
      {copy}
    </article>
  );
}

/**
 * sky.moments.gallery — scrapbook "Our Moments" sky album.
 * Airy / light reveal — kit-aligned (Sprint 13).
 */
export function SkyGalleryScene({ payload, onComplete }: SkyMomentsSceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
  const ambient = allowAmbientLoop(reduceMotion);
  const photos = [...payload.photos].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const toName = payload.experience.greeting_name?.trim() || "you";

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden"
      style={{
        backgroundColor: SKY,
        backgroundImage:
          "linear-gradient(175deg, #F7FBFE 0%, #E4EEF7 40%, #C5DCEF 78%, #B8D4EA 100%)",
      }}
    >
      {/* Soft side scrap edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 bottom-0 left-0 z-[1] w-6 opacity-70 sm:w-8"
        style={{
          background:
            "repeating-linear-gradient(90deg, #C5DCEF 0 8px, #EEF4FA 8px 16px)",
          clipPath: "polygon(0 0, 100% 2%, 70% 50%, 100% 98%, 0 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 bottom-0 z-[1] w-6 opacity-60 sm:w-8"
        style={{
          background:
            "repeating-conic-gradient(#8EBFDE 0% 25%, #F7FBFE 0% 50%) 0 0 / 10px 10px",
          clipPath: "polygon(30% 0, 100% 0, 100% 100%, 20% 100%)",
        }}
      />

      <SoftCloud className="pointer-events-none absolute top-[8%] right-[6%] z-[1] h-10 w-28 opacity-50" />
      <SoftCloud className="pointer-events-none absolute bottom-[18%] left-[4%] z-[1] h-8 w-24 opacity-40 scale-x-[-1]" />

      {/* Few ambient stars — opacity only, mobile-safe */}
      {ambient ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
          {[
            { t: "12%", l: "18%" },
            { t: "22%", l: "82%" },
            { t: "58%", l: "10%" },
            { t: "70%", l: "88%" },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ top: s.t, left: s.l }}
              animate={{ opacity: [0.25, 0.7, 0.3], scale: [0.9, 1.08, 0.95] }}
              transition={{
                duration: 3.2 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              <SoftStar className="h-3.5 w-3.5" fill="#8EBFDE" />
            </motion.div>
          ))}
        </div>
      ) : null}

      <div className={SCENE_SCROLL_PANE}>
        <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col px-3 pb-10 pt-8 sm:px-5 sm:pt-10">
          {/* Header */}
          <header className="relative mb-8 text-center sm:mb-10">
            <motion.p
              className="font-serif text-[2.35rem] leading-none tracking-tight italic sm:text-[2.75rem]"
              style={{ color: INK }}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion
                  ? MOTION_DURATION.instant
                  : MOTION_DURATION.base,
                ease: MOTION_EASE.out,
              }}
            >
              Our Moments
            </motion.p>

            <motion.div
              className="relative mx-auto mt-4 max-w-[17rem] px-4 py-3 sm:max-w-xs"
              style={{
                background: PAPER,
                clipPath: TORN,
                boxShadow: "0 10px 24px -12px rgba(30,58,95,0.28)",
              }}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion
                  ? MOTION_DURATION.instant
                  : MOTION_DURATION.fast,
                delay: reduceMotion ? 0 : MOTION_STAGGER.tight,
                ease: MOTION_EASE.out,
              }}
            >
              <p
                className="font-serif text-[12.5px] leading-snug italic sm:text-[13.5px]"
                style={{ color: HAND }}
              >
                Little moments. Big meaning. Our story, one memory at a time.
              </p>
            </motion.div>

            <p
              className="mt-3 font-mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: `${HAND}99` }}
            >
              for {toName}
            </p>

            {/* Envelope accent */}
            <motion.div
              aria-hidden
              className="absolute -top-1 -right-0 hidden w-16 sm:block sm:w-20"
              initial={reduceMotion ? false : { opacity: 0, rotate: 8 }}
              animate={{ opacity: 1, rotate: 6 }}
              transition={{
                delay: reduceMotion ? 0 : MOTION_STAGGER.base,
                duration: reduceMotion
                  ? MOTION_DURATION.instant
                  : MOTION_DURATION.fast,
                ease: MOTION_EASE.out,
              }}
            >
              <div
                className="relative rounded-sm bg-[#E8F2FA] p-1.5 text-[8px] leading-tight text-[#3D7AAD]"
                style={{
                  boxShadow: "0 6px 14px -6px rgba(30,58,95,0.3)",
                  transform: "rotate(8deg)",
                }}
              >
                Made of smiles & memories
                <PaperClip className="absolute -top-2 -right-1 h-7 w-3 rotate-[25deg]" />
              </div>
            </motion.div>

            <SoftHeart
              className="absolute top-2 left-4 h-6 w-6 opacity-80 sm:left-8"
              fill="#7EB6D9"
            />
            <SoftStar className="absolute top-8 right-6 h-4 w-4 opacity-70 sm:right-10" />
          </header>

          {/* Memory zigzag */}
          <div className="flex flex-col gap-9 sm:gap-11">
            {photos.length === 0 ? (
              <p className="px-6 text-center font-serif text-sm italic text-[#3D7AAD]/80">
                Memories are on their way…
              </p>
            ) : (
              photos.map((photo, index) => (
                <MemoryCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  reduceMotion={reduceMotion}
                />
              ))
            )}
          </div>

          {/* Closing + CTA */}
          <motion.div
            className="mt-12 flex flex-col items-center gap-5 px-4 sm:mt-14"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: MOTION_DURATION.base,
              ease: MOTION_EASE.out,
            }}
          >
            <p
              className="max-w-xs text-center font-serif text-[15px] leading-relaxed italic sm:text-base"
              style={{ color: HAND }}
            >
              Every quiet sky held a piece of us.
            </p>

            <motion.button
              type="button"
              aria-label="Celebrate This Moment"
              onClick={onComplete}
              className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold tracking-[0.08em] text-white uppercase focus-visible:ring-2 focus-visible:ring-[#6BA3C9] focus-visible:outline-none sm:text-[15px]"
              style={{
                background: `linear-gradient(180deg, ${CTA_FROM} 0%, ${CTA_TO} 100%)`,
                boxShadow:
                  "0 14px 32px -10px rgba(30,58,95,0.45), 0 0 0 2px rgba(255,255,255,0.4)",
              }}
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MiniFlower className="h-5 w-5" />
              Celebrate This Moment
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
