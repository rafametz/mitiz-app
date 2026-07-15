import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewsForm } from "@/components/admin/NewsForm";
import { updateNews } from "../actions";
import type { NewsItem } from "@/lib/types";

export default async function EditarNovidadePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .maybeSingle<NewsItem>();

  if (!item) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Editar novidade</h1>
      <NewsForm item={item} action={updateNews.bind(null, id)} />
    </div>
  );
}
