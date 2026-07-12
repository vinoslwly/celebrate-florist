"use server";

import { validateActionInput, withAdminAction } from "@/lib/actions";
import { auditLogger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types/api";
import type { ExperiencePhotoRow } from "@/types/database";

import { deleteExperiencePhoto } from "@/features/studio/services/delete-experience-photo.service";
import { uploadExperiencePhoto } from "@/features/studio/services/upload-experience-photo.service";
import {
  deleteExperiencePhotoSchema,
  uploadExperiencePhotoSchema,
  validatePhotoFile,
} from "@/schemas/studio-photos";

export async function uploadExperiencePhotoAction(
  formData: FormData,
): Promise<ActionResult<{ photo: ExperiencePhotoRow }>> {
  return withAdminAction(async () => {
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new Error("Photo file is required.");
    }

    validatePhotoFile(file);

    const input = validateActionInput(uploadExperiencePhotoSchema, {
      orderId: formData.get("orderId"),
      experienceId: formData.get("experienceId"),
      sortOrder: Number(formData.get("sortOrder")),
    });

    const supabase = await createClient();
    const buffer = await file.arrayBuffer();
    const photo = await uploadExperiencePhoto(
      supabase,
      input,
      buffer,
      file.type,
    );

    auditLogger.info("Experience photo uploaded", {
      experienceId: input.experienceId,
      sortOrder: input.sortOrder,
      photoId: photo.id,
    });

    return { photo };
  });
}

export async function deleteExperiencePhotoAction(
  input: unknown,
): Promise<ActionResult<{ photoId: string }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(deleteExperiencePhotoSchema, input);
    const supabase = await createClient();
    const deleted = await deleteExperiencePhoto(supabase, data);

    auditLogger.info("Experience photo deleted", {
      experienceId: data.experienceId,
      photoId: deleted.id,
    });

    return { photoId: deleted.id };
  });
}
