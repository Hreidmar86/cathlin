import { useState } from "react";
import { STORAGE_BUCKET } from "../lib/config";
import { slugify } from "../lib/format";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { toCatchRow } from "../lib/catches";

function getFileExtension(file) {
  return file?.name?.split(".").pop()?.toLowerCase() || "jpg";
}

function extractStoragePath(url) {
  if (!url) return "";
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return "";
  return url.slice(index + marker.length);
}

async function uploadCatchPhoto(file, species) {
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
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}

export function useCatchMutations({ user, onChanged }) {
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  async function createCatch({ values, photoFile }) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase är inte konfigurerat.");
    }

    setSaving(true);
    try {
      let photoUrl = "";
      if (photoFile) {
        const upload = await uploadCatchPhoto(photoFile, values.species);
        photoUrl = upload.publicUrl;
      }

      const payload = toCatchRow(values, photoUrl, user?.id);
      const { error } = await supabase.from("catches").insert(payload);
      if (error) throw error;
      await onChanged?.();
    } finally {
      setSaving(false);
    }
  }

  async function updateCatch(existingCatch, { values, photoFile, removePhoto }) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase är inte konfigurerat.");
    }

    setSaving(true);
    try {
      let photoUrl = existingCatch.photoUrl || "";

      if (photoFile) {
        const upload = await uploadCatchPhoto(photoFile, values.species);
        photoUrl = upload.publicUrl;
        if (existingCatch.photoUrl) {
          await deleteStorageObject(existingCatch.photoUrl);
        }
      } else if (removePhoto) {
        if (existingCatch.photoUrl) {
          await deleteStorageObject(existingCatch.photoUrl);
        }
        photoUrl = "";
      }

      const payload = toCatchRow(values, photoUrl);
      const { error } = await supabase.from("catches").update(payload).eq("id", existingCatch.id);
      if (error) throw error;
      await onChanged?.();
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
      if (catchItem.photoUrl) {
        await deleteStorageObject(catchItem.photoUrl);
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
