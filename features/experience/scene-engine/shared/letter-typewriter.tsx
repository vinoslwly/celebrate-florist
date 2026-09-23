"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function typeDelayMs(previous: string, next: string): number {
  if (next === "\n") return 260 + Math.random() * 80;
  if (/[.!?…]/.test(previous)) return 280 + Math.random() * 120;
  if (/[,;:]/.test(previous)) return 110 + Math.random() * 50;
  if (previous === "—" || previous === "–") return 120 + Math.random() * 50;
  if (next === " ") return 28 + Math.random() * 22;
  if (Math.random() < 0.025) return 90 + Math.random() * 80;
  return 46 + Math.random() * 28;
}

type LetterTypewriterBodyProps = {
  chunks: string[];
  startDelayMs: number;
  reduceMotion: boolean;
  onDone: () => void;
  ink: string;
  caretColor: string;
};

/**
 * Character-by-character letter body — same pacing as Cloudie Moments.
 */
export function LetterTypewriterBody({
  chunks,
  startDelayMs,
  reduceMotion,
  onDone,
  ink,
  caretColor,
}: LetterTypewriterBodyProps) {
  const source = chunks.join("\u0001");
  const paras = useMemo(() => source.split("\u0001").filter(Boolean), [source]);
  const [paraIndex, setParaIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(reduceMotion ? Infinity : 0);
  const [finished, setFinished] = useState(reduceMotion);
  const doneRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;

    if (reduceMotion) {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setParaIndex(Math.max(paras.length - 1, 0));
        setCharIndex(Infinity);
        setFinished(true);
        if (!doneRef.current) {
          doneRef.current = true;
          onDone();
        }
      }, 0);
      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    doneRef.current = false;
    let pi = 0;
    let ci = 0;

    const schedule = (ms: number, fn: () => void) => {
      timer = window.setTimeout(fn, ms);
    };

    const tick = () => {
      if (cancelled) return;
      const current = paras[pi] ?? "";

      if (ci < current.length) {
        ci += 1;
        setCharIndex(ci);
        const prev = current[ci - 1] ?? "";
        const next = current[ci] ?? "";
        schedule(typeDelayMs(prev, next), tick);
        return;
      }

      if (pi < paras.length - 1) {
        schedule(280 + Math.random() * 100, () => {
          if (cancelled) return;
          pi += 1;
          ci = 0;
          setParaIndex(pi);
          setCharIndex(0);
          schedule(typeDelayMs("", paras[pi]?.[0] ?? " "), tick);
        });
        return;
      }

      schedule(420, () => {
        if (!cancelled && !doneRef.current) {
          doneRef.current = true;
          setFinished(true);
          onDone();
        }
      });
    };

    timer = window.setTimeout(() => {
      if (cancelled) return;
      setFinished(false);
      setParaIndex(0);
      setCharIndex(0);
      if (paras.length === 0) {
        doneRef.current = true;
        setFinished(true);
        onDone();
        return;
      }
      schedule(startDelayMs, tick);
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [onDone, paras, reduceMotion, startDelayMs]);

  const showCaret = !reduceMotion && !finished;

  return (
    <div className="relative">
      <style>{`
        @keyframes celebrate-letter-caret {
          0%, 48% { opacity: 1; }
          50%, 100% { opacity: 0.15; }
        }
      `}</style>
      <div className="invisible space-y-4 sm:space-y-5" aria-hidden>
        {paras.map((chunk, pi) => (
          <p
            key={pi}
            className="font-serif text-[15px] leading-[1.75] sm:text-base"
          >
            {chunk}
          </p>
        ))}
      </div>
      <div className="absolute inset-0 space-y-4 sm:space-y-5">
        {paras.map((chunk, pi) => {
          if (pi > paraIndex) return null;
          const shown =
            reduceMotion || pi < paraIndex
              ? chunk
              : chunk.slice(0, Math.min(charIndex, chunk.length));
          const caretHere = showCaret && pi === paraIndex;

          return (
            <p
              key={pi}
              className="font-serif text-[15px] leading-[1.75] sm:text-base"
              style={{ color: ink }}
            >
              {shown}
              {caretHere ? (
                <span
                  aria-hidden
                  className="ml-[1px] inline-block h-[1.05em] w-[1.5px] translate-y-[0.14em] align-middle"
                  style={{
                    backgroundColor: caretColor,
                    animation:
                      "celebrate-letter-caret 1.05s ease-in-out infinite",
                  }}
                />
              ) : null}
            </p>
          );
        })}
      </div>
      <p className="sr-only">{paras.join(" ")}</p>
    </div>
  );
}
