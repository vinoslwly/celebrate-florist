"use client";

import { useId } from "react";

import { motion } from "framer-motion";

/**
 * Warm Moments gift motif — same open/closed animation model as Bloom,
 * restyled crimson + metallic gold (premium luxury). SVG so lid can animate.
 */

type GiftPaintIds = {
  body: string;
  lid: string;
  ribbon: string;
  glow: string;
  shadow: string;
};

function useGiftPaintIds(): GiftPaintIds {
  const raw = useId().replace(/:/g, "");
  return {
    body: `wg-body-${raw}`,
    lid: `wg-lid-${raw}`,
    ribbon: `wg-ribbon-${raw}`,
    glow: `wg-glow-${raw}`,
    shadow: `wg-shadow-${raw}`,
  };
}

function WarmGiftPaintServers({ ids }: { ids: GiftPaintIds }) {
  return (
    <defs>
      <linearGradient id={ids.body} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A51C28" />
        <stop offset="45%" stopColor="#8B1A22" />
        <stop offset="100%" stopColor="#6B0F16" />
      </linearGradient>
      <linearGradient id={ids.lid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#B8222E" />
        <stop offset="100%" stopColor="#7A121A" />
      </linearGradient>
      <linearGradient id={ids.ribbon} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F0D78A" />
        <stop offset="40%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#A67C1A" />
      </linearGradient>
      <radialGradient id={ids.glow} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF8E0" stopOpacity="0.95" />
        <stop offset="45%" stopColor="#F0D78A" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
      </radialGradient>
      <filter id={ids.shadow} x="-20%" y="-10%" width="140%" height="140%">
        <feDropShadow
          dx="10"
          dy="14"
          stdDeviation="10"
          floodColor="#3A080C"
          floodOpacity="0.45"
        />
      </filter>
    </defs>
  );
}

/** Gold bow + small rose stamp — Warm motif (not Bloom sakura). */
function WarmGiftLidWithBow({
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
        y="20"
        width="120"
        height="32"
        rx="7"
        fill={`url(#${ids.lid})`}
      />
      <rect x="46" y="20" width="28" height="32" fill={`url(#${ids.ribbon})`} />
      <ellipse
        cx="32"
        cy="14"
        rx="24"
        ry="13"
        fill={`url(#${ids.ribbon})`}
        transform="rotate(-16 32 14)"
      />
      <ellipse
        cx="88"
        cy="14"
        rx="24"
        ry="13"
        fill={`url(#${ids.ribbon})`}
        transform="rotate(16 88 14)"
      />
      <ellipse cx="60" cy="16" rx="12" ry="10" fill="#D4AF37" />
      <path
        d="M52 24 Q42 48 34 60"
        stroke="#D4AF37"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M68 24 Q78 48 86 60"
        stroke="#A67C1A"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tiny rose mark on knot */}
      <g transform="translate(50 2)">
        <circle cx="10" cy="10" r="7" fill="#8B1A22" />
        <circle cx="10" cy="10" r="3.5" fill="#A51C28" />
        <circle cx="10" cy="10" r="1.6" fill="#F0D78A" />
      </g>
    </g>
  );
}

function WarmClosedBody({ ids }: { ids: GiftPaintIds }) {
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
      <path d="M40 120h140v18H40z" fill="#FFFFFF" opacity="0.1" />
      <rect
        x="96"
        y="110"
        width="28"
        height="100"
        fill={`url(#${ids.ribbon})`}
      />
      <rect
        x="40"
        y="148"
        width="140"
        height="22"
        fill={`url(#${ids.ribbon})`}
      />
    </g>
  );
}

export type WarmGiftBoxProps = {
  className?: string;
  /** ajar — lid cracked with warm glow (Connection score calculation). */
  variant?: "closed" | "ajar" | "open";
  animateLid?: boolean;
  reduceMotion?: boolean;
};

/**
 * Warm gift box — SVG closed / ajar / open (lid can animate).
 */
export function WarmGiftBox({
  className,
  variant = "closed",
  animateLid = false,
  reduceMotion = false,
}: WarmGiftBoxProps) {
  const ids = useGiftPaintIds();

  if (variant === "open") {
    return (
      <div className={className} aria-hidden>
        <svg viewBox="0 0 280 160" className="h-full w-full" fill="none">
          <WarmGiftPaintServers ids={ids} />
          <ellipse
            cx="150"
            cy="148"
            rx="90"
            ry="12"
            fill="#3A080C"
            opacity="0.35"
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
              opacity="0.12"
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
              initial={{ x: 80, y: 20, rotate: 0, opacity: 0.9 }}
              animate={{ x: -8, y: 48, rotate: -28, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ originX: "60px", originY: "36px" }}
            >
              <WarmGiftLidWithBow ids={ids} x={0} y={0} />
            </motion.g>
          ) : (
            <g transform="translate(-8 48) rotate(-28 60 36)">
              <WarmGiftLidWithBow ids={ids} x={0} y={0} />
            </g>
          )}
        </svg>
      </div>
    );
  }

  if (variant === "ajar") {
    return (
      <div className={className} aria-hidden>
        <svg viewBox="0 0 220 240" className="h-full w-full" fill="none">
          <WarmGiftPaintServers ids={ids} />
          <ellipse
            cx="112"
            cy="218"
            rx="72"
            ry="12"
            fill="#3A080C"
            opacity="0.28"
          />
          {/* Warm glow from the crack */}
          <ellipse
            cx="110"
            cy="108"
            rx="62"
            ry="30"
            fill={`url(#${ids.glow})`}
          />
          <ellipse
            cx="110"
            cy="110"
            rx="38"
            ry="14"
            fill="#FFFCE8"
            opacity="0.88"
          />
          <WarmClosedBody ids={ids} />
          <g transform="translate(0 -8) rotate(-5 110 90)">
            <WarmGiftLidWithBow ids={ids} x={50} y={68} />
          </g>
          <path
            d="M48 98 L50 104 L56 106 L50 108 L48 114 L46 108 L40 106 L46 104 Z"
            fill="#FFF8E0"
            opacity="0.9"
          />
          <path
            d="M168 88 L169.5 92 L173.5 93.5 L169.5 95 L168 99 L166.5 95 L162.5 93.5 L166.5 92 Z"
            fill="#FFF8E0"
            opacity="0.85"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 220 240" className="h-full w-full" fill="none">
        <WarmGiftPaintServers ids={ids} />
        <ellipse
          cx="112"
          cy="218"
          rx="72"
          ry="12"
          fill="#C9A227"
          opacity="0.22"
        />
        <WarmClosedBody ids={ids} />
        <WarmGiftLidWithBow ids={ids} x={50} y={68} />
      </svg>
    </div>
  );
}
