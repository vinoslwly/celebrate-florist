"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

import type { Theme } from "@/types/theme";

import { LetterView } from "@/features/experience/components/letter-view";
import { PhotoGallery } from "@/features/experience/components/photo-gallery";
import { ConnectionSceneHost } from "@/features/experience/scene-engine/connection/connection-scene-host";
import {
  CONNECTION_STATIC_SCENE_IDS,
  isConnectionQuizQuestionScene,
  type ConnectionSceneId,
} from "@/features/experience/scene-engine/connection/graph";
import {
  MEMORIES_STATIC_SCENE_IDS,
  isMemoriesMatchMemoryScene,
  parseMemoriesMatchMemoryIndex,
  type MemoriesSceneId,
} from "@/features/experience/scene-engine/memories/graph";
import { MemoriesSceneHost } from "@/features/experience/scene-engine/memories/memories-scene-host";
import { MomentsSceneHost } from "@/features/experience/scene-engine/moments/moments-scene-host";
import {
  TREASURES_STATIC_SCENE_IDS,
  isTreasuresGiftContentScene,
  parseTreasuresGiftContentSortOrder,
  type TreasuresSceneId,
} from "@/features/experience/scene-engine/treasures/graph";
import { TreasuresSceneHost } from "@/features/experience/scene-engine/treasures/treasures-scene-host";
import {
  PreviewContextNote,
  PreviewReviewFrame,
} from "@/features/preview/components/preview-review-frame";
import {
  BLOOM_CONNECTION_LAB_EXPERIENCE,
  BLOOM_CONNECTION_LAB_PHOTOS,
  BLOOM_CONNECTION_LAB_QUIZ,
  BLOOM_CONNECTION_LAB_SCORE_RESULT,
} from "@/features/theme-lab/config/bloom-connection-fixtures";
import {
  BLOOM_MEMORIES_LAB_EXPERIENCE,
  BLOOM_MEMORIES_LAB_MATCH,
  BLOOM_MEMORIES_LAB_PHOTOS,
  BLOOM_MEMORIES_LAB_SCORE_RESULT,
} from "@/features/theme-lab/config/bloom-memories-fixtures";
import {
  BLOOM_MOMENTS_LAB_EXPERIENCE,
  BLOOM_MOMENTS_LAB_PHOTOS,
} from "@/features/theme-lab/config/bloom-moments-fixtures";
import {
  BLOOM_TREASURES_LAB_EXPERIENCE,
  BLOOM_TREASURES_LAB_PHOTOS,
} from "@/features/theme-lab/config/bloom-treasures-fixtures";
import { ThemePageAtmosphere } from "@/features/themes/components/theme-page-atmosphere";
import {
  bloomMomentsLabAccentTextOptions,
  bloomMomentsLabTheme,
} from "@/features/themes/config/bloom-moments-lab-theme";
import { themeCompletionArtwork } from "@/features/themes/config/theme-assets";
import {
  themeAccent,
  themeAccentText,
} from "@/features/themes/config/theme-surfaces";

type ModeTab = "moments" | "connection" | "memories" | "treasures";
type SurfaceTab = "recipient" | "preview";

const IMPLEMENTED_MODES: ModeTab[] = [
  "moments",
  "connection",
  "memories",
  "treasures",
];

const CONNECTION_STATIC_SCENE_SET = new Set<string>(
  CONNECTION_STATIC_SCENE_IDS,
);
const MEMORIES_STATIC_SCENE_SET = new Set<string>(MEMORIES_STATIC_SCENE_IDS);
const TREASURES_STATIC_SCENE_SET = new Set<string>(TREASURES_STATIC_SCENE_IDS);

/** Lab-only deep-link: ?connectionScene=connection.celebration-transition */
function parseConnectionLabScene(
  raw: string | null,
): ConnectionSceneId | undefined {
  if (!raw) return undefined;
  if (CONNECTION_STATIC_SCENE_SET.has(raw)) {
    return raw as ConnectionSceneId;
  }
  if (isConnectionQuizQuestionScene(raw as ConnectionSceneId)) {
    return raw as ConnectionSceneId;
  }
  return undefined;
}

/** Lab-only deep-link: ?memoriesScene=memories.match.memory.0 */
function parseMemoriesLabScene(
  raw: string | null,
): MemoriesSceneId | undefined {
  if (!raw) return undefined;
  if (MEMORIES_STATIC_SCENE_SET.has(raw)) {
    return raw as MemoriesSceneId;
  }
  const asScene = raw as MemoriesSceneId;
  if (
    isMemoriesMatchMemoryScene(asScene) &&
    parseMemoriesMatchMemoryIndex(asScene) != null
  ) {
    return asScene;
  }
  return undefined;
}

/** Lab-only deep-link: ?treasuresScene=treasures.gift-content.1 */
function parseTreasuresLabScene(
  raw: string | null,
): TreasuresSceneId | undefined {
  if (!raw) return undefined;
  if (TREASURES_STATIC_SCENE_SET.has(raw)) {
    return raw as TreasuresSceneId;
  }
  const asScene = raw as TreasuresSceneId;
  if (
    isTreasuresGiftContentScene(asScene) &&
    parseTreasuresGiftContentSortOrder(asScene) != null
  ) {
    return asScene;
  }
  return undefined;
}

function withAccentText(theme: Theme, accentText: string): Theme {
  return {
    ...theme,
    presentation: {
      ...theme.presentation,
      accentText,
    },
  };
}

export function BloomThemeLabPage() {
  const searchParams = useSearchParams();
  const connectionJump = parseConnectionLabScene(
    searchParams.get("connectionScene"),
  );
  const memoriesJump = parseMemoriesLabScene(searchParams.get("memoriesScene"));
  const treasuresJump = parseTreasuresLabScene(
    searchParams.get("treasuresScene"),
  );
  const [mode, setMode] = useState<ModeTab>(
    connectionJump
      ? "connection"
      : memoriesJump
        ? "memories"
        : treasuresJump
          ? "treasures"
          : "moments",
  );
  const [surface, setSurface] = useState<SurfaceTab>("recipient");
  const [accentOption, setAccentOption] = useState(0);

  const selectedAccent =
    bloomMomentsLabAccentTextOptions[accentOption] ??
    bloomMomentsLabAccentTextOptions[0];
  const theme = withAccentText(bloomMomentsLabTheme, selectedAccent.className);
  const completionSrc = themeCompletionArtwork(theme);
  const immersiveJourney =
    (mode === "moments" ||
      mode === "connection" ||
      mode === "memories" ||
      mode === "treasures") &&
    surface === "recipient";

  const immersiveModeLabel =
    mode === "connection"
      ? "Connection"
      : mode === "memories"
        ? "Memories"
        : mode === "treasures"
          ? "Treasures"
          : "Moments";

  return (
    <div
      className={cn(
        "bg-background",
        immersiveJourney
          ? "flex h-[100svh] flex-col overflow-hidden"
          : "min-h-screen",
      )}
    >
      <header
        className={cn(
          "z-50 shrink-0 border-b border-border bg-card/95 backdrop-blur-sm",
          immersiveJourney ? "px-3 py-2 sm:px-4" : "px-4 py-4 sm:px-6",
        )}
      >
        <div
          className={cn(
            "mx-auto max-w-5xl",
            immersiveJourney
              ? "flex flex-wrap items-center gap-2"
              : "space-y-3",
          )}
        >
          {!immersiveJourney ? (
            <>
              <p className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Theme Lab · Sprint 12.5
              </p>
              <h1 className="font-serif text-2xl font-semibold text-foreground">
                Bloom Theme Lab
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Moments + Connection + Memories + Treasures locked. Full Bloom
                audit next. Production <span className="font-mono">/e/</span>{" "}
                unchanged.
              </p>
            </>
          ) : (
            <p className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Theme Lab · Bloom {immersiveModeLabel}
            </p>
          )}

          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Experience mode"
          >
            {(
              [
                ["moments", "Moments"],
                ["connection", "Connection"],
                ["memories", "Memories"],
                ["treasures", "Treasures"],
              ] as const
            ).map(([id, label]) => {
              const enabled = IMPLEMENTED_MODES.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={mode === id}
                  disabled={!enabled}
                  onClick={() => {
                    setMode(id);
                    setSurface("recipient");
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium",
                    mode === id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground",
                    !enabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  {label}
                  {id === "moments" && !immersiveJourney ? " · Locked" : ""}
                  {id === "connection" && !immersiveJourney ? " · Locked" : ""}
                  {id === "memories" && !immersiveJourney ? " · Locked" : ""}
                  {id === "treasures" && !immersiveJourney
                    ? " · Scene 0–5"
                    : ""}
                  {!enabled && !immersiveJourney ? " · Not started" : ""}
                </button>
              );
            })}
          </div>

          {mode === "moments" ||
          mode === "connection" ||
          mode === "memories" ||
          mode === "treasures" ? (
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label="Surface"
              >
                {(
                  [
                    ["recipient", "Scene journey"],
                    ["preview", "Preview (static)"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={surface === id}
                    onClick={() => setSurface(id)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium",
                      surface === id
                        ? "border-primary bg-primary/10"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {!immersiveJourney && mode === "moments" ? (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted-foreground">accentText:</span>
                  {bloomMomentsLabAccentTextOptions.map((option, index) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setAccentOption(index)}
                      className={cn(
                        "rounded-md border px-2 py-1",
                        accentOption === index
                          ? "border-primary bg-primary/10"
                          : "border-border",
                        option.className,
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                  <span
                    className={cn(
                      "inline-block h-3 w-3 rounded-full border border-border",
                      themeAccent(theme),
                    )}
                    aria-hidden
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      {surface === "recipient" && mode === "moments" ? (
        <div className="min-h-0 flex-1">
          <MomentsSceneHost
            experience={BLOOM_MOMENTS_LAB_EXPERIENCE}
            photos={BLOOM_MOMENTS_LAB_PHOTOS}
            theme={theme}
            showLabChrome
            className="flex h-full min-h-0 flex-col"
          />
        </div>
      ) : surface === "recipient" && mode === "connection" ? (
        <div className="min-h-0 flex-1">
          <ConnectionSceneHost
            experience={BLOOM_CONNECTION_LAB_EXPERIENCE}
            photos={BLOOM_CONNECTION_LAB_PHOTOS}
            quiz={BLOOM_CONNECTION_LAB_QUIZ}
            scoreResult={BLOOM_CONNECTION_LAB_SCORE_RESULT}
            theme={theme}
            showLabChrome
            initialScene={connectionJump}
            className="flex h-full min-h-0 flex-col"
          />
        </div>
      ) : surface === "recipient" && mode === "memories" ? (
        <div className="min-h-0 flex-1">
          <MemoriesSceneHost
            experience={BLOOM_MEMORIES_LAB_EXPERIENCE}
            photos={BLOOM_MEMORIES_LAB_PHOTOS}
            match={BLOOM_MEMORIES_LAB_MATCH}
            scoreResult={BLOOM_MEMORIES_LAB_SCORE_RESULT}
            theme={theme}
            showLabChrome
            initialScene={memoriesJump}
            className="flex h-full min-h-0 flex-col"
          />
        </div>
      ) : surface === "recipient" && mode === "treasures" ? (
        <div className="min-h-0 flex-1">
          <TreasuresSceneHost
            experience={BLOOM_TREASURES_LAB_EXPERIENCE}
            photos={BLOOM_TREASURES_LAB_PHOTOS}
            theme={theme}
            showLabChrome
            initialScene={treasuresJump}
            className="flex h-full min-h-0 flex-col"
          />
        </div>
      ) : mode === "connection" ? (
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <p className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
            Connection Preview (static) is not built yet. Use{" "}
            <span className="font-medium text-foreground">Scene journey</span>{" "}
            for Scene 0–15.
          </p>
        </div>
      ) : mode === "memories" ? (
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <p className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
            Memories Preview (static) is not built yet. Use{" "}
            <span className="font-medium text-foreground">Scene journey</span>{" "}
            for Scenes 0–15.
          </p>
        </div>
      ) : mode === "treasures" ? (
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <p className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
            Treasures Preview (static) is not built yet. Use{" "}
            <span className="font-medium text-foreground">Scene journey</span>{" "}
            for Scenes 0–13.
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <ThemePageAtmosphere theme={theme} surface="preview">
            <PreviewReviewFrame
              receiverName={BLOOM_MOMENTS_LAB_EXPERIENCE.greeting_name}
            >
              <PreviewContextNote>
                Static preview surface — Scene Engine runs under “Scene
                journey”.
              </PreviewContextNote>
              <LetterView
                experience={BLOOM_MOMENTS_LAB_EXPERIENCE}
                theme={theme}
              />
              <PhotoGallery
                photos={BLOOM_MOMENTS_LAB_PHOTOS}
                theme={theme}
                tone="preview"
              />
              {completionSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={completionSrc}
                  alt=""
                  className="mx-auto max-h-28 w-full max-w-sm object-contain opacity-80"
                  loading="lazy"
                />
              ) : null}
              <p className={cn("text-center text-xs", themeAccentText(theme))}>
                Photobooth remains the terminal scene in the live journey.
              </p>
            </PreviewReviewFrame>
          </ThemePageAtmosphere>
        </div>
      )}
    </div>
  );
}
