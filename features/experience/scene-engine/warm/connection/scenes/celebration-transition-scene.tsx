"use client";

import { useSyncExternalStore, type CSSProperties } from "react";

import { useReducedMotion } from "framer-motion";

import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";

type FireworkSpec = {
  left: string;
  rise: string;
  delay: string;
  size: number;
  variant: 0 | 1 | 2;
  palette: 0 | 1 | 2 | 3;
  duration: string;
};

/**
 * Curated launches — fewer, larger bursts (luxury, not carnival).
 * Motion is CSS transform/opacity only (mobile-safe).
 */
const FIREWORKS: FireworkSpec[] = [
  {
    left: "12%",
    rise: "-70vh",
    delay: "0ms",
    size: 176,
    variant: 0,
    palette: 0,
    duration: "1.65s",
  },
  {
    left: "38%",
    rise: "-78vh",
    delay: "110ms",
    size: 208,
    variant: 1,
    palette: 1,
    duration: "1.75s",
  },
  {
    left: "62%",
    rise: "-72vh",
    delay: "60ms",
    size: 192,
    variant: 2,
    palette: 2,
    duration: "1.7s",
  },
  {
    left: "84%",
    rise: "-66vh",
    delay: "180ms",
    size: 164,
    variant: 0,
    palette: 3,
    duration: "1.55s",
  },
  {
    left: "24%",
    rise: "-56vh",
    delay: "260ms",
    size: 148,
    variant: 1,
    palette: 0,
    duration: "1.6s",
  },
  {
    left: "52%",
    rise: "-82vh",
    delay: "200ms",
    size: 200,
    variant: 0,
    palette: 1,
    duration: "1.8s",
  },
  {
    left: "74%",
    rise: "-60vh",
    delay: "340ms",
    size: 156,
    variant: 2,
    palette: 2,
    duration: "1.55s",
  },
  {
    left: "46%",
    rise: "-48vh",
    delay: "420ms",
    size: 136,
    variant: 1,
    palette: 3,
    duration: "1.5s",
  },
];

/** Crimson · gold · champagne only — no neon carnival colors. */
const PALETTES = [
  { a: "#E8C878", b: "#F5E6B8", c: "#FFFCF5", trail: "#F0D878" },
  { a: "#C9A24A", b: "#F0D878", c: "#FFF8E8", trail: "#E8C878" },
  { a: "#A61E28", b: "#E8C878", c: "#FFF4E4", trail: "#D4B56A" },
  { a: "#8B1A22", b: "#D4B56A", c: "#FFF6E8", trail: "#C9A24A" },
] as const;

function r2(n: number) {
  return Math.round(n * 100) / 100;
}

function BurstPeony({
  id,
  a,
  b,
  c,
}: {
  id: string;
  a: string;
  b: string;
  c: string;
}) {
  const rays = 16;
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="32%" stopColor={c} stopOpacity="0.9" />
          <stop offset="100%" stopColor={a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="46" fill={`url(#${id}-core)`} opacity="0.8" />
      {Array.from({ length: rays }, (_, i) => {
        const ang = (Math.PI * 2 * i) / rays;
        const x2 = r2(60 + Math.cos(ang) * 50);
        const y2 = r2(60 + Math.sin(ang) * 50);
        const mx = r2(60 + Math.cos(ang) * 26);
        const my = r2(60 + Math.sin(ang) * 26);
        return (
          <g key={i}>
            <line
              x1="60"
              y1="60"
              x2={x2}
              y2={y2}
              stroke={i % 2 === 0 ? a : b}
              strokeWidth="2.6"
              strokeLinecap="round"
              opacity="0.88"
            />
            <circle cx={mx} cy={my} r="2.8" fill={i % 2 === 0 ? b : a} />
            <circle cx={x2} cy={y2} r="2.2" fill={c} opacity="0.92" />
          </g>
        );
      })}
      <circle cx="60" cy="60" r="6.5" fill="#FFF8E8" />
      <circle cx="60" cy="60" r="3.2" fill={b} />
    </svg>
  );
}

function BurstChrysanthemum({
  id,
  a,
  b,
  c,
}: {
  id: string;
  a: string;
  b: string;
  c: string;
}) {
  const rays = 22;
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="38%" stopColor={c} stopOpacity="0.88" />
          <stop offset="100%" stopColor={a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="42" fill={`url(#${id}-core)`} opacity="0.78" />
      {Array.from({ length: rays }, (_, i) => {
        const ang = (Math.PI * 2 * i) / rays + 0.03;
        const len = i % 3 === 0 ? 52 : i % 3 === 1 ? 44 : 36;
        const x2 = r2(60 + Math.cos(ang) * len);
        const y2 = r2(60 + Math.sin(ang) * len);
        return (
          <line
            key={i}
            x1="60"
            y1="60"
            x2={x2}
            y2={y2}
            stroke={i % 2 === 0 ? a : b}
            strokeWidth={i % 3 === 0 ? 2.1 : 1.4}
            strokeLinecap="round"
            opacity="0.88"
          />
        );
      })}
      {Array.from({ length: 10 }, (_, i) => {
        const ang = (Math.PI * 2 * i) / 10;
        return (
          <circle
            key={`p-${i}`}
            cx={r2(60 + Math.cos(ang) * 20)}
            cy={r2(60 + Math.sin(ang) * 20)}
            r="2.4"
            fill={c}
          />
        );
      })}
      <circle cx="60" cy="60" r="5.5" fill="#FFF8E8" />
    </svg>
  );
}

function BurstWillow({
  id,
  a,
  b,
  c,
}: {
  id: string;
  a: string;
  b: string;
  c: string;
}) {
  const arms = 14;
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="42%" stopColor={c} stopOpacity="0.82" />
          <stop offset="100%" stopColor={b} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="38" fill={`url(#${id}-core)`} opacity="0.72" />
      {Array.from({ length: arms }, (_, i) => {
        const ang = (Math.PI * 2 * i) / arms - Math.PI / 2;
        const x1 = r2(60 + Math.cos(ang) * 8);
        const y1 = r2(60 + Math.sin(ang) * 8);
        const x2 = r2(60 + Math.cos(ang) * 34);
        const y2 = r2(60 + Math.sin(ang) * 34);
        const x3 = r2(60 + Math.cos(ang + 0.12) * 48);
        const y3 = r2(60 + Math.sin(ang) * 50 + 7);
        return (
          <g key={i}>
            <path
              d={`M ${x1} ${y1} Q ${x2} ${y2} ${x3} ${y3}`}
              stroke={i % 2 === 0 ? a : b}
              strokeWidth="1.85"
              fill="none"
              strokeLinecap="round"
              opacity="0.86"
            />
            <circle cx={x3} cy={y3} r="2.1" fill={c} />
          </g>
        );
      })}
      <circle cx="60" cy="60" r="6" fill="#FFF8E8" />
      <circle cx="60" cy="60" r="2.8" fill={a} />
    </svg>
  );
}

function FireworkIcon({
  id,
  variant,
  palette,
}: {
  id: string;
  variant: 0 | 1 | 2;
  palette: 0 | 1 | 2 | 3;
}) {
  const p = PALETTES[palette] ?? PALETTES[0];
  if (variant === 1)
    return <BurstChrysanthemum id={id} a={p.a} b={p.b} c={p.c} />;
  if (variant === 2) return <BurstWillow id={id} a={p.a} b={p.b} c={p.c} />;
  return <BurstPeony id={id} a={p.a} b={p.b} c={p.c} />;
}

/** Soft gold diamond sparkle — vector, not emoji. */
function GoldSparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden fill="none">
      <path
        d="M6 0.8 L7.2 4.8 L11.2 6 L7.2 7.2 L6 11.2 L4.8 7.2 L0.8 6 L4.8 4.8 Z"
        fill="#F0D878"
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * warm.connection.celebration-transition — Scene 9.
 * Bloom structure (SVG fireworks rise + bloom) · Warm crimson/gold luxury.
 */
export function WarmConnectionCelebrationTransitionScene(
  _props: WarmConnectionSceneProps,
) {
  const reduceMotion = useReducedMotion() ?? false;
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#3A080C]">
      <style>{`
        @keyframes wct-launch {
          0% { transform: translate3d(-50%, 0, 0); }
          38% { transform: translate3d(-50%, var(--wct-rise), 0); }
          100% { transform: translate3d(-50%, var(--wct-rise), 0); }
        }
        @keyframes wct-trail {
          0% { opacity: 0; transform: scaleY(0.2); }
          8% { opacity: 0.95; transform: scaleY(1); }
          36% { opacity: 0.75; transform: scaleY(1.05); }
          42% { opacity: 0; transform: scaleY(0.3); }
          100% { opacity: 0; }
        }
        @keyframes wct-burst {
          0%, 34% { opacity: 0; transform: scale(0.1); }
          40% { opacity: 1; transform: scale(1.06); }
          70% { opacity: 0.92; transform: scale(1.16); }
          100% { opacity: 0; transform: scale(1.28); }
        }
        @keyframes wct-sparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.75); }
          50% { opacity: 0.95; transform: scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wct-anim-launch, .wct-anim-trail, .wct-anim-burst, .wct-anim-sparkle {
            animation: none !important;
          }
          .wct-anim-launch { transform: translate3d(-50%, var(--wct-rise), 0) !important; }
          .wct-anim-burst { opacity: 1 !important; transform: scale(1) !important; }
          .wct-anim-trail { opacity: 0 !important; }
        }
      `}</style>

      {/* Deep crimson velvet field + soft gold lift */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 85% at 50% 78%, #6B121A 0%, #4A0A10 38%, #2A060A 72%, #1A0406 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 100%, rgba(201,162,74,0.22) 0%, transparent 70%)",
        }}
      />

      {mounted ? (
        <>
          {!reduceMotion
            ? [
                { top: "16%", left: "14%", delay: "0s", size: 10 },
                { top: "11%", left: "72%", delay: "0.45s", size: 8 },
                { top: "28%", left: "48%", delay: "0.9s", size: 11 },
                { top: "20%", left: "88%", delay: "0.25s", size: 7 },
                { top: "34%", left: "8%", delay: "0.65s", size: 9 },
              ].map((s, i) => (
                <span
                  key={i}
                  className="wct-anim-sparkle pointer-events-none absolute"
                  style={{
                    top: s.top,
                    left: s.left,
                    width: s.size,
                    height: s.size,
                    animation: `wct-sparkle 2s ease-in-out ${s.delay} infinite`,
                  }}
                >
                  <GoldSparkle className="h-full w-full" />
                </span>
              ))
            : null}

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {FIREWORKS.map((fw, i) => {
              const pal = PALETTES[fw.palette] ?? PALETTES[0];
              return (
                <div
                  key={i}
                  className="wct-anim-launch absolute bottom-0"
                  style={
                    {
                      left: fw.left,
                      width: fw.size,
                      height: fw.size,
                      ["--wct-rise"]: fw.rise,
                      animation: reduceMotion
                        ? undefined
                        : `wct-launch ${fw.duration} cubic-bezier(0.22, 0.8, 0.28, 1) ${fw.delay} infinite`,
                      willChange: reduceMotion ? undefined : "transform",
                    } as CSSProperties
                  }
                >
                  <div
                    className="wct-anim-trail absolute bottom-[42%] left-1/2 w-[4px] origin-bottom -translate-x-1/2 rounded-full"
                    style={{
                      height: Math.round(fw.size * 0.52),
                      background: `linear-gradient(to top, transparent 0%, ${pal.trail} 40%, #FFF8E8 100%)`,
                      animation: reduceMotion
                        ? undefined
                        : `wct-trail ${fw.duration} ease-out ${fw.delay} infinite`,
                    }}
                  />

                  <div
                    className="wct-anim-burst absolute inset-0"
                    style={{
                      filter: "drop-shadow(0 0 14px rgba(240,216,120,0.35))",
                      animation: reduceMotion
                        ? undefined
                        : `wct-burst ${fw.duration} ease-out ${fw.delay} infinite`,
                      willChange: reduceMotion
                        ? undefined
                        : "transform, opacity",
                    }}
                  >
                    <FireworkIcon
                      id={`wct-fw-${i}`}
                      variant={fw.variant}
                      palette={fw.palette}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : null}

      <span className="sr-only">Celebrating your connection</span>
    </div>
  );
}
