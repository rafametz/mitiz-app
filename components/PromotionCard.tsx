import type { Promotion } from "@/lib/types";

export function PromotionCard({ promotion }: { promotion: Promotion }) {
  const desconto =
    promotion.discount_type === "percent"
      ? `${promotion.discount_value}% OFF`
      : `${promotion.discount_value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })} OFF`;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-cinza-osso bg-marmoreio">
      <div className="aspect-video w-full bg-cinza-osso">
        {promotion.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={promotion.image_url}
            alt={promotion.title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <span className="price-tag w-fit rounded-sm bg-vermelho-brasa px-2.5 py-1 text-xs text-branco-sal">
          {desconto}
        </span>
        <h3 className="font-semibold text-preto-wagyu">{promotion.title}</h3>
        {promotion.description && (
          <p className="text-sm text-cinza-ferro">{promotion.description}</p>
        )}
      </div>
    </div>
  );
}
