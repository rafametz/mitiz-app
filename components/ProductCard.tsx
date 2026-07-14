import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatBRL } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/catalogo/${product.slug}`}
      className="flex flex-col overflow-hidden rounded-lg border border-cinza-osso bg-branco-sal transition hover:shadow-md"
    >
      <div className="aspect-square w-full bg-marmoreio">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-cinza-ferro">
            Sem foto
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-semibold text-preto-wagyu">{product.name}</h3>
        <p className="text-sm text-cinza-ferro capitalize">{product.meat_type}</p>
        <p className="mt-auto font-bold text-vinho-defumado">
          {formatBRL(product.price_per_unit)} / {product.unit_type}
        </p>
      </div>
    </Link>
  );
}
