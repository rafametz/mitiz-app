import { createClient } from "@/lib/supabase/server";
import { createCategory, updateCategory, deleteCategory } from "./actions";
import type { Category } from "@/lib/types";

export default async function AdminCategoriasPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
    .returns<Category[]>();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Categorias</h1>

      <form action={createCategory} className="mb-6 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Nome
          <input name="name" required className="rounded border border-cinza-osso px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Ordem
          <input
            type="number"
            name="sort_order"
            defaultValue={0}
            className="w-24 rounded border border-cinza-osso px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-vermelho-brasa px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-sangue-nobre"
        >
          Adicionar
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {categories?.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-end gap-3 rounded border border-cinza-osso p-3"
          >
            <form action={updateCategory.bind(null, c.id)} className="flex flex-wrap items-end gap-3">
              <input
                name="name"
                defaultValue={c.name}
                className="rounded border border-cinza-osso px-3 py-2"
              />
              <input
                type="number"
                name="sort_order"
                defaultValue={c.sort_order}
                className="w-20 rounded border border-cinza-osso px-3 py-2"
              />
              <button className="rounded-full border border-preto-wagyu px-4 py-2 text-sm hover:bg-marmoreio">
                Salvar
              </button>
            </form>
            <form action={deleteCategory.bind(null, c.id)}>
              <button className="text-sm text-vermelho-brasa hover:underline">Excluir</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
