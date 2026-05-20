import { useState } from "react";
import { STORAGE_BUCKET } from "../lib/config";
import { slugify } from "../lib/format";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { toInsertCatchRow, toUpdateCatchRow } from "../lib/catches";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function getFileExtension(file) {
  return file?.name?.split(".").pop()?.toLowerCase() || "jpg";
}

function validateUploadFile(file) {
  if (!file) return;
  if (!file.type?.startsWith("image/")) {
    throw new Error("Bilden måste vara en giltig bildfil.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Bilden är för stor. Maxstorlek är 10 MB.");
  }
}

function extractStoragePath(url) {
  if (!url) return "";
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return "";
  return url.slice(index + marker.length);
}

async function uploadCatchPhoto(file, species) {
  validateUploadFile(file);

  const extension = getFileExtension(file);
  const path = `catches/${Date.now()}-${slugify(species || "catch")}.${extension}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) throw error;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

async function deleteStorageObject(publicUrl) {
  const path = extractStoragePath(publicUrl);
  if (!path) return;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) throw error;
}

export function useCatchMutations({ user, onChanged }) {
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  async function createCatch({ values, photoFile }) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase är inte konfigurerat.");
    }

    setSaving(true);
    let uploadedUrl = "";
    try {
      let imageUrl = "";
      if (photoFile) {
        const upload = await uploadCatchPhoto(photoFile, values.species);
        imageUrl = upload.publicUrl;
        uploadedUrl = upload.publicUrl;
      }

      const createdBy = user?.id || undefined;
      const payload = toInsertCatchRow(values, imageUrl, createdBy);

      if (import.meta.env.DEV) {
        console.log("Creating catch payload:", payload);
        console.log("Creating catch as user:", user?.email || "unknown");
      }

      const { error } = await supabase.from("catches").insert(payload);
      if (error) throw error;
      await onChanged?.();
    } catch (error) {
      if (uploadedUrl) {
        try {
          await deleteStorageObject(uploadedUrl);
        } catch (storageError) {
          if (import.meta.env.DEV) {
            console.error("Failed to clean up uploaded image after create error:", storageError);
          }
        }
      }
      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function updateCatch(existingCatch, { values, photoFile, removePhoto }) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase är inte konfigurerat.");
    }

    setSaving(true);
    let uploadedUrl = "";

    try {
      let imageUrl = existingCatch.imageUrl || "";

      if (photoFile) {
        const upload = await uploadCatchPhoto(photoFile, values.species);
        imageUrl = upload.publicUrl;
        uploadedUrl = upload.publicUrl;
      } else if (removePhoto) {
        imageUrl = "";
      }

      const payload = toUpdateCatchRow(values, imageUrl);
      const { error } = await supabase.from("catches").update(payload).eq("id", existingCatch.id);
      if (error) throw error;

      if ((photoFile || removePhoto) && existingCatch.imageUrl) {
        try {
          await deleteStorageObject(existingCatch.imageUrl);
        } catch (storageError) {
          if (import.meta.env.DEV) {
            console.error("Failed to delete previous storage object after update:", storageError);
          }
        }
      }

      await onChanged?.();
    } catch (error) {
      if (uploadedUrl) {
        try {
          await deleteStorageObject(uploadedUrl);
        } catch (storageError) {
          if (import.meta.env.DEV) {
            console.error("Failed to clean up uploaded image after update error:", storageError);
          }
        }
      }
      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function deleteCatch(catchItem) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase är inte konfigurerat.");
    }

    setDeletingId(catchItem.id);
    try {
      const { error } = await supabase.from("catches").delete().eq("id", catchItem.id);
      if (error) throw error;

      if (catchItem.imageUrl) {
        try {
          await deleteStorageObject(catchItem.imageUrl);
        } catch (storageError) {
          if (import.meta.env.DEV) {
            console.error("Failed to delete storage object after catch delete:", storageError);
          }
        }
      }

      await onChanged?.();
    } finally {
      setDeletingId("");
    }
  }

  return {
    createCatch,
    updateCatch,
    deleteCatch,
    saving,
    deletingId
  };
}
