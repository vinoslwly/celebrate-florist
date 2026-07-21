"use client";

import { useSyncExternalStore, type CSSProperties } from "react";

import { useReducedMotion } from "framer-motion";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";

type FireworkSpec = {
  left: string;
  /** Rise distance as negative vh (from bottom stack). */
  rise: string;
  delay: string;
  size: number;
  variant: 0 | 1 | 2;
  palette: 0 | 1 | 2 | 3 | 4 | 5;
  duration: string;
};

/**
 * Dense launch plan — large icons filling the frame.
 * Motion is CSS transform/opacity only (mobile-safe).
 */
const FIREWORKS: FireworkSpec[] = [
  {
    left: "8%",
    rise: "-72vh",
    delay: "0ms",
    size: 168,
    variant: 0,
    palette: 0,
    duration: "1.55s",
  },
  {
    left: "28%",
    rise: "-78vh",
    delay: "90ms",
    size: 196,
    variant: 1,
    palette: 1,
    duration: "1.65s",
  },
  {
    left: "52%",
    rise: "-70vh",
    delay: "40ms",
    size: 210,
    variant: 2,
    palette: 2,
    duration: "1.7s",
  },
  {
    left: "74%",
    rise: "-76vh",
    delay: "130ms",
    size: 180,
    variant: 0,
    palette: 3,
    duration: "1.6s",
  },
  {
    left: "90%",
    rise: "-68vh",
    delay: "200ms",
    size: 156,
    variant: 1,
    palette: 4,
    duration: "1.5s",
  },
  {
    left: "18%",
    rise: "-58vh",
    delay: "280ms",
    size: 150,
    variant: 2,
    palette: 5,
    duration: "1.55s",
  },
  {
    left: "42%",
    rise: "-84vh",
    delay: "180ms",
    size: 188,
    variant: 0,
    palette: 1,
    duration: "1.75s",
  },
  {
    left: "64%",
    rise: "-62vh",
    delay: "320ms",
    size: 172,
    variant: 1,
    palette: 0,
    duration: "1.55s",
  },
  {
    left: "82%",
    rise: "-80vh",
    delay: "360ms",
    size: 164,
    variant: 2,
    palette: 2,
    duration: "1.6s",
  },
  {
    left: "36%",
    rise: "-50vh",
    delay: "420ms",
    size: 140,
    variant: 0,
    palette: 3,
    duration: "1.45s",
  },
  {
    left: "58%",
    rise: "-54vh",
    delay: "480ms",
    size: 148,
    variant: 1,
    palette: 5,
    duration: "1.5s",
  },
];

const PALETTES = [
  { a: "#FF4D8D", b: "#FFD166", c: "#FFE8F0", trail: "#FF8FB8" },
  { a: "#C77DFF", b: "#F15BB5", c: "#E8D5FF", trail: "#D4A5FF" },
  { a: "#FFD60A", b: "#FF6B6B", c: "#FFF3C4", trail: "#FFC857" },
  { a: "#4CC9F0", b: "#F72585", c: "#D6F5FF", trail: "#7BDFF2" },
  { a: "#FF006E", b: "#FFBE0B", c: "#FFD6E8", trail: "#FF5C9A" },
  { a: "#9B5DE5", b: "#00F5D4", c: "#F0E6FF", trail: "#B388FF" },
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
  const rays = 18;
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="35%" stopColor={c} stopOpacity="0.95" />
          <stop offset="100%" stopColor={a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="48" fill={`url(#${id}-core)`} opacity="0.85" />
      {Array.from({ length: rays }, (_, i) => {
        const ang = (Math.PI * 2 * i) / rays;
        const x2 = r2(60 + Math.cos(ang) * 52);
        const y2 = r2(60 + Math.sin(ang) * 52);
        const mx = r2(60 + Math.cos(ang) * 28);
        const my = r2(60 + Math.sin(ang) * 28);
        return (
          <g key={i}>
            <line
              x1="60"
              y1="60"
              x2={x2}
              y2={y2}
              stroke={i % 2 === 0 ? a : b}
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.92"
            />
            <circle cx={mx} cy={my} r="3.4" fill={i % 2 === 0 ? b : a} />
            <circle cx={x2} cy={y2} r="2.6" fill={c} opacity="0.95" />
          </g>
        );
      })}
      <circle cx="60" cy="60" r="7" fill="#FFF8E8" />
      <circle cx="60" cy="60" r="3.5" fill={b} />
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
  const rays = 24;
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor={c} stopOpacity="0.9" />
          <stop offset="100%" stopColor={a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="44" fill={`url(#${id}-core)`} opacity="0.8" />
      {Array.from({ length: rays }, (_, i) => {
        const ang = (Math.PI * 2 * i) / rays + 0.04;
        const len = i % 3 === 0 ? 54 : i % 3 === 1 ? 46 : 38;
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
            strokeWidth={i % 3 === 0 ? 2.4 : 1.6}
            strokeLinecap="round"
            opacity="0.9"
          />
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const ang = (Math.PI * 2 * i) / 12;
        return (
          <circle
            key={`p-${i}`}
            cx={r2(60 + Math.cos(ang) * 22)}
            cy={r2(60 + Math.sin(ang) * 22)}
            r="2.8"
            fill={c}
          />
        );
      })}
      <circle cx="60" cy="60" r="6" fill="#FFFFFF" />
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
  const arms = 16;
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor={c} stopOpacity="0.85" />
          <stop offset="100%" stopColor={b} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="40" fill={`url(#${id}-core)`} opacity="0.75" />
      {Array.from({ length: arms }, (_, i) => {
        const ang = (Math.PI * 2 * i) / arms - Math.PI / 2;
        const x1 = r2(60 + Math.cos(ang) * 8);
        const y1 = r2(60 + Math.sin(ang) * 8);
        const x2 = r2(60 + Math.cos(ang) * 36);
        const y2 = r2(60 + Math.sin(ang) * 36);
        const x3 = r2(60 + Math.cos(ang + 0.15) * 50);
        const y3 = r2(60 + Math.sin(ang) * 52 + 8);
        return (
          <g key={i}>
            <path
              d={`M ${x1} ${y1} Q ${x2} ${y2} ${x3} ${y3}`}
              stroke={i % 2 === 0 ? a : b}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.88"
            />
            <circle cx={x3} cy={y3} r="2.4" fill={c} />
          </g>
        );
      })}
      <circle cx="60" cy="60" r="6.5" fill="#FFF8E8" />
      <circle cx="60" cy="60" r="3" fill={a} />
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
  palette: 0 | 1 | 2 | 3 | 4 | 5;
}) {
  const p = PALETTES[palette] ?? PALETTES[0];
  if (variant === 1)
    return <BurstChrysanthemum id={id} a={p.a} b={p.b} c={p.c} />;
  if (variant === 2) return <BurstWillow id={id} a={p.a} b={p.b} c={p.c} />;
  return <BurstPeony id={id} a={p.a} b={p.b} c={p.c} />;
}

/**
 * connection.celebration-transition — living Founder Scene 9 (revised).
 * Large SVG firework icons rise bottom→top and bloom; CSS-only for mobile.
 */
export function ConnectionCelebrationTransitionScene(
  _props: ConnectionSceneProps,
) {
  const reduceMotion = useReducedMotion() ?? false;
  /** Client-only mount avoids SVG trig hydration drift across runtimes. */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <div className="relative flex min-h-full w-full flex-1 overflow-hidden bg-[#F7B8C8]">
      <style>{`
        @keyframes ct-launch {
          0% { transform: translate3d(-50%, 0, 0); }
          38% { transform: translate3d(-50%, var(--ct-rise), 0); }
          100% { transform: translate3d(-50%, var(--ct-rise), 0); }
        }
        @keyframes ct-trail {
          0% { opacity: 0; transform: scaleY(0.2); }
          8% { opacity: 1; transform: scaleY(1); }
          36% { opacity: 0.85; transform: scaleY(1.05); }
          42% { opacity: 0; transform: scaleY(0.3); }
          100% { opacity: 0; }
        }
        @keyframes ct-burst {
          0%, 34% { opacity: 0; transform: scale(0.12); }
          40% { opacity: 1; transform: scale(1.08); }
          72% { opacity: 0.95; transform: scale(1.18); }
          100% { opacity: 0; transform: scale(1.32); }
        }
        @keyframes ct-sparkle {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ct-anim-launch, .ct-anim-trail, .ct-anim-burst, .ct-anim-sparkle {
            animation: none !important;
          }
          .ct-anim-launch { transform: translate3d(-50%, var(--ct-rise), 0) !important; }
          .ct-anim-burst { opacity: 1 !important; transform: scale(1) !important; }
          .ct-anim-trail { opacity: 0 !important; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 75%, #FFE0EA 0%, #F7B8C8 42%, #E890A8 100%)",
        }}
      />

      {mounted ? (
        <>
          {!reduceMotion
            ? [
                { top: "18%", left: "12%", delay: "0s" },
                { top: "12%", left: "70%", delay: "0.4s" },
                { top: "30%", left: "48%", delay: "0.8s" },
                { top: "22%", left: "88%", delay: "0.2s" },
              ].map((s, i) => (
                <span
                  key={i}
                  className="ct-anim-sparkle pointer-events-none absolute text-sm text-[#FFF8E0]"
                  style={{
                    top: s.top,
                    left: s.left,
                    animation: `ct-sparkle 1.8s ease-in-out ${s.delay} infinite`,
                  }}
                >
                  ✦
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
                  className="ct-anim-launch absolute bottom-0"
                  style={
                    {
                      left: fw.left,
                      width: fw.size,
                      height: fw.size,
                      ["--ct-rise"]: fw.rise,
                      animation: reduceMotion
                        ? undefined
                        : `ct-launch ${fw.duration} cubic-bezier(0.22, 0.8, 0.28, 1) ${fw.delay} infinite`,
                      willChange: reduceMotion ? undefined : "transform",
                    } as CSSProperties
                  }
                >
                  <div
                    className="ct-anim-trail absolute bottom-[42%] left-1/2 w-[5px] origin-bottom -translate-x-1/2 rounded-full"
                    style={{
                      height: Math.round(fw.size * 0.55),
                      background: `linear-gradient(to top, transparent 0%, ${pal.trail} 45%, #FFFFFF 100%)`,
                      animation: reduceMotion
                        ? undefined
                        : `ct-trail ${fw.duration} ease-out ${fw.delay} infinite`,
                    }}
                  />

                  <div
                    className="ct-anim-burst absolute inset-0"
                    style={{
                      animation: reduceMotion
                        ? undefined
                        : `ct-burst ${fw.duration} ease-out ${fw.delay} infinite`,
                      willChange: reduceMotion
                        ? undefined
                        : "transform, opacity",
                    }}
                  >
                    <FireworkIcon
                      id={`fw-${i}`}
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
