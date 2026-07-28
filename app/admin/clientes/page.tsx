import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { ExportClientsButton } from "@/components/admin/ExportClientsButton";
import type { Profile } from "@/lib/types";

export default async function AdminClientesPage() {
  const supabase = await createClient();
  const { data: clientes } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "cliente")
    .order("created_at", { ascending: false })
    .returns<Profile[]>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-preto-wagyu">Clientes</h1>
        <ExportClientsButton clientes={clientes ?? []} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-cinza-osso">
        <table className="w-full text-left text-sm">
          <thead className="bg-marmoreio text-preto-wagyu">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">E-mail</th>
              <th className="px-4 py-2">WhatsApp</th>
              <th className="px-4 py-2">Cadastro</th>
              <th className="px-4 py-2">Pontos</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {clientes?.map((c) => (
              <tr key={c.id} className="border-t border-cinza-osso">
                <td className="px-4 py-2 text-preto-wagyu">{c.name ?? "Sem nome"}</td>
                <td className="px-4 py-2 text-cinza-ferro">{c.email ?? "—"}</td>
                <td className="px-4 py-2 text-cinza-ferro">{c.phone ?? "—"}</td>
                <td className="px-4 py-2 text-cinza-ferro">{formatDate(c.created_at)}</td>
                <td className="px-4 py-2 font-bold text-vinho-defumado">{c.points_balance} pts</td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/clientes/${c.id}`}
                    className="text-vinho-defumado hover:underline"
                  >
                    Ver detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!clientes || clientes.length === 0) && (
          <p className="p-4 text-cinza-ferro">Nenhum cliente cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
