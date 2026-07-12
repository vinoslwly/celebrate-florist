import type {
  ExperiencePhotoRow,
  ExperienceRow,
  OrderRow,
  ThemeRow,
} from "@/types/database";

import type { PreviewQuizView } from "@/features/quiz/types";

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
};
