import type { Product, Promotion } from "@/lib/types";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export function PromotionForm({
  promotion,
  products,
  action,
}: {
  promotion?: Promotion;
  products: Product[];
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Título
        <input
          name="title"
          required
          defaultValue={promotion?.title}
          className="rounded border border-cinza-osso px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Produto (opcional)
        <select
          name="product_id"
          defaultValue={promotion?.product_id ?? ""}
          className="rounded border border-cinza-osso px-3 py-2"
        >
          <option value="">Nenhum produto específico</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Descrição
        <textarea
          name="description"
          defaultValue={promotion?.description ?? ""}
          className="rounded border border-cinza-osso px-3 py-2"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Tipo de desconto
          <select
            name="discount_type"
            defaultValue={promotion?.discount_type ?? "percent"}
            className="rounded border border-cinza-osso px-3 py-2"
          >
            <option value="percent">Percentual (%)</option>
            <option value="fixed">Valor fixo (R$)</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Valor do desconto
          <input
            type="number"
            name="discount_value"
            step="0.01"
            min="0"
            required
            defaultValue={promotion?.discount_value}
            className="rounded border border-cinza-osso px-3 py-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Início
          <input
            type="date"
            name="starts_at"
            defaultValue={promotion?.starts_at?.slice(0, 10) ?? ""}
            className="rounded border border-cinza-osso px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Fim
          <input
            type="date"
            name="ends_at"
            defaultValue={promotion?.ends_at?.slice(0, 10) ?? ""}
            className="rounded border border-cinza-osso px-3 py-2"
          />
        </label>
      </div>

      <ImageUploadField
        name="image_url"
        label="Imagem da promoção"
        folder="promotions"
        defaultValue={promotion?.image_url}
      />

      <label className="flex items-center gap-2 text-sm text-preto-wagyu">
        <input type="checkbox" name="is_active" defaultChecked={promotion?.is_active ?? true} />
        Ativa
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
