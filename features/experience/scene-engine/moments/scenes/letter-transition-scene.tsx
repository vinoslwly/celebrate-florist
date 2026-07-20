"use client";

import { motion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";

/** Transparent-cut Founder origami (bg removed) — large dense field. */
const ORIGAMI_ICON = "/themes/bloom/moments/scene-05-origami-icon.webp";

/**
 * Build a dense landing grid — large icons, heavy overlap, full cover.
 * Positions jittered so the field feels organic, not tiled.
 */
function buildBloomField() {
  const blooms: {
    left: string;
    top: string;
    size: number;
    delay: number;
    duration: number;
    rot: number;
    z: number;
  }[] = [];

  // Wave 1 — bottom surge (large)
  const wave1 = [
    [0, 72],
    [12, 78],
    [24, 70],
    [36, 80],
    [48, 68],
    [60, 76],
    [72, 70],
    [84, 78],
    [94, 72],
    [6, 88],
    [30, 90],
    [54, 86],
    [78, 92],
    [18, 84],
    [66, 88],
  ];
  wave1.forEach(([l, t], i) => {
    blooms.push({
      left: `${l}%`,
      top: `${t}%`,
      size: 140 + (i % 4) * 28,
      delay: 0.02 + i * 0.03,
      duration: 0.75 + (i % 3) * 0.08,
      rot: ((i * 17) % 40) - 20,
      z: 1,
    });
  });

  // Wave 2 — mid flood
  const wave2 = [
    [-4, 48],
    [8, 54],
    [20, 42],
    [32, 56],
    [44, 46],
    [56, 52],
    [68, 44],
    [80, 58],
    [92, 50],
    [2, 62],
    [26, 64],
    [50, 60],
    [74, 66],
    [14, 38],
    [38, 36],
    [62, 34],
    [86, 40],
    [10, 70],
    [46, 72],
    [82, 74],
  ];
  wave2.forEach(([l, t], i) => {
    blooms.push({
      left: `${l}%`,
      top: `${t}%`,
      size: 150 + (i % 5) * 30,
      delay: 0.28 + i * 0.028,
      duration: 0.9 + (i % 3) * 0.1,
      rot: ((i * 23) % 44) - 22,
      z: 2,
    });
  });

  // Wave 3 — upper + center overwhelm
  const wave3 = [
    [-2, 18],
    [10, 24],
    [22, 12],
    [34, 22],
    [46, 10],
    [58, 20],
    [70, 14],
    [82, 26],
    [94, 16],
    [4, 32],
    [28, 30],
    [52, 28],
    [76, 34],
    [16, 6],
    [40, 2],
    [64, 4],
    [88, 8],
    [0, 0],
    [48, 0],
    [90, -2],
    [20, 40],
    [60, 38],
    [84, 42],
    [8, 50],
    [36, 48],
    [72, 52],
  ];
  wave3.forEach(([l, t], i) => {
    blooms.push({
      left: `${l}%`,
      top: `${t}%`,
      size: 160 + (i % 5) * 36,
      delay: 0.55 + i * 0.025,
      duration: 1.05 + (i % 3) * 0.1,
      rot: ((i * 19) % 48) - 24,
      z: 3,
    });
  });

  // Wave 4 — hero giants (emotional climax)
  const giants = [
    { left: "18%", top: "28%", size: 280, delay: 0.82, rot: -8 },
    { left: "52%", top: "22%", size: 310, delay: 0.86, rot: 6 },
    { left: "78%", top: "32%", size: 270, delay: 0.84, rot: -12 },
    { left: "8%", top: "55%", size: 260, delay: 0.88, rot: 10 },
    { left: "42%", top: "48%", size: 320, delay: 0.9, rot: -4 },
    { left: "70%", top: "58%", size: 275, delay: 0.89, rot: 8 },
    { left: "28%", top: "8%", size: 250, delay: 0.94, rot: -10 },
    { left: "62%", top: "5%", size: 265, delay: 0.96, rot: 5 },
    { left: "-6%", top: "12%", size: 240, delay: 0.98, rot: 14 },
    { left: "88%", top: "10%", size: 255, delay: 1.0, rot: -9 },
    { left: "35%", top: "35%", size: 300, delay: 0.92, rot: 3 },
    { left: "5%", top: "35%", size: 245, delay: 0.97, rot: -14 },
  ];
  giants.forEach((g, i) => {
    blooms.push({
      ...g,
      duration: 1.15,
      z: 4,
      delay: g.delay + i * 0.015,
    });
  });

  // Wave 5 — top sky fill so nothing is empty
  const topFill = [
    [-8, -6],
    [6, -4],
    [20, -8],
    [34, -2],
    [48, -6],
    [62, -4],
    [76, -8],
    [90, -2],
    [0, 8],
    [14, 10],
    [40, 6],
    [56, 12],
    [72, 8],
    [96, 6],
  ];
  topFill.forEach(([l, t], i) => {
    blooms.push({
      left: `${l}%`,
      top: `${t}%`,
      size: 200 + (i % 4) * 40,
      delay: 1.05 + i * 0.02,
      duration: 1.1,
      rot: ((i * 13) % 36) - 18,
      z: 5,
    });
  });

  return blooms;
}

const BLOOMS = buildBloomField();

/**
 * moments.letter-transition — dense origami surge (Founder icon design).
 * Large paper flowers rise from below until the screen is fully covered.
 * Auto-advances via MomentsSceneHost duration table.
 */
export function LetterTransitionScene(_props: MomentsSceneProps) {
  return (
    <div className="relative flex min-h-full w-full flex-1 overflow-hidden bg-[#F6D6DE]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 60%, #FFF5F7 0%, #FCE4EB 45%, #F5CDD8 80%, #EEC0CE 100%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(255,255,255,0.55) 0%, transparent 70%)",
        }}
        initial={{ opacity: 0.35 }}
        animate={{ opacity: [0.35, 0.6, 0.75] }}
        transition={{ duration: 2.4, ease: "easeOut" }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {BLOOMS.map((bloom, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: bloom.left,
              top: bloom.top,
              width: bloom.size,
              height: bloom.size,
              zIndex: bloom.z,
              willChange: "transform, opacity",
            }}
            initial={{
              y: "115vh",
              opacity: 0,
              rotate: bloom.rot - 28,
              scale: 0.45,
            }}
            animate={{
              y: 0,
              opacity: 1,
              rotate: bloom.rot,
              scale: [0.45, 1.12, 1],
            }}
            transition={{
              duration: bloom.duration,
              delay: bloom.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ORIGAMI_ICON}
              alt=""
              draggable={false}
              className="h-full w-full object-contain drop-shadow-[0_12px_22px_rgba(180,70,100,0.35)]"
            />
          </motion.div>
        ))}
      </div>

      {/* Emotional climax — soft pink wash as cover completes */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,200,220,0.15) 0%, rgba(236,160,180,0.45) 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.55] }}
        transition={{ duration: 2.6, times: [0, 0.55, 1], ease: "easeIn" }}
      />
    </div>
  );
}
