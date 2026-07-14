import { notFound, redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";

import {
  evaluateAccessGate,
  getAccessRequestContext,
} from "@/features/access/services/access-gate.service";
import { recordAnalyticsEvent } from "@/features/analytics/services/record-analytics.service";
import { MemoryCodeGate } from "@/features/experience/components/memory-code-gate";
import { RecipientModeUnavailable } from "@/features/experience/components/recipient-mode-unavailable";
import {
  isLiveRecipientMode,
  RecipientExperienceView,
} from "@/features/experience/config/mode-registry";
import { fetchConnectionGatePayload } from "@/features/experience/services/fetch-connection-gate-payload.service";
import { fetchMemoriesGatePayload } from "@/features/experience/services/fetch-memories-gate-payload.service";
import { fetchPublishedExperience } from "@/features/experience/services/fetch-published-experience.service";
import { fetchTreasuresGatePayload } from "@/features/experience/services/fetch-treasures-gate-payload.service";
import { recordFirstOpened } from "@/features/experience/services/record-first-open.service";
import { fetchTreasuresReward } from "@/features/treasures/services/fetch-treasures-reward.service";

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

  const mode = gate.experience.experience_mode;

  if (mode === "connection" && isLiveRecipientMode(mode)) {
    const connectionGate = await fetchConnectionGatePayload(gate.experience.id);

    return (
      <RecipientExperienceView
        mode="connection"
        connectionGate={connectionGate}
        experienceToken={token}
      />
    );
  }

  if (mode === "memories" && isLiveRecipientMode(mode)) {
    const memoriesGate = await fetchMemoriesGatePayload(gate.experience.id);

    return (
      <RecipientExperienceView
        mode="memories"
        memoriesGate={memoriesGate}
        experienceToken={token}
      />
    );
  }

  if (mode === "treasures" && isLiveRecipientMode(mode)) {
    const treasuresGate = await fetchTreasuresGatePayload(gate.experience.id);
    const initialReward = treasuresGate.envelopes.rewardEligible
      ? await fetchTreasuresReward(admin, token, context)
      : null;

    return (
      <RecipientExperienceView
        mode="treasures"
        treasuresGate={treasuresGate}
        experienceToken={token}
        initialReward={initialReward}
      />
    );
  }

  if (!isLiveRecipientMode(mode)) {
    return <RecipientModeUnavailable mode={mode} />;
  }

  const payload = await fetchPublishedExperience(gate.experience.id);

  return (
    <RecipientExperienceView
      mode="moments"
      payload={payload}
      experienceToken={token}
    />
  );
}
