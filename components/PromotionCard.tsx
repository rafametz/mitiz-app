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
    <div className="flex flex-col overflow-hidden rounded-lg border border-cinza-osso bg-branco-sal">
      <div className="aspect-video w-full bg-marmoreio">
        {promotion.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={promotion.image_url}
            alt={promotion.title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span className="w-fit rounded-full bg-vermelho-brasa px-3 py-1 text-xs font-bold text-branco-sal">
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
