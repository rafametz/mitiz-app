import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatBRL, formatDate } from "@/lib/format";
import { awardPoints } from "../../orcamentos/actions";
import type { Order, OrderItemRow, PointsTransaction, Profile } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  novo: "Novo",
  em_analise: "Em análise",
  confirmado: "Confirmado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export default async function AdminClienteDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: profile }, { data: orders }, { data: pointsHistory }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).maybeSingle<Profile>(),
    supabase
      .from("orders")
      .select("*, order_items(id, order_id, product_id, quantity, unit_price_snapshot, subtotal, products(name))")
      .eq("customer_id", id)
      .order("created_at", { ascending: false })
      .returns<(Order & { order_items: OrderItemRow[] })[]>(),
    supabase
      .from("points_transactions")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", { ascending: false })
      .returns<PointsTransaction[]>(),
  ]);

  if (!profile) notFound();

  const productTotals = new Map<string, { quantity: number; pedidos: number }>();
  for (const order of orders ?? []) {
    for (const item of order.order_items) {
      const name = item.products?.name ?? "Produto removido";
      const current = productTotals.get(name) ?? { quantity: 0, pedidos: 0 };
      current.quantity += item.quantity;
      current.pedidos += 1;
      productTotals.set(name, current);
    }
  }
  const topProducts = Array.from(productTotals.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.quantity - a.quantity);

  return (
    <div className="max-w-3xl">
      <Link href="/admin/clientes" className="mb-4 inline-block text-sm text-vinho-defumado hover:underline">
        ← Voltar para clientes
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-preto-wagyu">{profile.name ?? "Sem nome"}</h1>
          <p className="text-sm text-cinza-ferro">{profile.email ?? "Sem e-mail"}</p>
          <p className="text-sm text-cinza-ferro">{profile.phone ?? "Sem telefone"}</p>
          <p className="text-xs text-cinza-ferro">Cliente desde {formatDate(profile.created_at)}</p>
        </div>
        <div className="rounded-lg bg-preto-wagyu px-5 py-3 text-center text-branco-sal">
          <p className="eyebrow text-cinza-osso">Pontos</p>
          <p className="text-2xl font-bold">{profile.points_balance}</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-preto-wagyu">Produtos mais pedidos</h2>
        {topProducts.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {topProducts.map((p) => (
              <li
                key={p.name}
                className="flex items-center justify-between rounded border border-cinza-osso bg-marmoreio px-3 py-2 text-sm"
              >
                <span className="text-preto-wagyu">{p.name}</span>
                <span className="text-cinza-ferro">
                  {p.quantity.toFixed(2)} un/kg total · {p.pedidos} pedido{p.pedidos > 1 ? "s" : ""}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-cinza-ferro">Nenhum pedido registrado ainda.</p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-preto-wagyu">Ajustar pontos</h2>
        <form
          action={awardPoints.bind(null, profile.id, null)}
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
            Motivo
            <input
              name="description"
              defaultValue="Ajuste manual"
              className="rounded border border-cinza-osso px-3 py-2"
            />
          </label>
          <button className="rounded-full bg-vermelho-brasa px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-sangue-nobre">
            Aplicar
          </button>
        </form>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-preto-wagyu">Orçamentos</h2>
        {orders && orders.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {orders.map((order) => (
              <li key={order.id} className="rounded-lg border border-cinza-osso p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-cinza-ferro">{formatDate(order.created_at)}</span>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-marmoreio px-3 py-1 text-xs font-semibold text-preto-wagyu">
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <Link
                      href={`/admin/orcamentos/${order.id}`}
                      className="text-sm text-vinho-defumado hover:underline"
                    >
                      Gerenciar
                    </Link>
                  </div>
                </div>
                <ul className="mb-2 flex flex-col gap-1 text-sm text-preto-wagyu">
                  {order.order_items.map((item) => (
                    <li key={item.id}>
                      {item.quantity}x {item.products?.name ?? "Produto"} — {formatBRL(item.subtotal)}
                    </li>
                  ))}
                </ul>
                <p className="text-right font-bold text-vinho-defumado">
                  Total: {formatBRL(order.total_estimated)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-cinza-ferro">Nenhum orçamento registrado ainda.</p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-preto-wagyu">Histórico de pontos</h2>
        {pointsHistory && pointsHistory.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {pointsHistory.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded border border-cinza-osso px-4 py-2 text-sm"
              >
                <div>
                  <p className="text-preto-wagyu">{p.description || "Ajuste"}</p>
                  <p className="text-xs text-cinza-ferro">{formatDate(p.created_at)}</p>
                </div>
                <span className={`font-bold ${p.points >= 0 ? "text-vinho-defumado" : "text-cinza-ferro"}`}>
                  {p.points >= 0 ? "+" : ""}
                  {p.points}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-cinza-ferro">Nenhum ponto lançado ainda.</p>
        )}
      </section>
    </div>
  );
}
