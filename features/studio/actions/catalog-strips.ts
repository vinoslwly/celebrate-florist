"use server";

import { revalidatePath } from "next/cache";

import { validateActionInput, withAdminAction } from "@/lib/actions";
import { auditLogger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

import type { ActionResult } from "@/types/api";

import { deleteCatalogStrip } from "@/features/studio/services/delete-catalog-strip.service";
import type { CatalogStripWithUrl } from "@/features/studio/services/list-catalog-strips.service";
import { renameCatalogStrip } from "@/features/studio/services/rename-catalog-strip.service";
import { uploadCatalogStrip } from "@/features/studio/services/upload-catalog-strip.service";
import {
  deleteCatalogStripSchema,
  renameCatalogStripSchema,
  validateCatalogStripFile,
} from "@/schemas/studio-catalog-strips";

export async function uploadCatalogStripAction(
  formData: FormData,
): Promise<ActionResult<{ strip: CatalogStripWithUrl }>> {
  return withAdminAction(async () => {
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new Error("Strip PNG is required.");
    }

    validateCatalogStripFile(file);

    const rawName = formData.get("displayName");
    const displayName =
      typeof rawName === "string" && rawName.trim()
        ? rawName.trim()
        : file.name.replace(/\.png$/i, "") || "Strip";

    const supabase = await createClient();
    const buffer = await file.arrayBuffer();
    const strip = await uploadCatalogStrip(
      supabase,
      buffer,
      file.type,
      displayName,
    );

    revalidatePath("/studio/strips");
    revalidatePath("/studio/orders");

    auditLogger.info("Catalog photobooth strip uploaded", {
      stripId: strip.id,
    });
    return { strip };
  });
}

export async function renameCatalogStripAction(
  input: unknown,
): Promise<ActionResult<{ strip: CatalogStripWithUrl }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(renameCatalogStripSchema, input);
    const supabase = await createClient();
    const strip = await renameCatalogStrip(supabase, data);

    revalidatePath("/studio/strips");
    auditLogger.info("Catalog photobooth strip renamed", {
      stripId: strip.id,
    });
    return { strip };
  });
}

export async function deleteCatalogStripAction(
  input: unknown,
): Promise<ActionResult<{ stripId: string }>> {
  return withAdminAction(async () => {
    const data = validateActionInput(deleteCatalogStripSchema, input);
    const supabase = await createClient();
    const deleted = await deleteCatalogStrip(supabase, data);

    revalidatePath("/studio/strips");
    auditLogger.info("Catalog photobooth strip deleted", {
      stripId: deleted.stripId,
    });
    return deleted;
  });
}
