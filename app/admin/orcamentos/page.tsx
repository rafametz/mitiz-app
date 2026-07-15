import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatBRL, formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  novo: "Novo",
  em_analise: "Em análise",
  confirmado: "Confirmado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export default async function AdminOrcamentosPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Order[]>();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Orçamentos</h1>

      <div className="overflow-x-auto rounded-lg border border-cinza-osso">
        <table className="w-full text-left text-sm">
          <thead className="bg-marmoreio text-preto-wagyu">
            <tr>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Cliente</th>
              <th className="px-4 py-2">Telefone</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-t border-cinza-osso">
                <td className="px-4 py-2 text-cinza-ferro">{formatDate(order.created_at)}</td>
                <td className="px-4 py-2 text-preto-wagyu">{order.customer_name}</td>
                <td className="px-4 py-2 text-cinza-ferro">{order.customer_phone}</td>
                <td className="px-4 py-2 text-preto-wagyu">{formatBRL(order.total_estimated)}</td>
                <td className="px-4 py-2">{STATUS_LABELS[order.status] ?? order.status}</td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/orcamentos/${order.id}`}
                    className="text-vinho-defumado hover:underline"
                  >
                    Ver detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && (
          <p className="p-4 text-cinza-ferro">Nenhum orçamento recebido ainda.</p>
        )}
      </div>
    </div>
  );
}
