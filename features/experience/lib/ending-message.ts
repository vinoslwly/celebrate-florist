export const DEFAULT_ENDING_MESSAGE =
  "Hadiah ini milikmu. Buka lagi kapan saja —\nkenangannya tetap di sini.";

export function resolveEndingMessage(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : DEFAULT_ENDING_MESSAGE;
}
