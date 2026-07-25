"use client";

import { useId } from "react";

import { motion } from "framer-motion";

/**
 * Sky Moments gift motif — light-blue box + cream stitched ribbon + gingham heart.
 * Same closed/open animation model as Bloom / Warm.
 */

type GiftPaintIds = {
  body: string;
  lid: string;
  ribbon: string;
  glow: string;
  shadow: string;
  check: string;
};

function useGiftPaintIds(): GiftPaintIds {
  const raw = useId().replace(/:/g, "");
  return {
    body: `sg-body-${raw}`,
    lid: `sg-lid-${raw}`,
    ribbon: `sg-ribbon-${raw}`,
    glow: `sg-glow-${raw}`,
    shadow: `sg-shadow-${raw}`,
    check: `sg-check-${raw}`,
  };
}

function SkyGiftPaintServers({ ids }: { ids: GiftPaintIds }) {
  return (
    <defs>
      <linearGradient id={ids.body} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A8D0EA" />
        <stop offset="50%" stopColor="#7EB6D9" />
        <stop offset="100%" stopColor="#5B9BC8" />
      </linearGradient>
      <linearGradient id={ids.lid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#B8D8F0" />
        <stop offset="100%" stopColor="#6BA3C9" />
      </linearGradient>
      <linearGradient id={ids.ribbon} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFEFB" />
        <stop offset="45%" stopColor="#F5F0E8" />
        <stop offset="100%" stopColor="#E8E0D4" />
      </linearGradient>
      <radialGradient id={ids.glow} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="40%" stopColor="#D6EAF8" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#6BA3C9" stopOpacity="0" />
      </radialGradient>
      <pattern
        id={ids.check}
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
      >
        <rect width="8" height="8" fill="#EEF4FA" />
        <rect width="4" height="4" fill="#6BA3C9" />
        <rect x="4" y="4" width="4" height="4" fill="#6BA3C9" />
      </pattern>
      <filter id={ids.shadow} x="-20%" y="-10%" width="140%" height="140%">
        <feDropShadow
          dx="8"
          dy="12"
          stdDeviation="9"
          floodColor="#1E3A5F"
          floodOpacity="0.28"
        />
      </filter>
    </defs>
  );
}

function StitchRect({
  x,
  y,
  w,
  h,
  rx = 4,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
}) {
  return (
    <rect
      x={x + 3}
      y={y + 3}
      width={w - 6}
      height={h - 6}
      rx={Math.max(1, rx - 1)}
      fill="none"
      stroke="#6BA3C9"
      strokeWidth="1.2"
      strokeDasharray="3 3"
      opacity="0.55"
    />
  );
}

/** Cream bow lid with gingham heart + gift tag. */
function SkyGiftLidWithBow({
  ids,
  x,
  y,
}: {
  ids: GiftPaintIds;
  x: number;
  y: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x="0"
        y="22"
        width="120"
        height="30"
        rx="6"
        fill={`url(#${ids.lid})`}
      />
      <rect x="46" y="22" width="28" height="30" fill={`url(#${ids.ribbon})`} />
      <StitchRect x={46} y={22} w={28} h={30} rx={2} />

      {/* Multi-loop cream bow */}
      <ellipse
        cx="28"
        cy="12"
        rx="26"
        ry="14"
        fill={`url(#${ids.ribbon})`}
        transform="rotate(-18 28 12)"
      />
      <ellipse
        cx="92"
        cy="12"
        rx="26"
        ry="14"
        fill={`url(#${ids.ribbon})`}
        transform="rotate(18 92 12)"
      />
      <ellipse
        cx="42"
        cy="8"
        rx="16"
        ry="10"
        fill={`url(#${ids.ribbon})`}
        transform="rotate(-8 42 8)"
      />
      <ellipse
        cx="78"
        cy="8"
        rx="16"
        ry="10"
        fill={`url(#${ids.ribbon})`}
        transform="rotate(8 78 8)"
      />
      <ellipse cx="60" cy="14" rx="11" ry="9" fill={`url(#${ids.ribbon})`} />

      {/* Gingham heart center */}
      <path
        d="M60 28c-5.5-4.5-9-7.2-9-11 0-2.8 2.2-4.6 4.5-4.6 1.6 0 3.1 0.9 4.5 2.7 1.4-1.8 2.9-2.7 4.5-2.7 2.3 0 4.5 1.8 4.5 4.6 0 3.8-3.5 6.5-9 11Z"
        fill={`url(#${ids.check})`}
        stroke="#5B8FBA"
        strokeWidth="1"
      />

      {/* Streamers */}
      <path
        d="M52 26 Q40 48 32 62"
        stroke={`url(#${ids.ribbon})`}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M68 26 Q80 48 88 62"
        stroke={`url(#${ids.ribbon})`}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        opacity="0.92"
      />

      {/* Gift tag */}
      <g transform="translate(98 34) rotate(12)">
        <path
          d="M0 0h28v36c0 0-4-3-8-3s-8 3-8 3c0 0-4-3-8-3s-4 3-4 3V0Z"
          fill="#FFFEFB"
          stroke="#D6E0EA"
          strokeWidth="1"
        />
        <circle
          cx="8"
          cy="6"
          r="2.2"
          fill="none"
          stroke="#6BA3C9"
          strokeWidth="1"
        />
        {/* Tiny plant mark */}
        <circle cx="14" cy="18" r="3.2" fill="#1E3A5F" />
        <circle cx="11" cy="21" r="2.2" fill="#2A4A6E" />
        <circle cx="17" cy="21" r="2.2" fill="#2A4A6E" />
        <path
          d="M14 22v10"
          stroke="#1E3A5F"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

function ClosedBody({ ids }: { ids: GiftPaintIds }) {
  return (
    <g filter={`url(#${ids.shadow})`}>
      <rect
        x="40"
        y="110"
        width="140"
        height="100"
        rx="10"
        fill={`url(#${ids.body})`}
      />
      <path d="M40 120h140v16H40z" fill="#FFFFFF" opacity="0.14" />
      {/* Cream ribbons */}
      <rect
        x="96"
        y="110"
        width="28"
        height="100"
        fill={`url(#${ids.ribbon})`}
      />
      <StitchRect x={96} y={110} w={28} h={100} rx={2} />
      <rect
        x="40"
        y="148"
        width="140"
        height="22"
        fill={`url(#${ids.ribbon})`}
      />
      <StitchRect x={40} y={148} w={140} h={22} rx={2} />
      {/* Stars on box */}
      {(
        [
          [58, 128],
          [162, 132],
          [70, 188],
          [154, 182],
          [120, 200],
        ] as const
      ).map(([sx, sy], i) => (
        <path
          key={i}
          d={`M${sx} ${sy - 5}l1.6 3.6 4 .4-3 2.8.8 3.8-3.4-2-3.4 2 .8-3.8-3-2.8 4-.4Z`}
          fill={i % 2 === 0 ? "#FFFFFF" : "#D6EAF8"}
          opacity="0.9"
        />
      ))}
    </g>
  );
}

export type SkyGiftBoxProps = {
  className?: string;
  variant?: "closed" | "open";
  animateLid?: boolean;
  reduceMotion?: boolean;
};

/**
 * Sky gift box — Theme Lab Moments Scene 3 motif.
 */
export function SkyGiftBox({
  className,
  variant = "closed",
  animateLid = false,
  reduceMotion = false,
}: SkyGiftBoxProps) {
  const ids = useGiftPaintIds();

  if (variant === "open") {
    return (
      <div className={className} aria-hidden>
        <svg viewBox="0 0 280 160" className="h-full w-full" fill="none">
          <SkyGiftPaintServers ids={ids} />
          <ellipse
            cx="150"
            cy="148"
            rx="90"
            ry="12"
            fill="#1E3A5F"
            opacity="0.16"
          />
          <ellipse
            cx="150"
            cy="95"
            rx="58"
            ry="28"
            fill={`url(#${ids.glow})`}
          />
          <g filter={`url(#${ids.shadow})`}>
            <rect
              x="80"
              y="70"
              width="140"
              height="72"
              rx="8"
              fill={`url(#${ids.body})`}
            />
            <rect
              x="80"
              y="70"
              width="140"
              height="14"
              rx="4"
              fill="#FFFFFF"
              opacity="0.16"
            />
            <rect
              x="136"
              y="70"
              width="28"
              height="72"
              fill={`url(#${ids.ribbon})`}
            />
            <rect
              x="80"
              y="98"
              width="140"
              height="18"
              fill={`url(#${ids.ribbon})`}
            />
          </g>
          <path
            d="M100 140 Q88 152 70 158"
            stroke={`url(#${ids.ribbon})`}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          <path
            d="M200 140 Q218 150 232 156"
            stroke={`url(#${ids.ribbon})`}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          {animateLid && !reduceMotion ? (
            <motion.g
              initial={{ x: 80, y: 18, rotate: 0, opacity: 0.9 }}
              animate={{ x: -8, y: 46, rotate: -28, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ originX: "60px", originY: "36px" }}
            >
              <SkyGiftLidWithBow ids={ids} x={0} y={0} />
            </motion.g>
          ) : (
            <g transform="translate(-8 46) rotate(-28 60 36)">
              <SkyGiftLidWithBow ids={ids} x={0} y={0} />
            </g>
          )}
        </svg>
      </div>
    );
  }

  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 220 240" className="h-full w-full" fill="none">
        <SkyGiftPaintServers ids={ids} />
        <ellipse
          cx="112"
          cy="218"
          rx="72"
          ry="12"
          fill="#6BA3C9"
          opacity="0.22"
        />
        <ClosedBody ids={ids} />
        <SkyGiftLidWithBow ids={ids} x={50} y={66} />
      </svg>
    </div>
  );
}
