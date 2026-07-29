import { createClient } from "@/lib/supabase/server";
import { updateCalculatorSettings, updateCalculatorGroup } from "./actions";
import type { CalculatorGroup, CalculatorSettings, Category, Product } from "@/lib/types";

export default async function AdminCalculadoraConfigPage() {
  const supabase = await createClient();
  const [{ data: settings }, { data: groups }, { data: categories }, { data: products }] =
    await Promise.all([
      supabase.from("calculator_settings").select("*").maybeSingle<CalculatorSettings>(),
      supabase
        .from("calculator_groups")
        .select("*")
        .order("sort_order")
        .returns<CalculatorGroup[]>(),
      supabase.from("categories").select("*").order("sort_order").returns<Category[]>(),
      supabase.from("products").select("*").order("name").returns<Product[]>(),
    ]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-preto-wagyu">Calculadora de Churrasco</h1>
      <p className="mb-6 text-cinza-ferro">
        A calculadora soma {settings?.grams_per_adult ?? 400}g por adulto e{" "}
        {settings?.grams_per_child ?? 200}g por criança, divide esse total entre
        os grupos abaixo, e sugere pão de alho e queijo por pacote.
      </p>

      {settings && (
        <section className="mb-8 rounded-lg border border-cinza-osso p-4">
          <h2 className="mb-3 font-semibold text-preto-wagyu">Configurações gerais</h2>
          <form
            action={updateCalculatorSettings.bind(null, settings.id)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
                Gramas por adulto
                <input
                  type="number"
                  name="grams_per_adult"
                  defaultValue={settings.grams_per_adult}
                  className="rounded border border-cinza-osso px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
                Gramas por criança
                <input
                  type="number"
                  name="grams_per_child"
                  defaultValue={settings.grams_per_child}
                  className="rounded border border-cinza-osso px-3 py-2"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
                Produto: Pão de alho
                <select
                  name="bread_product_id"
                  defaultValue={settings.bread_product_id ?? ""}
                  className="rounded border border-cinza-osso px-3 py-2"
                >
                  <option value="">Nenhum</option>
                  {products?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
                Pessoas atendidas por pacote (pão)
                <input
                  type="number"
                  name="bread_units_per_package"
                  defaultValue={settings.bread_units_per_package}
                  className="rounded border border-cinza-osso px-3 py-2"
                />
                <span className="text-xs text-cinza-ferro">
                  Um pacote atende até esse número de pessoas. Passando da
                  metade desse valor além da capacidade já usada, soma mais
                  um pacote (ex: pacote p/ 8 pessoas → até 12 pessoas segue
                  1 pacote, de 13 a 20 vira 2 pacotes).
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
                Produto: Queijo
                <select
                  name="cheese_product_id"
                  defaultValue={settings.cheese_product_id ?? ""}
                  className="rounded border border-cinza-osso px-3 py-2"
                >
                  <option value="">Nenhum</option>
                  {products?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
                Pessoas por pacote (queijo)
                <input
                  type="number"
                  name="cheese_people_per_package"
                  defaultValue={settings.cheese_people_per_package}
                  className="rounded border border-cinza-osso px-3 py-2"
                />
              </label>
            </div>

            <button className="w-fit rounded-full bg-vermelho-brasa px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-sangue-nobre">
              Salvar configurações
            </button>
          </form>
        </section>
      )}

      <h2 className="mb-3 font-semibold text-preto-wagyu">Grupos de carne</h2>
      <ul className="flex flex-col gap-3">
        {groups?.map((group) => (
          <li key={group.id} className="rounded border border-cinza-osso p-4">
            <p className="mb-2 font-semibold text-preto-wagyu">{group.label}</p>
            <form
              action={updateCalculatorGroup.bind(null, group.id)}
              className="flex flex-wrap items-end gap-3"
            >
              <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
                Percentual (%)
                <input
                  type="number"
                  step="0.01"
                  name="percent"
                  defaultValue={group.percent}
                  className="w-24 rounded border border-cinza-osso px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
                Categoria de produtos
                <select
                  name="category_id"
                  defaultValue={group.category_id ?? ""}
                  className="rounded border border-cinza-osso px-3 py-2"
                >
                  <option value="">Nenhuma</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
                Máx. cortes escolhíveis
                <input
                  type="number"
                  min={1}
                  name="max_selections"
                  defaultValue={group.max_selections}
                  className="w-24 rounded border border-cinza-osso px-3 py-2"
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
