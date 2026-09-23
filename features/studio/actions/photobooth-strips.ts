"use server";

import { validateActionInput, withAdminAction } from "@/lib/actions";
import { auditLogger } from "@/lib/logger";
import { StorageBucket, createSignedReadUrl } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types/api";
import type {
  ExperiencePhotoboothStripRow,
  ExperienceRow,
} from "@/types/database";

import { deletePhotoboothStrip } from "@/features/studio/services/delete-photobooth-strip.service";
import { setPhotoboothStripSource } from "@/features/studio/services/set-photobooth-strip-source.service";
import { uploadPhotoboothStrip } from "@/features/studio/services/upload-photobooth-strip.service";
import {
  deletePhotoboothStripSchema,
  setPhotoboothStripSourceSchema,
  uploadPhotoboothStripSchema,
  validatePhotoboothStripFile,
} from "@/schemas/studio-photobooth-strips";

export async function uploadPhotoboothStripAction(
  formData: FormData,
): Promise<
  ActionResult<{ strip: ExperiencePhotoboothStripRow; previewUrl: string }>
> {
  return withAdminAction(async () => {
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new Error("Strip PNG is required.");
    }

    validatePhotoboothStripFile(file);

    const input = validateActionInput(uploadPhotoboothStripSchema, {
      orderId: formData.get("orderId"),
      experienceId: formData.get("experienceId"),
      sortOrder: Number(formData.get("sortOrder")),
      layoutId: formData.get("layoutId"),
    });

    const supabase = await createClient();
    const buffer = await file.arrayBuffer();
    const strip = await uploadPhotoboothStrip(
      supabase,
      input,
      buffer,
      file.type,
    );

    const previewUrl = await createSignedReadUrl(
      supabase,
      StorageBucket.PHOTOBOOTH_STRIPS,
      strip.storage_path,
    );

    auditLogger.info("Photobooth strip uploaded", {
      experienceId: input.experienceId,
      sortOrder: input.sortOrder,
      stripId: strip.id,
    });

    return { strip, previewUrl };
  });
}

export async function deletePhotoboothStripAction(
  input: unknown,
): Promise<ActionResult<{ stripId: string }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(deletePhotoboothStripSchema, input);
    const supabase = await createClient();
    const deleted = await deletePhotoboothStrip(supabase, data);

    auditLogger.info("Photobooth strip deleted", {
      experienceId: data.experienceId,
      stripId: deleted.id,
    });

    return { stripId: deleted.id };
  });
}

export async function setPhotoboothStripSourceAction(
  input: unknown,
): Promise<ActionResult<{ experience: ExperienceRow }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(setPhotoboothStripSourceSchema, input);
    const supabase = await createClient();
    const experience = await setPhotoboothStripSource(supabase, data);

    auditLogger.info("Photobooth strip source updated", {
      experienceId: data.experienceId,
      source: data.source,
    });

    return { experience };
  });
}
