import type { SupabaseClient } from "@supabase/supabase-js";

const STORAGE_PREFIX = "/storage/v1/object/public/images/";

export async function deleteStorageImage(
  supabase: SupabaseClient,
  imageUrl: string | null | undefined,
) {
  if (!imageUrl) return;
  const idx = imageUrl.indexOf(STORAGE_PREFIX);
  if (idx === -1) return;
  const path = imageUrl.slice(idx + STORAGE_PREFIX.length);
  await supabase.storage.from("images").remove([path]);
}
