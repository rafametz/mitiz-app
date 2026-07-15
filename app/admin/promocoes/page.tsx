import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deletePromotion } from "./actions";
import type { Promotion } from "@/lib/types";

export default async function AdminPromocoesPage() {
  const supabase = await createClient();
  const { data: promotions } = await supabase
    .from("promotions")
    .select("*, products(name)")
    .returns<(Promotion & { products: { name: string } | null })[]>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-preto-wagyu">Promoções</h1>
        <Link
          href="/admin/promocoes/novo"
          className="rounded-full bg-vermelho-brasa px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-sangue-nobre"
        >
          Nova promoção
        </Link>
      </div>

      <ul className="flex flex-col gap-2">
        {promotions?.map((promo) => (
          <li
            key={promo.id}
            className="flex items-center justify-between rounded border border-cinza-osso p-3"
          >
            <div>
              <p className="font-semibold text-preto-wagyu">{promo.title}</p>
              <p className="text-sm text-cinza-ferro">
                {promo.products?.name ?? "Sem produto específico"} —{" "}
                {promo.discount_type === "percent"
                  ? `${promo.discount_value}%`
                  : `R$ ${promo.discount_value}`}{" "}
                OFF · {promo.is_active ? "Ativa" : "Inativa"}
              </p>
            </div>
            <div>
              <Link
                href={`/admin/promocoes/${promo.id}`}
                className="mr-3 text-vinho-defumado hover:underline"
              >
                Editar
              </Link>
              <form action={deletePromotion.bind(null, promo.id)} className="inline">
                <button className="text-vermelho-brasa hover:underline">Excluir</button>
              </form>
            </div>
          </li>
        ))}
        {(!promotions || promotions.length === 0) && (
          <p className="text-cinza-ferro">Nenhuma promoção cadastrada ainda.</p>
        )}
      </ul>
    </div>
  );
}
