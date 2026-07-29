import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import { buildActivePromotionMap } from "@/lib/promotions";
import type { Category, Product, Promotion } from "@/lib/types";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
    .returns<Category[]>();

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (categoria) {
    const cat = categories?.find((c) => c.slug === categoria);
    if (cat) query = query.eq("category_id", cat.id);
  }

  const { data: products } = await query.returns<Product[]>();

  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .not("product_id", "is", null)
    .returns<Promotion[]>();
  const promotionMap = buildActivePromotionMap(promotions ?? []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Catálogo</h1>

      {categories && categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/catalogo"
            className={`rounded-full border px-4 py-1 text-sm ${
              !categoria
                ? "border-vermelho-brasa bg-vermelho-brasa text-branco-sal"
                : "border-cinza-osso text-cinza-ferro"
            }`}
          >
            Todos
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/catalogo?categoria=${c.slug}`}
              className={`rounded-full border px-4 py-1 text-sm ${
                categoria === c.slug
                  ? "border-vermelho-brasa bg-vermelho-brasa text-branco-sal"
                  : "border-cinza-osso text-cinza-ferro"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} promotion={promotionMap.get(p.id)} />
          ))}
        </div>
      ) : (
        <p className="text-cinza-ferro">Nenhum produto encontrado.</p>
      )}
    </div>
  );
}
