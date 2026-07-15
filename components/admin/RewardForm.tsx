import type { Reward } from "@/lib/types";

export function RewardForm({
  reward,
  action,
}: {
  reward?: Reward;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Título
        <input
          name="title"
          required
          defaultValue={reward?.title}
          className="rounded border border-cinza-osso px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Descrição
        <textarea
          name="description"
          defaultValue={reward?.description ?? ""}
          className="rounded border border-cinza-osso px-3 py-2"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Custo em pontos
          <input
            type="number"
            name="points_cost"
            min="0"
            required
            defaultValue={reward?.points_cost}
            className="rounded border border-cinza-osso px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Tipo
          <select
            name="reward_type"
            defaultValue={reward?.reward_type ?? "desconto_percent"}
            className="rounded border border-cinza-osso px-3 py-2"
          >
            <option value="desconto_percent">Desconto (%)</option>
            <option value="desconto_fixo">Desconto (R$)</option>
            <option value="brinde">Brinde</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Valor (se desconto)
          <input
            type="number"
            name="value"
            step="0.01"
            defaultValue={reward?.value ?? ""}
            className="rounded border border-cinza-osso px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Estoque (opcional)
          <input
            type="number"
            name="stock"
            defaultValue={reward?.stock ?? ""}
            className="rounded border border-cinza-osso px-3 py-2"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-preto-wagyu">
        <input type="checkbox" name="is_active" defaultChecked={reward?.is_active ?? true} />
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
