import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PromotionForm } from "@/components/admin/PromotionForm";
import { updatePromotion } from "../actions";
import type { Product, Promotion } from "@/lib/types";

export default async function EditarPromocaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: promotion }, { data: products }] = await Promise.all([
    supabase.from("promotions").select("*").eq("id", id).maybeSingle<Promotion>(),
    supabase.from("products").select("*").order("name").returns<Product[]>(),
  ]);

  if (!promotion) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Editar promoção</h1>
      <PromotionForm
        promotion={promotion}
        products={products ?? []}
        action={updatePromotion.bind(null, id)}
      />
    </div>
  );
}
