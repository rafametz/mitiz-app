import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "../actions";
import type { Category } from "@/lib/types";

export default async function NovoProdutoPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
    .returns<Category[]>();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Novo produto</h1>
      <ProductForm categories={categories ?? []} action={createProduct} />
    </div>
  );
}
