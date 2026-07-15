import type { Category, Product } from "@/lib/types";

const MEAT_TYPES = ["bovina", "suina", "frango", "linguica", "outros"] as const;
const UNIT_TYPES = ["kg", "unidade", "pacote"] as const;

export function ProductForm({
  product,
  categories,
  action,
}: {
  product?: Product;
  categories: Category[];
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Nome
        <input
          name="name"
          required
          defaultValue={product?.name}
          className="rounded border border-cinza-osso px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Categoria
        <select
          name="category_id"
          defaultValue={product?.category_id ?? ""}
          className="rounded border border-cinza-osso px-3 py-2"
        >
          <option value="">Sem categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Descrição
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          className="rounded border border-cinza-osso px-3 py-2"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Tipo de carne
          <select
            name="meat_type"
            defaultValue={product?.meat_type ?? "bovina"}
            className="rounded border border-cinza-osso px-3 py-2"
          >
            {MEAT_TYPES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Unidade
          <select
            name="unit_type"
            defaultValue={product?.unit_type ?? "kg"}
            className="rounded border border-cinza-osso px-3 py-2"
          >
            {UNIT_TYPES.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Preço por unidade (R$)
        <input
          type="number"
          name="price_per_unit"
          step="0.01"
          min="0"
          required
          defaultValue={product?.price_per_unit}
          className="rounded border border-cinza-osso px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-preto-wagyu">
        <input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} />
        Ativo (visível no catálogo)
      </label>

      <label className="flex items-center gap-2 text-sm text-preto-wagyu">
        <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured ?? false} />
        Destaque na home
      </label>

      <button
        type="submit"
        className="mt-2 w-fit rounded-full bg-vermelho-brasa px-6 py-2 font-semibold text-branco-sal hover:bg-sangue-nobre"
      >
        Salvar
      </button>
    </form>
  );
}
