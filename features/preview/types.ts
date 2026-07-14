import type {
  ExperiencePhotoRow,
  ExperienceRow,
  OrderRow,
  ThemeRow,
} from "@/types/database";

import type { PreviewMatchView } from "@/features/match/types";
import type { PreviewQuizView } from "@/features/quiz/types";
import type { PreviewEnvelopeView } from "@/features/treasures/types";

export type BuyerPreviewPhoto = ExperiencePhotoRow & {
  signedUrl: string;
};

export type BuyerPreviewPayload = {
  order: OrderRow;
  experience: ExperienceRow;
  theme: ThemeRow;
  photos: BuyerPreviewPhoto[];
  previewToken: string;
  quiz?: PreviewQuizView;
  match?: PreviewMatchView;
  envelopes?: PreviewEnvelopeView;
};
