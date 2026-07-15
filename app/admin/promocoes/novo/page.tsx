import { createClient } from "@/lib/supabase/server";
import { PromotionForm } from "@/components/admin/PromotionForm";
import { createPromotion } from "../actions";
import type { Product } from "@/lib/types";

export default async function NovaPromocaoPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("name")
    .returns<Product[]>();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Nova promoção</h1>
      <PromotionForm products={products ?? []} action={createPromotion} />
    </div>
  );
}
