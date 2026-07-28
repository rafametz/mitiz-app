import type { Category, Product } from "@/lib/types";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { CurrencyInput } from "@/components/admin/CurrencyInput";

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
      <ImageUploadField
        name="image_url"
        label="Foto do produto"
        folder="products"
        defaultValue={product?.image_url}
        aspect="square"
      />

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
          Unidade de medida
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

        <CurrencyInput
          name="price_per_unit"
          label="Preço por unidade"
          defaultValue={product?.price_per_unit}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Código do produto
          <input
            name="product_code"
            defaultValue={product?.product_code ?? ""}
            className="rounded border border-cinza-osso px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          NCM
          <input
            name="ncm"
            defaultValue={product?.ncm ?? ""}
            className="rounded border border-cinza-osso px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Fabricante / Marca
        <input
          name="brand"
          defaultValue={product?.brand ?? ""}
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
