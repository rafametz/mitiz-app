import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";
import { formatBRL, formatDate } from "@/lib/format";
import type { Order, OrderItemRow, PointsTransaction, Profile } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  novo: "Novo",
  em_analise: "Em análise",
  confirmado: "Confirmado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export default async function MinhaContaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar");
  }

  const [{ data: profile }, { data: orders }, { data: pointsHistory }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle<Profile>(),
      supabase
        .from("orders")
        .select("*, order_items(id, order_id, product_id, quantity, unit_price_snapshot, subtotal, products(name))")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .returns<(Order & { order_items: OrderItemRow[] })[]>(),
      supabase
        .from("points_transactions")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .returns<PointsTransaction[]>(),
    ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-preto-wagyu">
            Olá{profile?.name ? `, ${profile.name}` : ""}!
          </h1>
          <p className="text-cinza-ferro">{user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="mb-8 rounded-lg bg-preto-wagyu p-6 text-center text-branco-sal">
        <p className="text-sm text-cinza-osso">Seu saldo de pontos</p>
        <p className="text-4xl font-bold">{profile?.points_balance ?? 0}</p>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold text-preto-wagyu">
          Histórico de pontos
        </h2>
        {pointsHistory && pointsHistory.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {pointsHistory.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded border border-cinza-osso px-4 py-2 text-sm"
              >
                <div>
                  <p className="text-preto-wagyu">
                    {p.description || (p.type === "ganho" ? "Pontos ganhos" : p.type === "resgate" ? "Resgate" : "Ajuste")}
                  </p>
                  <p className="text-xs text-cinza-ferro">{formatDate(p.created_at)}</p>
                </div>
                <span
                  className={`font-bold ${p.points >= 0 ? "text-vinho-defumado" : "text-cinza-ferro"}`}
                >
                  {p.points >= 0 ? "+" : ""}
                  {p.points}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-cinza-ferro">Você ainda não tem pontos registrados.</p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-preto-wagyu">
          Meus orçamentos
        </h2>
        {orders && orders.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {orders.map((order) => (
              <li key={order.id} className="rounded-lg border border-cinza-osso p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-cinza-ferro">
                    {formatDate(order.created_at)}
                  </span>
                  <span className="rounded-full bg-marmoreio px-3 py-1 text-xs font-semibold text-preto-wagyu">
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
                <ul className="mb-2 flex flex-col gap-1 text-sm text-preto-wagyu">
                  {order.order_items.map((item) => (
                    <li key={item.id}>
                      {item.quantity}x {item.products?.name ?? "Produto"} —{" "}
                      {formatBRL(item.subtotal)}
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
          <p className="text-cinza-ferro">Você ainda não fez nenhum orçamento.</p>
        )}
      </section>
    </div>
  );
}
