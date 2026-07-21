"use client";

import { useId } from "react";

import { motion } from "framer-motion";

/**
 * Canonical Bloom gift motif — one visual language across Moments + Connection.
 * Closed / ajar / open share the same body, ribbon, and sakura-bow lid.
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
    body: `bg-body-${raw}`,
    lid: `bg-lid-${raw}`,
    ribbon: `bg-ribbon-${raw}`,
    glow: `bg-glow-${raw}`,
    shadow: `bg-shadow-${raw}`,
  };
}

function GiftPaintServers({ ids }: { ids: GiftPaintIds }) {
  return (
    <defs>
      <linearGradient id={ids.body} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9C4D4" />
        <stop offset="55%" stopColor="#F2A8BE" />
        <stop offset="100%" stopColor="#E890A8" />
      </linearGradient>
      <linearGradient id={ids.lid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FBD0DC" />
        <stop offset="100%" stopColor="#F2A8BE" />
      </linearGradient>
      <linearGradient id={ids.ribbon} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F7B8CC" />
        <stop offset="45%" stopColor="#E8799A" />
        <stop offset="100%" stopColor="#D46888" />
      </linearGradient>
      <radialGradient id={ids.glow} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF6E8" stopOpacity="0.95" />
        <stop offset="45%" stopColor="#FFD4A8" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#F2A8BE" stopOpacity="0" />
      </radialGradient>
      <filter id={ids.shadow} x="-20%" y="-10%" width="140%" height="140%">
        <feDropShadow
          dx="10"
          dy="14"
          stdDeviation="10"
          floodColor="#C45B7A"
          floodOpacity="0.28"
        />
      </filter>
    </defs>
  );
}

/** Sakura-bow lid — shared across closed / ajar / open. */
function GiftLidWithBow({
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
      <ellipse cx="60" cy="16" rx="12" ry="10" fill="#E8799A" />
      <path
        d="M52 24 Q42 48 34 60"
        stroke="#E8799A"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M68 24 Q78 48 86 60"
        stroke="#D46888"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <g transform="translate(46 -2)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="14"
            cy="5"
            rx="4.5"
            ry="8"
            fill="#F7A8BE"
            transform={`rotate(${deg} 14 14)`}
          />
        ))}
        <circle cx="14" cy="14" r="3.5" fill="#FFF4E8" />
        <circle cx="14" cy="14" r="1.4" fill="#F0A84A" />
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
      <path d="M40 120h140v18H40z" fill="#FFFFFF" opacity="0.12" />
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

export type BloomGiftBoxProps = {
  className?: string;
  /**
   * closed — wrapped gift (locked gift, quiz intro)
   * ajar — lid cracked with warm glow (score calculation)
   * open — box open, lid resting left (letter emergence / gift opening)
   */
  variant?: "closed" | "ajar" | "open";
  /** Animate lid from closed → open (open variant only). */
  animateLid?: boolean;
  reduceMotion?: boolean;
};

/**
 * Bloom gift box — single motif for Scene Engine Continuity.
 */
export function BloomGiftBox({
  className,
  variant = "closed",
  animateLid = false,
  reduceMotion = false,
}: BloomGiftBoxProps) {
  const ids = useGiftPaintIds();

  if (variant === "open") {
    return (
      <div className={className} aria-hidden>
        <svg viewBox="0 0 280 160" className="h-full w-full" fill="none">
          <GiftPaintServers ids={ids} />
          <ellipse
            cx="150"
            cy="148"
            rx="90"
            ry="12"
            fill="#C45B7A"
            opacity="0.18"
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
              opacity="0.18"
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
              <GiftLidWithBow ids={ids} x={0} y={0} />
            </motion.g>
          ) : (
            <g transform="translate(-8 48) rotate(-28 60 36)">
              <GiftLidWithBow ids={ids} x={0} y={0} />
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
          <GiftPaintServers ids={ids} />
          <ellipse
            cx="112"
            cy="218"
            rx="72"
            ry="12"
            fill="#E8A0B4"
            opacity="0.22"
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
            opacity="0.85"
          />
          <ClosedBody ids={ids} />
          <g transform="translate(0 -8) rotate(-5 110 90)">
            <GiftLidWithBow ids={ids} x={50} y={68} />
          </g>
          {/* Soft sparkles at the crack */}
          <path
            d="M48 98 L50 104 L56 106 L50 108 L48 114 L46 108 L40 106 L46 104 Z"
            fill="#FFF8E0"
            opacity="0.85"
          />
          <path
            d="M168 88 L169.5 92 L173.5 93.5 L169.5 95 L168 99 L166.5 95 L162.5 93.5 L166.5 92 Z"
            fill="#FFF8E0"
            opacity="0.8"
          />
        </svg>
      </div>
    );
  }

  // closed
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 220 240" className="h-full w-full" fill="none">
        <GiftPaintServers ids={ids} />
        <ellipse
          cx="112"
          cy="218"
          rx="72"
          ry="12"
          fill="#E8A0B4"
          opacity="0.22"
        />
        <ClosedBody ids={ids} />
        <GiftLidWithBow ids={ids} x={50} y={68} />
      </svg>
    </div>
  );
}
