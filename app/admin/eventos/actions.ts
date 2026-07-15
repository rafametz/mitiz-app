"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-guard";

function parseEvent(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const event_date = String(formData.get("event_date") ?? "");
  const location = String(formData.get("location") ?? "").trim() || null;
  const is_active = formData.get("is_active") === "on";
  if (!title) throw new Error("Título é obrigatório");
  if (!event_date) throw new Error("Data é obrigatória");
  return { title, description, event_date, location, is_active };
}

export async function createEvent(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("events").insert(parseEvent(formData));
  revalidatePath("/admin/eventos");
  redirect("/admin/eventos");
}

export async function updateEvent(eventId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("events").update(parseEvent(formData)).eq("id", eventId);
  revalidatePath("/admin/eventos");
  redirect("/admin/eventos");
}

export async function deleteEvent(eventId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("events").delete().eq("id", eventId);
  revalidatePath("/admin/eventos");
}
