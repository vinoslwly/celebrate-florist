"use server";

import { revalidatePath } from "next/cache";

import {
  requireAdminUser,
  validateActionInput,
  withAdminAction,
} from "@/lib/actions";
import { auditLogger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types/api";

import type { WebsiteContent } from "@/features/website/config/types";
import { saveWebsiteContent } from "@/features/website/services/save-website-content.service";
import { uploadWebsiteAsset } from "@/features/website/services/upload-website-asset.service";
import {
  validateWebsiteAssetFile,
  websiteAssetKindSchema,
  websiteContentSchema,
} from "@/schemas/studio-website";

export async function saveWebsiteContentAction(
  input: unknown,
): Promise<ActionResult<{ content: WebsiteContent }>> {
  return withAdminAction(async () => {
    const user = await requireAdminUser();
    const data = validateActionInput(websiteContentSchema, input);
    const content = await saveWebsiteContent(data, user.id);

    revalidatePath("/");
    revalidatePath("/studio/settings");

    auditLogger.info("Website settings saved", { userId: user.id });
    return { content };
  });
}

export async function uploadWebsiteAssetAction(
  formData: FormData,
): Promise<ActionResult<{ url: string; kind: string }>> {
  return withAdminAction(async () => {
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new Error("Image file is required.");
    }

    const kind = validateActionInput(
      websiteAssetKindSchema,
      formData.get("kind"),
    );
    validateWebsiteAssetFile(file, kind);

    const supabase = await createClient();
    const buffer = await file.arrayBuffer();
    const uploaded = await uploadWebsiteAsset(
      supabase,
      kind,
      buffer,
      file.type,
    );

    auditLogger.info("Website asset uploaded", { kind, path: uploaded.path });
    return { url: uploaded.url, kind };
  });
}
