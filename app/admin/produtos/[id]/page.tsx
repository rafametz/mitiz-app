import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "../actions";
import type { Category, Product } from "@/lib/types";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle<Product>(),
    supabase.from("categories").select("*").order("sort_order").returns<Category[]>(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Editar produto</h1>
      <ProductForm
        product={product}
        categories={categories ?? []}
        action={updateProduct.bind(null, id)}
      />
    </div>
  );
}
