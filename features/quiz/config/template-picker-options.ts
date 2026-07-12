import type { QuizTemplateId } from "@/features/quiz/types";

export type QuizTemplatePickerOption = {
  id: QuizTemplateId;
  label: string;
  description: string;
};

/** Display metadata for the template picker — content lives server-side. */
export const QUIZ_TEMPLATE_PICKER_OPTIONS: QuizTemplatePickerOption[] = [
  {
    id: "anniversary",
    label: "Anniversary",
    description: "Couples milestone",
  },
  {
    id: "graduation",
    label: "Graduation",
    description: "Celebration achievement",
  },
  {
    id: "birthday",
    label: "Birthday",
    description: "Personal celebration",
  },
  {
    id: "proposal",
    label: "Proposal",
    description: "Romantic escalation",
  },
];
