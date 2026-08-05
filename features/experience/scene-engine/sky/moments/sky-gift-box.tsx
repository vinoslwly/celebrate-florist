"use client";

import { useId } from "react";

import { motion } from "framer-motion";

import {
  MOTION_DURATION,
  MOTION_EASE,
} from "@/features/experience/scene-engine/shared/motion";

/**
 * Sky Moments gift motif — light-blue box + cream stitched ribbon + gingham heart.
 * Treasures Final uses tone="pearl" (white / silver — not gold).
 * Same closed/open animation model as Bloom / Warm.
 */

export type SkyGiftTone = "sky" | "pearl";

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

function SkyGiftPaintServers({
  ids,
  tone = "sky",
}: {
  ids: GiftPaintIds;
  tone?: SkyGiftTone;
}) {
  const pearl = tone === "pearl";
  return (
    <defs>
      <linearGradient id={ids.body} x1="0" y1="0" x2="0" y2="1">
        {pearl ? (
          <>
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#F7F7F5" />
            <stop offset="100%" stopColor="#EBE9E4" />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor="#A8D0EA" />
            <stop offset="50%" stopColor="#7EB6D9" />
            <stop offset="100%" stopColor="#5B9BC8" />
          </>
        )}
      </linearGradient>
      <linearGradient id={ids.lid} x1="0" y1="0" x2="0" y2="1">
        {pearl ? (
          <>
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#FFFEFB" />
            <stop offset="100%" stopColor="#F0EEE9" />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor="#B8D8F0" />
            <stop offset="100%" stopColor="#6BA3C9" />
          </>
        )}
      </linearGradient>
      {/* Pearl ribbon: deeper sky satin so white body pops */}
      <linearGradient id={ids.ribbon} x1="0" y1="0" x2="1" y2="1">
        {pearl ? (
          <>
            <stop offset="0%" stopColor="#9EC4DE" />
            <stop offset="40%" stopColor="#5A9BC4" />
            <stop offset="100%" stopColor="#2A5278" />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor="#FFFEFB" />
            <stop offset="45%" stopColor="#F5F0E8" />
            <stop offset="100%" stopColor="#E8E0D4" />
          </>
        )}
      </linearGradient>
      <radialGradient id={ids.glow} cx="50%" cy="50%" r="50%">
        {pearl ? (
          <>
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="40%" stopColor="#FFFEFB" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C5DCEF" stopOpacity="0" />
          </>
        ) : (
          <>
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#D6EAF8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#6BA3C9" stopOpacity="0" />
          </>
        )}
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
      <filter id={ids.shadow} x="-25%" y="-15%" width="150%" height="150%">
        <feDropShadow
          dx={pearl ? 6 : 8}
          dy={pearl ? 10 : 12}
          stdDeviation={pearl ? 11 : 9}
          floodColor="#1E3A5F"
          floodOpacity={pearl ? 0.22 : 0.28}
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
  stroke = "#6BA3C9",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
  stroke?: string;
}) {
  return (
    <rect
      x={x + 3}
      y={y + 3}
      width={w - 6}
      height={h - 6}
      rx={Math.max(1, rx - 1)}
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      strokeDasharray="3 3"
      opacity="0.55"
    />
  );
}

/** Lid + bow — sky cream bow, or pearl luxury (wings + solid heart). */
function SkyGiftLidWithBow({
  ids,
  x,
  y,
  tone = "sky",
}: {
  ids: GiftPaintIds;
  x: number;
  y: number;
  tone?: SkyGiftTone;
}) {
  const pearl = tone === "pearl";
  const stitch = pearl ? "#A8C8E0" : "#6BA3C9";

  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Soft pearl wings — Final Treasure only */}
      {pearl ? (
        <g opacity="0.95">
          <path
            d="M8 28 C-6 18 -10 4 6 8 C14 10 22 20 28 28 C18 26 12 28 8 28Z"
            fill="#FFFFFF"
            stroke="#B8D0E4"
            strokeWidth="1.2"
          />
          <path
            d="M112 28 C126 18 130 4 114 8 C106 10 98 20 92 28 C102 26 108 28 112 28Z"
            fill="#FFFFFF"
            stroke="#B8D0E4"
            strokeWidth="1.2"
          />
          <path
            d="M10 22 C2 14 4 8 12 12"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M110 22 C118 14 116 8 108 12"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>
      ) : null}

      <rect
        x="0"
        y="22"
        width="120"
        height="30"
        rx="6"
        fill={`url(#${ids.lid})`}
        stroke={pearl ? "#D0D4DA" : "none"}
        strokeWidth={pearl ? 1.4 : 0}
      />
      {/* Lid sheen — crisp white, not blue wash */}
      {pearl ? (
        <path
          d="M6 28h108"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />
      ) : null}
      <rect x="46" y="22" width="28" height="30" fill={`url(#${ids.ribbon})`} />
      <StitchRect x={46} y={22} w={28} h={30} rx={2} stroke={stitch} />

      {/* Multi-loop bow — white loops + sky knot for contrast */}
      <ellipse
        cx="28"
        cy="12"
        rx="26"
        ry="14"
        fill={pearl ? "#FFFFFF" : `url(#${ids.ribbon})`}
        stroke={pearl ? "#C5D0DC" : undefined}
        strokeWidth={pearl ? 1.2 : 0}
        transform="rotate(-18 28 12)"
      />
      <ellipse
        cx="92"
        cy="12"
        rx="26"
        ry="14"
        fill={pearl ? "#FFFFFF" : `url(#${ids.ribbon})`}
        stroke={pearl ? "#C5D0DC" : undefined}
        strokeWidth={pearl ? 1.2 : 0}
        transform="rotate(18 92 12)"
      />
      <ellipse
        cx="42"
        cy="8"
        rx="16"
        ry="10"
        fill={pearl ? "#FFFEFB" : `url(#${ids.ribbon})`}
        transform="rotate(-8 42 8)"
      />
      <ellipse
        cx="78"
        cy="8"
        rx="16"
        ry="10"
        fill={pearl ? "#FFFEFB" : `url(#${ids.ribbon})`}
        transform="rotate(8 78 8)"
      />
      <ellipse
        cx="60"
        cy="14"
        rx="11"
        ry="9"
        fill={pearl ? "#6BA3C9" : `url(#${ids.ribbon})`}
      />
      {pearl ? (
        <ellipse
          cx="57"
          cy="11"
          rx="3.5"
          ry="2.2"
          fill="#FFFFFF"
          opacity="0.55"
        />
      ) : null}

      {/* Heart — solid for pearl (no gingham / checker look) */}
      {pearl ? (
        <path
          d="M60 28c-5.5-4.5-9-7.2-9-11 0-2.8 2.2-4.6 4.5-4.6 1.6 0 3.1 0.9 4.5 2.7 1.4-1.8 2.9-2.7 4.5-2.7 2.3 0 4.5 1.8 4.5 4.6 0 3.8-3.5 6.5-9 11Z"
          fill="#7EB6D9"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
      ) : (
        <path
          d="M60 28c-5.5-4.5-9-7.2-9-11 0-2.8 2.2-4.6 4.5-4.6 1.6 0 3.1 0.9 4.5 2.7 1.4-1.8 2.9-2.7 4.5-2.7 2.3 0 4.5 1.8 4.5 4.6 0 3.8-3.5 6.5-9 11Z"
          fill={`url(#${ids.check})`}
          stroke="#5B8FBA"
          strokeWidth="1"
        />
      )}

      {/* Streamers */}
      <path
        d="M52 26 Q40 48 32 62"
        stroke={pearl ? "#5A9BC4" : `url(#${ids.ribbon})`}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M68 26 Q80 48 88 62"
        stroke={pearl ? "#3D7AAD" : `url(#${ids.ribbon})`}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        opacity="0.92"
      />

      {/* Gift tag */}
      <g transform="translate(98 34) rotate(12)">
        <path
          d="M0 0h28v36c0 0-4-3-8-3s-8 3-8 3c0 0-4-3-8-3s-4 3-4 3V0Z"
          fill="#FFFFFF"
          stroke={pearl ? "#C5D0DC" : "#D6E0EA"}
          strokeWidth="1.2"
        />
        <circle
          cx="8"
          cy="6"
          r="2.2"
          fill="none"
          stroke="#6BA3C9"
          strokeWidth="1"
        />
        {pearl ? (
          <path
            d="M14 14l1.4 3.2 3.5.3-2.6 2.4.7 3.4-3-1.8-3 1.8.7-3.4-2.6-2.4 3.5-.3Z"
            fill="#5A9BC4"
          />
        ) : (
          <>
            <circle cx="14" cy="18" r="3.2" fill="#1E3A5F" />
            <circle cx="11" cy="21" r="2.2" fill="#2A4A6E" />
            <circle cx="17" cy="21" r="2.2" fill="#2A4A6E" />
            <path
              d="M14 22v10"
              stroke="#1E3A5F"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </>
        )}
      </g>
    </g>
  );
}

function ClosedBody({
  ids,
  tone = "sky",
}: {
  ids: GiftPaintIds;
  tone?: SkyGiftTone;
}) {
  const pearl = tone === "pearl";
  const stitch = pearl ? "#8BB4D0" : "#6BA3C9";

  return (
    <g filter={`url(#${ids.shadow})`}>
      <rect
        x="40"
        y="110"
        width="140"
        height="100"
        rx="10"
        fill={`url(#${ids.body})`}
        stroke={pearl ? "#C8CCD2" : "none"}
        strokeWidth={pearl ? 1.8 : 0}
      />
      {/* Pearl luminous sheen — white only, no blue wash */}
      {pearl ? (
        <>
          <path
            d="M48 118h124"
            stroke="#FFFFFF"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M52 128 Q70 150 58 178"
            stroke="#FFFFFF"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.35"
          />
          {/* Soft embossed cloud hints — very light gray, not blue */}
          <ellipse
            cx="64"
            cy="168"
            rx="14"
            ry="7"
            fill="#E8E6E2"
            opacity="0.55"
          />
          <ellipse
            cx="74"
            cy="166"
            rx="10"
            ry="6"
            fill="#E8E6E2"
            opacity="0.45"
          />
          <ellipse
            cx="156"
            cy="172"
            rx="12"
            ry="6"
            fill="#E8E6E2"
            opacity="0.4"
          />
        </>
      ) : (
        <path d="M40 120h140v16H40z" fill="#FFFFFF" opacity="0.14" />
      )}
      <rect
        x="96"
        y="110"
        width="28"
        height="100"
        fill={`url(#${ids.ribbon})`}
      />
      {pearl ? (
        <rect
          x="100"
          y="110"
          width="6"
          height="100"
          fill="#FFFFFF"
          opacity="0.4"
        />
      ) : null}
      <StitchRect x={96} y={110} w={28} h={100} rx={2} stroke={stitch} />
      <rect
        x="40"
        y="148"
        width="140"
        height="22"
        fill={`url(#${ids.ribbon})`}
      />
      {pearl ? (
        <rect
          x="40"
          y="150"
          width="140"
          height="5"
          fill="#FFFFFF"
          opacity="0.35"
        />
      ) : null}
      <StitchRect x={40} y={148} w={140} h={22} rx={2} stroke={stitch} />

      {/* Pearl seal / keyhole at ribbon cross */}
      {pearl ? (
        <g transform="translate(110 145)">
          <circle
            cx="10"
            cy="14"
            r="13"
            fill="#FFFFFF"
            stroke="#B0B8C4"
            strokeWidth="1.8"
          />
          <circle cx="10" cy="14" r="9.5" fill="#F4F5F7" />
          <rect x="5.5" y="12" width="9" height="8" rx="1.5" fill="#5A9BC4" />
          <path
            d="M7.2 12V9.8a2.8 2.8 0 0 1 5.6 0V12"
            stroke="#2A5278"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="10" cy="15.5" r="1.1" fill="#FFFFFF" />
        </g>
      ) : null}

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
          fill={
            pearl
              ? i % 2 === 0
                ? "#6BA3C9"
                : "#8BB4D0"
              : i % 2 === 0
                ? "#FFFFFF"
                : "#D6EAF8"
          }
          opacity={pearl ? 0.8 : 0.9}
        />
      ))}
    </g>
  );
}

export type SkyGiftBoxProps = {
  className?: string;
  /**
   * closed — Moments / Connection gift intro
   * ajar — lid cracked with warm glow (Connection score calculation)
   * open — Moments gift opening
   */
  variant?: "closed" | "ajar" | "open";
  /**
   * sky — soft blue (default)
   * pearl — white / silver Final Treasure (Sky Treasures — not gold)
   */
  tone?: SkyGiftTone;
  /** Animate lid from closed → open (open variant only). */
  animateLid?: boolean;
  reduceMotion?: boolean;
};

/**
 * Sky gift box — Theme Lab Moments Scene 3 motif · Treasures Final = pearl.
 */
export function SkyGiftBox({
  className,
  variant = "closed",
  tone = "sky",
  animateLid = false,
  reduceMotion = false,
}: SkyGiftBoxProps) {
  const ids = useGiftPaintIds();

  if (variant === "open") {
    return (
      <div className={className} aria-hidden>
        <svg viewBox="0 0 280 160" className="h-full w-full" fill="none">
          <SkyGiftPaintServers ids={ids} tone={tone} />
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
              stroke={tone === "pearl" ? "#C8CCD2" : "none"}
              strokeWidth={tone === "pearl" ? 1.6 : 0}
            />
            <rect
              x="80"
              y="70"
              width="140"
              height="14"
              rx="4"
              fill="#FFFFFF"
              opacity={tone === "pearl" ? 0.55 : 0.16}
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
              transition={{
                duration: MOTION_DURATION.ceremony,
                ease: MOTION_EASE.out,
              }}
              style={{ originX: "60px", originY: "36px" }}
            >
              <SkyGiftLidWithBow ids={ids} x={0} y={0} tone={tone} />
            </motion.g>
          ) : (
            <g transform="translate(-8 46) rotate(-28 60 36)">
              <SkyGiftLidWithBow ids={ids} x={0} y={0} tone={tone} />
            </g>
          )}
        </svg>
      </div>
    );
  }

  if (variant === "ajar") {
    const goldGlow = `${ids.glow}-gold`;
    const goldRay = `${ids.glow}-ray`;
    const bodySheen = `${ids.body}-sheen`;
    const satinRibbon = `${ids.ribbon}-satin`;
    return (
      <div className={className} aria-hidden>
        <svg viewBox="0 0 240 260" className="h-full w-full" fill="none">
          <SkyGiftPaintServers ids={ids} tone={tone} />
          <defs>
            <radialGradient id={goldGlow} cx="50%" cy="55%" r="50%">
              <stop offset="0%" stopColor="#FFFDF0" stopOpacity="1" />
              <stop offset="22%" stopColor="#FFE8A0" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#F0C060" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#F0C060" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={goldRay} x1="0.5" y1="1" x2="0.5" y2="0">
              <stop offset="0%" stopColor="#FFF8DC" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFE8A0" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={bodySheen} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id={satinRibbon} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#FFFEFB" />
              <stop offset="70%" stopColor="#F0EBE3" />
              <stop offset="100%" stopColor="#E2D8CC" />
            </linearGradient>
            <filter
              id={`${ids.shadow}-ajar`}
              x="-30%"
              y="-20%"
              width="160%"
              height="160%"
            >
              <feDropShadow
                dx="10"
                dy="16"
                stdDeviation="12"
                floodColor="#1E3A5F"
                floodOpacity="0.32"
              />
            </filter>
          </defs>

          {/* Soft ground shadow */}
          <ellipse
            cx="120"
            cy="236"
            rx="78"
            ry="14"
            fill="#1E3A5F"
            opacity="0.22"
          />

          {/* Magical gold bloom from the crack */}
          <ellipse
            cx="120"
            cy="118"
            rx="88"
            ry="48"
            fill={`url(#${goldGlow})`}
          />
          <ellipse
            cx="120"
            cy="122"
            rx="48"
            ry="20"
            fill="#FFFCE8"
            opacity="0.95"
          />
          {/* Soft light rays */}
          <path
            d="M120 128 L95 72 L105 72 Z"
            fill={`url(#${goldRay})`}
            opacity="0.55"
          />
          <path
            d="M120 128 L120 58 L130 58 Z"
            fill={`url(#${goldRay})`}
            opacity="0.65"
          />
          <path
            d="M120 128 L145 70 L155 70 Z"
            fill={`url(#${goldRay})`}
            opacity="0.5"
          />

          {/* Body — richer bevel + satin ribbons */}
          <g filter={`url(#${ids.shadow}-ajar)`}>
            <rect
              x="48"
              y="118"
              width="144"
              height="104"
              rx="12"
              fill={`url(#${ids.body})`}
            />
            {/* Right edge depth */}
            <path
              d="M180 126 V210 C180 218 176 222 168 222 H180 C188 222 192 216 192 208 V134 C192 126 188 122 180 122 Z"
              fill="#3D7AAD"
              opacity="0.28"
            />
            <path d="M48 128h144v18H48z" fill="#FFFFFF" opacity="0.18" />
            <rect
              x="48"
              y="118"
              width="144"
              height="104"
              rx="12"
              fill={`url(#${bodySheen})`}
            />
            {/* Satin cream ribbons */}
            <rect
              x="104"
              y="118"
              width="32"
              height="104"
              fill={`url(#${satinRibbon})`}
            />
            <rect
              x="108"
              y="118"
              width="8"
              height="104"
              fill="#FFFFFF"
              opacity="0.45"
            />
            <StitchRect x={104} y={118} w={32} h={104} rx={2} />
            <rect
              x="48"
              y="158"
              width="144"
              height="26"
              fill={`url(#${satinRibbon})`}
            />
            <rect
              x="48"
              y="160"
              width="144"
              height="6"
              fill="#FFFFFF"
              opacity="0.4"
            />
            <StitchRect x={48} y={158} w={144} h={26} rx={2} />
            {/* Soft stars */}
            {(
              [
                [68, 138],
                [172, 142],
                [78, 200],
                [164, 194],
              ] as const
            ).map(([sx, sy], i) => (
              <path
                key={i}
                d={`M${sx} ${sy - 5.5}l1.8 4 4.4.4-3.3 3.1.9 4.2-3.8-2.2-3.8 2.2.9-4.2-3.3-3.1 4.4-.4Z`}
                fill={i % 2 === 0 ? "#FFFFFF" : "#E8F4FC"}
                opacity="0.92"
              />
            ))}
          </g>

          {/* Lid cracked open — more dramatic ajar */}
          <g transform="translate(2 -14) rotate(-9 120 98)">
            <SkyGiftLidWithBow ids={ids} x={60} y={72} tone={tone} />
          </g>

          {/* Crack-edge sparkles */}
          <path
            d="M56 108 L58.2 114 L64 115.5 L58.2 117 L56 123 L53.8 117 L48 115.5 L53.8 114 Z"
            fill="#FFF8E0"
            opacity="0.95"
          />
          <path
            d="M178 96 L180 101.5 L185 103 L180 104.5 L178 110 L176 104.5 L171 103 L176 101.5 Z"
            fill="#FFF8E0"
            opacity="0.9"
          />
          <path
            d="M120 102 L121.4 106 L125.5 107.2 L121.4 108.4 L120 112.5 L118.6 108.4 L114.5 107.2 L118.6 106 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 220 240" className="h-full w-full" fill="none">
        <SkyGiftPaintServers ids={ids} tone={tone} />
        <ellipse
          cx="112"
          cy="218"
          rx="72"
          ry="12"
          fill={tone === "pearl" ? "#1E3A5F" : "#6BA3C9"}
          opacity={tone === "pearl" ? 0.18 : 0.22}
        />
        <ClosedBody ids={ids} tone={tone} />
        <SkyGiftLidWithBow ids={ids} x={50} y={66} tone={tone} />
      </svg>
    </div>
  );
}
