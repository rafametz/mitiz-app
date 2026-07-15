import { createClient } from "@/lib/supabase/server";
import { updateCalculatorRule } from "./actions";
import type { BarbecueCalculatorRule } from "@/lib/types";

export default async function AdminCalculadoraConfigPage() {
  const supabase = await createClient();
  const { data: rules } = await supabase
    .from("barbecue_calculator_rules")
    .select("*")
    .order("sort_order")
    .returns<BarbecueCalculatorRule[]>();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-preto-wagyu">Calculadora de Churrasco</h1>
      <p className="mb-6 text-cinza-ferro">
        Ajuste quantos gramas por pessoa a calculadora sugere para cada tipo de carne.
      </p>

      <ul className="flex flex-col gap-3">
        {rules?.map((rule) => (
          <li key={rule.id} className="rounded border border-cinza-osso p-4">
            <p className="mb-2 font-semibold capitalize text-preto-wagyu">{rule.meat_type}</p>
            <form
              action={updateCalculatorRule.bind(null, rule.id)}
              className="flex flex-wrap items-end gap-3"
            >
              <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
                Gramas por adulto
                <input
                  type="number"
                  name="grams_per_adult"
                  defaultValue={rule.grams_per_adult}
                  className="w-32 rounded border border-cinza-osso px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
                Gramas por criança
                <input
                  type="number"
                  name="grams_per_child"
                  defaultValue={rule.grams_per_child}
                  className="w-32 rounded border border-cinza-osso px-3 py-2"
                />
              </label>
              <button className="rounded-full bg-vermelho-brasa px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-sangue-nobre">
                Salvar
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
