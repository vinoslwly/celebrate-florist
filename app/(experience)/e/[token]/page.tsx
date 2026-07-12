import { notFound, redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";

import {
  evaluateAccessGate,
  getAccessRequestContext,
} from "@/features/access/services/access-gate.service";
import { recordAnalyticsEvent } from "@/features/analytics/services/record-analytics.service";
import { MemoryCodeGate } from "@/features/experience/components/memory-code-gate";
import {
  isLiveRecipientMode,
  RecipientExperienceView,
} from "@/features/experience/config/mode-registry";
import { fetchPublishedExperience } from "@/features/experience/services/fetch-published-experience.service";
import { recordFirstOpened } from "@/features/experience/services/record-first-open.service";
import { fetchRecipientQuiz } from "@/features/quiz/services/fetch-recipient-quiz.service";

export const metadata = {
  title: "Your gift — Celebrate Florist",
  description: "A private memory experience",
};

type ExperiencePageProps = {
  params: Promise<{ token: string }>;
};

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { token } = await params;
  const admin = createAdminClient();
  const context = await getAccessRequestContext();

  let gate;
  try {
    gate = await evaluateAccessGate(admin, token, context);
  } catch {
    notFound();
  }

  if (gate.status === "memory_code_required") {
    return <MemoryCodeGate experienceToken={token} />;
  }

  if (gate.status === "trust_cookie_required") {
    redirect(`/e/${token}/trust`);
  }

  await recordFirstOpened(gate.experience.id);

  await recordAnalyticsEvent({
    experienceId: gate.experience.id,
    eventType: "experience_opened",
  });

  const payload = await fetchPublishedExperience(gate.experience.id);
  const mode = gate.experience.experience_mode;

  const quiz =
    mode === "connection"
      ? await fetchRecipientQuiz(gate.experience.id)
      : undefined;

  if (!isLiveRecipientMode(mode)) {
    return (
      <RecipientExperienceView
        mode={mode}
        payload={payload}
        experienceToken={token}
      />
    );
  }

  return (
    <RecipientExperienceView
      mode={mode}
      payload={payload}
      experienceToken={token}
      quiz={quiz}
    />
  );
}
