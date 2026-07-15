import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { deleteNews } from "./actions";
import type { NewsItem } from "@/lib/types";

export default async function AdminNovidadesPage() {
  const supabase = await createClient();
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .returns<NewsItem[]>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-preto-wagyu">Novidades</h1>
        <Link
          href="/admin/novidades/novo"
          className="rounded-full bg-vermelho-brasa px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-sangue-nobre"
        >
          Nova novidade
        </Link>
      </div>

      <ul className="flex flex-col gap-2">
        {news?.map((n) => (
          <li
            key={n.id}
            className="flex items-center justify-between rounded border border-cinza-osso p-3"
          >
            <div>
              <p className="font-semibold text-preto-wagyu">{n.title}</p>
              <p className="text-sm text-cinza-ferro">
                {formatDate(n.published_at)} · {n.is_active ? "Publicada" : "Oculta"}
              </p>
            </div>
            <div>
              <Link
                href={`/admin/novidades/${n.id}`}
                className="mr-3 text-vinho-defumado hover:underline"
              >
                Editar
              </Link>
              <form action={deleteNews.bind(null, n.id)} className="inline">
                <button className="text-vermelho-brasa hover:underline">Excluir</button>
              </form>
            </div>
          </li>
        ))}
        {(!news || news.length === 0) && (
          <p className="text-cinza-ferro">Nenhuma novidade cadastrada ainda.</p>
        )}
      </ul>
    </div>
  );
}
