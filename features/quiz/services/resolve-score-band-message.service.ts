import { ValidationError } from "@/lib/errors";

type ScoreBand = {
  minPercent: number;
  maxPercent: number;
  message: string;
};

/**
 * Resolves the message for a graded percentage against configured bands.
 */
export function resolveScoreBandMessage(
  percent: number,
  bands: ScoreBand[],
): string {
  if (percent < 0 || percent > 100) {
    throw new ValidationError("Score percent must be between 0 and 100");
  }

  const band = bands.find(
    (candidate) =>
      percent >= candidate.minPercent && percent <= candidate.maxPercent,
  );

  if (!band) {
    throw new ValidationError("No score band matches this result");
  }

  return band.message;
}
