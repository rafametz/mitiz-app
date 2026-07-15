import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin-guard";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/promocoes", label: "Promoções" },
  { href: "/admin/novidades", label: "Novidades" },
  { href: "/admin/eventos", label: "Eventos" },
  { href: "/admin/orcamentos", label: "Orçamentos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/recompensas", label: "Recompensas" },
  { href: "/admin/calculadora-config", label: "Calculadora" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
      <aside className="w-48 shrink-0">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-cinza-ferro">
          Painel Admin
        </p>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-3 py-2 text-sm text-preto-wagyu hover:bg-marmoreio"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
