import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/format";
import { deleteProduct } from "./actions";
import type { Product } from "@/lib/types";

export default async function AdminProdutosPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("name")
    .returns<(Product & { categories: { name: string } | null })[]>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-preto-wagyu">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="rounded-full bg-vermelho-brasa px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-sangue-nobre"
        >
          Novo produto
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-cinza-osso">
        <table className="w-full text-left text-sm">
          <thead className="bg-marmoreio text-preto-wagyu">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Categoria</th>
              <th className="px-4 py-2">Preço</th>
              <th className="px-4 py-2">Ativo</th>
              <th className="px-4 py-2">Destaque</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-t border-cinza-osso">
                <td className="px-4 py-2 text-preto-wagyu">{p.name}</td>
                <td className="px-4 py-2 text-cinza-ferro">{p.categories?.name ?? "—"}</td>
                <td className="px-4 py-2 text-preto-wagyu">
                  {formatBRL(p.price_per_unit)}/{p.unit_type}
                </td>
                <td className="px-4 py-2">{p.is_active ? "Sim" : "Não"}</td>
                <td className="px-4 py-2">{p.is_featured ? "Sim" : "Não"}</td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/produtos/${p.id}`}
                    className="mr-3 text-vinho-defumado hover:underline"
                  >
                    Editar
                  </Link>
                  <form action={deleteProduct.bind(null, p.id)} className="inline">
                    <button className="text-vermelho-brasa hover:underline">Excluir</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!products || products.length === 0) && (
          <p className="p-4 text-cinza-ferro">Nenhum produto cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
