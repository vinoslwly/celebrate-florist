/**
 * Shared scene root classes — Theme Lab chrome + recipient hosts.
 *
 * Rule: hosts/shells stay overflow-hidden. Only the scene (or one inner pane)
 * owns overflow-y-auto — nested scrollports steal mobile touch.
 *
 * SCROLL: fill the host; allow vertical pan when content overflows (mobile).
 * LOCK: fill the host; clip (short cinematic transitions that must not scroll).
 */
export const SCENE_VIEWPORT_SCROLL =
  "relative flex h-full min-h-0 w-full flex-1 flex-col overflow-x-clip overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch]";

export const SCENE_VIEWPORT_LOCK =
  "relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden";

/** Inner pane when the scene root is LOCK but content must scroll (e.g. letter). */
export const SCENE_SCROLL_PANE =
  "relative z-10 h-0 min-h-0 flex-1 touch-pan-y overflow-x-hidden overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]";
