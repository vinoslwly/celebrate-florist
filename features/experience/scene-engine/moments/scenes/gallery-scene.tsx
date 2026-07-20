"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Few petals, opacity/transform only — mobile-safe ambient. */
const FALLING = [
  { left: "12%", delay: 0.2, duration: 14, size: 14, x: 12 },
  { left: "48%", delay: 1.4, duration: 13, size: 12, x: -10 },
  { left: "78%", delay: 0.7, duration: 15, size: 13, x: 8 },
  { left: "92%", delay: 2.0, duration: 12.5, size: 11, x: -6 },
] as const;

function SakuraMark({
  className,
  tone = "#F4A0B8",
}: {
  className?: string;
  tone?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="17"
          rx="10"
          ry="15"
          fill={tone}
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="5.5" fill="#FFF8F5" />
      <circle cx="32" cy="32" r="2.4" fill="#E07090" />
    </svg>
  );
}

function Petal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden>
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.9"
      />
    </svg>
  );
}

function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden fill="none">
      <path
        d="M5 16 C10 6 20 4 24 9 C16 12 11 18 9 24 C7 21 5 18 5 16Z"
        fill="#C45B7A"
        opacity="0.7"
      />
    </svg>
  );
}

function HeartMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="#E8799A">
      <path d="M12 20 S3 13 3 8.5 A4.2 4.2 0 0 1 12 7 A4.2 4.2 0 0 1 21 8.5 C21 13 12 20 12 20Z" />
    </svg>
  );
}

function Flourish({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 80 24"
      className={className}
      aria-hidden
      fill="none"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M78 12 C58 12 52 4 40 4 C28 4 22 12 2 12"
        stroke="#D890A8"
        strokeWidth="1.2"
        opacity="0.85"
      />
      <circle cx="40" cy="12" r="2.2" fill="#E8799A" opacity="0.8" />
    </svg>
  );
}

function splitCaption(caption: string | null): { title: string; body: string } {
  if (!caption?.trim()) {
    return { title: "A memory", body: "A moment worth keeping." };
  }
  const parts = caption.split(" · ");
  if (parts.length >= 2) {
    return { title: parts[0]!.trim(), body: parts.slice(1).join(" · ").trim() };
  }
  return { title: "A memory", body: caption.trim() };
}

function PolaroidCard({
  photo,
  index,
  reduceMotion,
}: {
  photo: PublishedPhoto;
  index: number;
  reduceMotion: boolean;
}) {
  const { title, body } = splitCaption(photo.caption);
  const photoLeft = index % 2 === 0;
  const tilt = photoLeft ? -4 : 4;

  const polaroid = (
    <motion.div
      className="relative w-[13rem] shrink-0 sm:w-[16rem]"
      initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: tilt - 4 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      {/* Contact shadow — solid, no blur filter */}
      <div
        aria-hidden
        className="absolute -bottom-2 left-[10%] right-[10%] h-3 rounded-full bg-[#A04068]/20"
      />

      {/* Washi tape */}
      <div
        aria-hidden
        className="absolute -top-3 left-1/2 z-30 h-5 w-[4.5rem] -translate-x-1/2 -rotate-[2deg] rounded-[1px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,230,238,0.98) 0%, rgba(248,170,195,0.9) 100%)",
          boxShadow: "0 2px 6px rgba(140,40,70,0.22)",
        }}
      />

      <div
        className="relative rounded-[4px] bg-[#FFFCFA] px-3 pt-3 pb-12 sm:px-3.5 sm:pt-3.5 sm:pb-14"
        style={{
          boxShadow:
            "0 0 0 1px rgba(220,180,195,0.5), 0 12px 28px -8px rgba(120,40,70,0.32)",
        }}
      >
        <div className="relative overflow-hidden rounded-[2px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.signedUrl}
            alt={title}
            className="aspect-square w-full object-cover"
            loading="lazy"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 40%, rgba(80,30,50,0.1) 100%)",
            }}
          />
        </div>
      </div>

      <SakuraMark
        className={`absolute z-40 h-9 w-9 sm:h-10 sm:w-10 ${
          photoLeft ? "-top-1.5 -right-2" : "-top-1.5 -left-2"
        }`}
      />
    </motion.div>
  );

  const copy = (
    <motion.div
      className={`relative max-w-[11.5rem] sm:max-w-[14.5rem] ${
        photoLeft ? "text-left" : "text-right"
      }`}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1, ease: EASE }}
    >
      <p className="font-serif text-[1.3rem] leading-[1.2] font-semibold tracking-tight text-[#5C1E30] sm:text-[1.55rem]">
        {title}
      </p>
      <div
        className={`mt-2.5 flex items-center gap-2 ${
          photoLeft ? "" : "flex-row-reverse"
        }`}
      >
        <HeartMark className="h-3.5 w-3.5" />
        <div className="h-px w-8 bg-[#E8B0C0]/80" />
      </div>
      <p className="mt-3 font-serif text-[14px] leading-[1.7] text-[#6B3A48] italic sm:text-[15.5px]">
        {body}
      </p>
    </motion.div>
  );

  return (
    <div
      className={`flex items-center gap-4 sm:gap-10 ${
        photoLeft ? "flex-row" : "flex-row-reverse"
      } justify-center px-1`}
    >
      {polaroid}
      {copy}
    </div>
  );
}

/**
 * moments.gallery — living Founder Scene 8 (scrollable polaroid memories).
 * Mobile-light: weight from polaroids, not particle density.
 */
export function GalleryScene({ payload, onComplete }: MomentsSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const photos = [...payload.photos].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#F0C8D4]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 160% 100% at 50% -10%, #FFFCFB 0%, #FDF0F4 30%, #F6D4E0 62%, #E8A8BC 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 50% 42%, transparent 45%, rgba(160,70,100,0.1) 100%)",
        }}
      />

      {/* Ambient petals — behind content only, no CSS filters */}
      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        >
          {FALLING.map((p, i) => (
            <motion.div
              key={i}
              className="absolute opacity-70"
              style={{
                left: p.left,
                top: "-6%",
                width: p.size,
                height: p.size * 1.35,
              }}
              animate={{
                opacity: [0, 0.7, 0.7, 0],
                y: ["0vh", "120vh"],
                x: [0, p.x],
                rotate: [0, 40, -15],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Petal className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      ) : null}

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto flex w-full max-w-xl flex-col px-5 pt-12 pb-0 sm:px-8 sm:pt-14">
          <header className="mb-12 text-center sm:mb-16">
            <motion.div
              className="mb-4 flex items-center justify-center gap-3"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45 }}
            >
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#D890A8]" />
              <SakuraMark className="h-5 w-5" />
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#D890A8]" />
            </motion.div>
            <motion.h1
              className="font-serif text-[2.75rem] leading-none font-semibold tracking-tight text-[#5C1E30] sm:text-6xl"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              Gallery
            </motion.h1>
            <motion.p
              className="mt-4 flex items-center justify-center gap-2.5 font-serif text-[14px] text-[#8B4A5E] sm:text-base"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.45 }}
            >
              <LeafMark className="h-3.5 w-3.5" />
              <span className="tracking-wide italic">
                Our memories, beautifully captured
              </span>
              <LeafMark className="h-3.5 w-3.5 -scale-x-100" />
            </motion.p>
          </header>

          <div className="flex flex-col gap-14 sm:gap-16">
            {photos.map((photo, index) => (
              <PolaroidCard
                key={photo.id}
                photo={photo}
                index={index}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>

          <motion.div
            className="relative mt-20 text-center sm:mt-24"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="mx-auto mb-5 flex items-center justify-center gap-2">
              <Flourish className="h-4 w-14 opacity-80" />
              <HeartMark className="h-3 w-3" />
              <Flourish className="h-4 w-14 opacity-80" flip />
            </div>
            <p className="mx-auto max-w-sm font-serif text-lg leading-snug text-[#5C1E30] italic sm:text-xl">
              Every moment with you is my favorite memory
            </p>
            <p className="mt-10 font-serif text-4xl font-semibold tracking-tight text-[#5C1E30] sm:text-5xl">
              Thank you
            </p>
            <p className="mt-3 font-serif text-base text-[#6B3A48] sm:text-lg">
              for sharing these memories.
            </p>

            <motion.button
              type="button"
              aria-label="Celebrate this moment"
              onClick={onComplete}
              className="relative mt-10 mb-6 rounded-full bg-gradient-to-b from-[#F8A8C0] via-[#E85A82] to-[#D04068] px-10 py-3.5 text-[15px] font-semibold tracking-wide text-white focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:outline-none"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.3) inset, 0 12px 28px -8px rgba(190,50,90,0.55)",
              }}
              whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              Celebrate this moment →
            </motion.button>
          </motion.div>
        </div>

        {/* Quiet sakura base */}
        <div className="relative mt-2 h-28 w-full overflow-hidden sm:h-36">
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-full"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, #F0A8BC 40%, #D87898 100%)",
              clipPath: "ellipse(110% 100% at 50% 100%)",
            }}
          />
          <SakuraMark className="absolute bottom-5 left-[10%] h-12 w-12 opacity-90 sm:h-14 sm:w-14" />
          <SakuraMark className="absolute right-[14%] bottom-6 h-11 w-11 opacity-85 sm:h-12 sm:w-12" />
          <SakuraMark className="absolute bottom-8 left-[42%] h-9 w-9 opacity-75" />
        </div>
      </div>
    </div>
  );
}
