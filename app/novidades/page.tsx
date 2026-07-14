import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "@/components/NewsCard";
import type { NewsItem } from "@/lib/types";

export default async function NovidadesPage() {
  const supabase = await createClient();
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("is_active", true)
    .order("published_at", { ascending: false })
    .returns<NewsItem[]>();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Novidades</h1>
      {news && news.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {news.map((n) => (
            <NewsCard key={n.id} item={n} />
          ))}
        </div>
      ) : (
        <p className="text-cinza-ferro">Nenhuma novidade publicada ainda.</p>
      )}
    </div>
  );
}
