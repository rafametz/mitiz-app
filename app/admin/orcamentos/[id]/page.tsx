import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatBRL, formatDate } from "@/lib/format";
import { updateOrderStatus, awardPoints } from "../actions";
import type { Order, OrderItemRow } from "@/lib/types";

const STATUSES = ["novo", "em_analise", "confirmado", "entregue", "cancelado"];

export default async function AdminOrcamentoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(id, order_id, product_id, quantity, unit_price_snapshot, subtotal, products(name))")
    .eq("id", id)
    .maybeSingle<Order & { order_items: OrderItemRow[] }>();

  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-preto-wagyu">
        Orçamento de {order.customer_name}
      </h1>
      <p className="mb-6 text-cinza-ferro">
        {formatDate(order.created_at)} · {order.customer_phone}
      </p>

      <ul className="mb-6 flex flex-col gap-1">
        {order.order_items.map((item) => (
          <li key={item.id} className="text-preto-wagyu">
            {item.quantity}x {item.products?.name ?? "Produto"} — {formatBRL(item.subtotal)}
          </li>
        ))}
      </ul>
      <p className="mb-6 text-right font-bold text-vinho-defumado">
        Total: {formatBRL(order.total_estimated)}
      </p>

      {order.notes && (
        <p className="mb-6 rounded border border-cinza-osso p-3 text-sm text-preto-wagyu">
          Observações: {order.notes}
        </p>
      )}

      <form action={updateOrderStatus.bind(null, order.id)} className="mb-8 flex items-end gap-3">
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Status
          <select
            name="status"
            defaultValue={order.status}
            className="rounded border border-cinza-osso px-3 py-2"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button className="rounded-full bg-preto-wagyu px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-cinza-ferro">
          Atualizar status
        </button>
      </form>

      {order.customer_id ? (
        <div>
          <h2 className="mb-3 text-lg font-bold text-preto-wagyu">Lançar pontos</h2>
          <form
            action={awardPoints.bind(null, order.customer_id, order.id)}
            className="flex flex-wrap items-end gap-3"
          >
            <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
              Pontos
              <input
                type="number"
                name="points"
                required
                className="w-28 rounded border border-cinza-osso px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
              Descrição
              <input
                name="description"
                defaultValue="Pontos do orçamento"
                className="rounded border border-cinza-osso px-3 py-2"
              />
            </label>
            <button className="rounded-full bg-vermelho-brasa px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-sangue-nobre">
              Lançar
            </button>
          </form>
        </div>
      ) : (
        <p className="text-sm text-cinza-ferro">
          Este orçamento foi feito por um visitante sem conta — não é possível lançar pontos.
        </p>
      )}
    </div>
  );
}
