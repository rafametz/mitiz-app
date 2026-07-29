import type { Promotion } from "@/lib/types";

type PromotionStatus = Pick<Promotion, "is_active" | "starts_at" | "ends_at">;

export function isPromotionActive(promo: PromotionStatus) {
  if (!promo.is_active) return false;
  const now = Date.now();
  if (promo.starts_at && new Date(promo.starts_at).getTime() > now) return false;
  if (promo.ends_at && new Date(promo.ends_at).getTime() < now) return false;
  return true;
}

export function computeDiscountedPrice(
  price: number,
  promo: Pick<Promotion, "discount_type" | "discount_value">,
) {
  const discounted =
    promo.discount_type === "percent"
      ? price * (1 - promo.discount_value / 100)
      : price - promo.discount_value;
  return Math.max(0, discounted);
}

/** Monta um mapa product_id -> promocao ativa, a partir de uma lista de promocoes. */
export function buildActivePromotionMap(promotions: Promotion[]) {
  const map = new Map<string, Promotion>();
  for (const promo of promotions) {
    if (promo.product_id && isPromotionActive(promo)) {
      map.set(promo.product_id, promo);
    }
  }
  return map;
}
