import Link from "next/link";
import type { Product, Promotion } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import { computeDiscountedPrice } from "@/lib/promotions";

export function ProductCard({
  product,
  promotion,
}: {
  product: Product;
  promotion?: Promotion;
}) {
  const discountedPrice = promotion
    ? computeDiscountedPrice(product.price_per_unit, promotion)
    : null;

  return (
    <Link
      href={`/catalogo/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-cinza-osso bg-marmoreio transition hover:shadow-md"
    >
      <div className="aspect-square w-full overflow-hidden bg-cinza-osso">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-cinza-ferro">
            Sem foto
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {product.brand && <p className="eyebrow text-cinza-ferro">{product.brand}</p>}
        <h3 className="font-semibold text-preto-wagyu">{product.name}</h3>
        {discountedPrice !== null ? (
          <div className="mt-auto flex flex-wrap items-center gap-2">
            <span className="text-xs text-cinza-ferro line-through">
              {formatBRL(product.price_per_unit)}
            </span>
            <span className="price-tag rounded-sm bg-vermelho-brasa px-2 py-1 text-sm text-branco-sal">
              {formatBRL(discountedPrice)} / {product.unit_type}
            </span>
          </div>
        ) : (
          <span className="price-tag mt-auto w-fit rounded-sm bg-preto-wagyu px-2 py-1 text-sm text-branco-sal">
            {formatBRL(product.price_per_unit)} / {product.unit_type}
          </span>
        )}
      </div>
    </Link>
  );
}
