"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { slugify } from "@/lib/slugify";
import { deleteStorageImage } from "@/lib/supabase/storage-helpers";

function parseProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category_id = String(formData.get("category_id") ?? "") || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const unit_type = String(formData.get("unit_type") ?? "kg");
  const price_per_unit = Number(formData.get("price_per_unit") ?? 0);
  const gramsPerUnitRaw = String(formData.get("grams_per_unit") ?? "").trim();
  const grams_per_unit = gramsPerUnitRaw ? Number(gramsPerUnitRaw) : null;
  const product_code = String(formData.get("product_code") ?? "").trim() || null;
  const ncm = String(formData.get("ncm") ?? "").trim() || null;
  const brand = String(formData.get("brand") ?? "").trim() || null;
  const image_url = String(formData.get("image_url") ?? "").trim() || null;
  const is_active = formData.get("is_active") === "on";
  const is_featured = formData.get("is_featured") === "on";

  if (!name) throw new Error("Nome é obrigatório");

  return {
    name,
    category_id,
    description,
    unit_type,
    price_per_unit,
    grams_per_unit,
    product_code,
    ncm,
    brand,
    image_url,
    is_active,
    is_featured,
  };
}

export async function createProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const product = parseProduct(formData);

  await supabase.from("products").insert({
    ...product,
    slug: slugify(product.name),
  });

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function updateProduct(productId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const product = parseProduct(formData);

  await supabase
    .from("products")
    .update({ ...product, updated_at: new Date().toISOString() })
    .eq("id", productId);

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function deleteProduct(productId: string) {
  const { supabase } = await requireAdmin();
  const { data: product } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", productId)
    .maybeSingle();

  await supabase.from("products").delete().eq("id", productId);
  await deleteStorageImage(supabase, product?.image_url);
  revalidatePath("/admin/produtos");
}
