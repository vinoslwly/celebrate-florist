"use client";

import Image from "next/image";

import { m, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { BouquetIllustration } from "@/features/landing/components/bouquet-illustration";
import { HERO_BOUQUET_PHOTO } from "@/features/landing/config/hero-media";
import { ORDER_LINK } from "@/features/landing/config/whatsapp-messages";

/**
 * Hero is a Client Component because the bouquet illustration has a
 * continuous idle rocking animation. Everything below it in the page
 * is a Server Component by default.
 */
export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-pink-soft/20 via-warmwhite to-warmwhite px-4 pt-14 pb-20 sm:px-6 sm:pt-20 sm:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="text-center md:text-left">
          <m.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-pink-soft bg-white/80 px-4 py-1.5 text-[11px] font-bold tracking-wide text-pink-ink shadow-soft"
          >
            ✨ Digital Florist Experience
          </m.div>

          <m.h1
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
            className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            Every flower tells a story.
          </m.h1>
          <m.p
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mx-auto mt-4 max-w-md text-lg text-muted-foreground md:mx-0"
          >
            Give flowers. Create memories. Hubungkan buket bunga fisik Anda
            dengan surat digital, galeri foto, dan photobooth.
          </m.p>
          <m.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start"
          >
            <Button
              asChild
              variant="brand"
              size="lg"
              className="w-full sm:w-auto"
            >
              <a href={ORDER_LINK} target="_blank" rel="noopener noreferrer">
                🌸 Order Now
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <a href="#demo">✨ Watch Experience</a>
            </Button>
          </m.div>
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
          <m.div
            animate={
              shouldReduceMotion
                ? undefined
                : { y: [0, -4, 0], rotate: [-1.5, 1.5, -1.5] }
            }
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-[3rem] border border-white/40 bg-white/60 p-8 shadow-soft-lg backdrop-blur-sm"
          >
            <div className="relative flex h-56 w-56 items-center justify-center rounded-[2.5rem] bg-gradient-to-tr from-pink-soft/30 via-peach/15 to-transparent p-4 sm:h-64 sm:w-64">
              {HERO_BOUQUET_PHOTO ? (
                <Image
                  src={HERO_BOUQUET_PHOTO}
                  alt="Buket bunga Celebrate Florist"
                  fill
                  sizes="(min-width: 640px) 256px, 224px"
                  className="rounded-[2rem] object-cover"
                />
              ) : (
                <BouquetIllustration />
              )}

              {/*
               * Links to the Demo Experience section rather than being a
               * decorative dead-end — previously had a hover animation
               * implying interactivity with no action behind it, fixed
               * during the Sprint 01C review.
               */}
              <m.a
                href="#demo"
                aria-label="Preview the greeting experience"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
                className="absolute right-4 bottom-4 flex flex-col items-center gap-1 rounded-xl border border-pink-soft bg-white p-2 shadow-soft"
              >
                <span aria-hidden="true" className="text-2xl leading-none">
                  🔳
                </span>
                <span className="font-mono text-[7px] font-bold tracking-wider text-pink-ink uppercase">
                  Scan Me
                </span>
              </m.a>
            </div>
          </m.div>

          <m.span
            aria-hidden="true"
            animate={
              shouldReduceMotion
                ? undefined
                : { y: [0, -10, 0], rotate: [0, 15, 0] }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
            className="absolute -top-2 right-2 text-3xl sm:text-4xl"
          >
            ✨
          </m.span>
        </div>
      </div>
    </section>
  );
}
