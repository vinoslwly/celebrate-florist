import { ValidationError } from "@/lib/errors";

import { anniversaryTemplate } from "@/features/quiz/config/templates/anniversary";
import { birthdayTemplate } from "@/features/quiz/config/templates/birthday";
import { graduationTemplate } from "@/features/quiz/config/templates/graduation";
import { proposalTemplate } from "@/features/quiz/config/templates/proposal";
import type {
  QuizTemplateDefinition,
  QuizTemplateId,
} from "@/features/quiz/types";

const QUIZ_TEMPLATES: Record<QuizTemplateId, QuizTemplateDefinition> = {
  anniversary: anniversaryTemplate,
  graduation: graduationTemplate,
  birthday: birthdayTemplate,
  proposal: proposalTemplate,
};

export const QUIZ_TEMPLATE_IDS = Object.keys(
  QUIZ_TEMPLATES,
) as QuizTemplateId[];

export function getQuizTemplate(
  templateId: QuizTemplateId,
): QuizTemplateDefinition {
  const template = QUIZ_TEMPLATES[templateId];

  if (!template) {
    throw new ValidationError("Unknown quiz template");
  }

  return template;
}

export function listQuizTemplates(): QuizTemplateDefinition[] {
  return QUIZ_TEMPLATE_IDS.map((id) => QUIZ_TEMPLATES[id]);
}
