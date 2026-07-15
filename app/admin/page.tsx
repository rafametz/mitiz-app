import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: novos }, { count: produtos }, { count: clientes }] =
    await Promise.all([
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "novo"),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "cliente"),
    ]);

  const cards = [
    { label: "Orçamentos novos", value: novos ?? 0, href: "/admin/orcamentos" },
    { label: "Produtos ativos", value: produtos ?? 0, href: "/admin/produtos" },
    { label: "Clientes cadastrados", value: clientes ?? 0, href: "/admin/clientes" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-cinza-osso bg-branco-sal p-6 hover:shadow-md"
          >
            <p className="text-sm text-cinza-ferro">{card.label}</p>
            <p className="text-3xl font-bold text-preto-wagyu">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
