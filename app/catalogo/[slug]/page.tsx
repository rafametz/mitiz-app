import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddToCartForm } from "@/components/AddToCartForm";
import { formatBRL } from "@/lib/format";
import { computeDiscountedPrice, isPromotionActive } from "@/lib/promotions";
import type { Product, Promotion } from "@/lib/types";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle<Product>();

  if (!product) notFound();

  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .eq("product_id", product.id)
    .eq("is_active", true)
    .returns<Promotion[]>();
  const promotion = (promotions ?? []).find(isPromotionActive);
  const discountedPrice = promotion
    ? computeDiscountedPrice(product.price_per_unit, promotion)
    : null;

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-4 py-8 sm:grid-cols-2">
      <div className="aspect-square w-full rounded-lg bg-marmoreio">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-cinza-ferro">
            Sem foto
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-preto-wagyu">{product.name}</h1>
        {product.brand && (
          <p className="text-sm text-cinza-ferro">{product.brand}</p>
        )}
        {product.description && (
          <p className="text-preto-wagyu">{product.description}</p>
        )}
        {discountedPrice !== null ? (
          <div className="flex items-center gap-3">
            <span className="text-cinza-ferro line-through">
              {formatBRL(product.price_per_unit)}
            </span>
            <span className="text-xl font-bold text-vermelho-brasa">
              {formatBRL(discountedPrice)} / {product.unit_type}
            </span>
          </div>
        ) : (
          <p className="text-xl font-bold text-vinho-defumado">
            {formatBRL(product.price_per_unit)} / {product.unit_type}
          </p>
        )}

        <AddToCartForm product={product} unitPrice={discountedPrice ?? undefined} />
      </div>
    </div>
  );
}
