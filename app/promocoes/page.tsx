import { createClient } from "@/lib/supabase/server";
import { PromotionCard } from "@/components/PromotionCard";
import { isPromotionActive } from "@/lib/promotions";
import type { Promotion } from "@/lib/types";

export default async function PromocoesPage() {
  const supabase = await createClient();
  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .order("starts_at", { ascending: false })
    .returns<Promotion[]>();

  const activePromotions = (promotions ?? []).filter(isPromotionActive);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Promoções</h1>
      {activePromotions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {activePromotions.map((p) => (
            <PromotionCard key={p.id} promotion={p} />
          ))}
        </div>
      ) : (
        <p className="text-cinza-ferro">Nenhuma promoção ativa no momento.</p>
      )}
    </div>
  );
}
