"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart-context";
import { formatBRL } from "@/lib/format";
import type { CalculatorGroup, CalculatorSettings, Product } from "@/lib/types";

/** Converte o peso sugerido (kg) na quantidade a comprar, considerando
 * a unidade de venda do produto. Para produtos por unidade/pacote com
 * peso por unidade cadastrado, arredonda para cima o número de unidades. */
function suggestedQuantity(product: Product, kg: number) {
  if (product.unit_type === "kg") return kg;
  if (product.grams_per_unit) {
    return Math.max(1, Math.ceil((kg * 1000) / product.grams_per_unit));
  }
  return Math.max(1, Math.ceil(kg));
}

export default function CalculadoraPage() {
  const supabase = useMemo(() => createClient(), []);
  const { addItem } = useCart();

  const [settings, setSettings] = useState<CalculatorSettings | null>(null);
  const [groups, setGroups] = useState<CalculatorGroup[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [adults, setAdults] = useState(4);
  const [children, setChildren] = useState(0);
  const [selectedByGroup, setSelectedByGroup] = useState<Record<string, string[]>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      const [settingsRes, groupsRes, productsRes] = await Promise.all([
        supabase.from("calculator_settings").select("*").maybeSingle<CalculatorSettings>(),
        supabase
          .from("calculator_groups")
          .select("*")
          .order("sort_order")
          .returns<CalculatorGroup[]>(),
        supabase.from("products").select("*").eq("is_active", true).returns<Product[]>(),
      ]);
      setSettings(settingsRes.data);
      setGroups(groupsRes.data ?? []);
      setProducts(productsRes.data ?? []);
      setLoading(false);
    }
    load();
  }, [supabase]);

  function toggleProduct(groupId: string, productId: string, maxSelections: number) {
    setSelectedByGroup((prev) => {
      const current = prev[groupId] ?? [];
      if (current.includes(productId)) {
        return { ...prev, [groupId]: current.filter((id) => id !== productId) };
      }
      if (current.length >= maxSelections) return prev;
      return { ...prev, [groupId]: [...current, productId] };
    });
  }

  const totalPeople = adults + children;
  const totalGrams = settings
    ? adults * settings.grams_per_adult + children * settings.grams_per_child
    : 0;

  const groupResults = useMemo(() => {
    return groups.map((group) => {
      const groupKg = (totalGrams * (group.percent / 100)) / 1000;
      const availableProducts = products.filter((p) => p.category_id === group.category_id);
      const selectedIds = selectedByGroup[group.id] ?? [];
      const perProductKg = selectedIds.length > 0 ? groupKg / selectedIds.length : 0;
      return { group, groupKg, availableProducts, selectedIds, perProductKg };
    });
  }, [groups, totalGrams, products, selectedByGroup]);

  const breadProduct = settings?.bread_product_id
    ? products.find((p) => p.id === settings.bread_product_id)
    : null;
  const breadCapacity = settings?.bread_units_per_package ?? 0;
  const breadPackages =
    breadProduct && settings && totalPeople > 0 && breadCapacity > 0
      ? Math.max(1, Math.ceil((totalPeople - breadCapacity / 2) / breadCapacity))
      : 0;

  const cheeseProduct = settings?.cheese_product_id
    ? products.find((p) => p.id === settings.cheese_product_id)
    : null;
  const cheesePackages =
    cheeseProduct && settings && totalPeople > 0
      ? Math.ceil(totalPeople / settings.cheese_people_per_package)
      : 0;

  function handleAdd(product: Product, quantity: number) {
    addItem({
      productId: product.id,
      name: product.name,
      unitType: product.unit_type,
      unitPrice: product.price_per_unit,
      quantity: Number(quantity.toFixed(2)),
    });
    setAdded((prev) => ({ ...prev, [product.id]: true }));
  }

  const hasAnySuggestion = totalPeople > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="eyebrow text-vermelho-brasa">Calcule sem desperdício</p>
      <h1 className="mt-2 mb-2 text-3xl text-preto-wagyu">
        Calculadora de Churrasco
      </h1>
      <p className="mb-8 max-w-md text-cinza-ferro">
        Informe quantas pessoas vão participar — a gente sugere as
        quantidades certas de carne, pão de alho e queijo.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg border border-cinza-osso bg-marmoreio p-4">
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Adultos
          <input
            type="number"
            min={0}
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="rounded border border-cinza-osso bg-branco-sal px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Crianças
          <input
            type="number"
            min={0}
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            className="rounded border border-cinza-osso bg-branco-sal px-3 py-2"
          />
        </label>
      </div>

      {loading ? (
        <p className="text-cinza-ferro">Carregando...</p>
      ) : !hasAnySuggestion ? (
        <p className="text-cinza-ferro">Informe ao menos uma pessoa para calcular.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {groupResults.map(({ group, groupKg, availableProducts, selectedIds, perProductKg }) => (
            <div key={group.id} className="rounded-lg border border-cinza-osso bg-marmoreio p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-preto-wagyu">
                  {group.label} ({group.percent}%)
                </h3>
                <span className="price-tag rounded-sm bg-preto-wagyu px-2.5 py-1 text-sm text-branco-sal">
                  ~{groupKg.toFixed(2)} kg
                </span>
              </div>

              {availableProducts.length === 0 ? (
                <p className="text-sm text-cinza-ferro">
                  Nenhum produto cadastrado para esta categoria ainda.
                </p>
              ) : (
                <>
                  <p className="mb-2 text-xs text-cinza-ferro">
                    Escolha até {group.max_selections} corte(s):
                  </p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {availableProducts.map((p) => {
                      const isSelected = selectedIds.includes(p.id);
                      const isDisabled = !isSelected && selectedIds.length >= group.max_selections;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => toggleProduct(group.id, p.id, group.max_selections)}
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            isSelected
                              ? "border-vermelho-brasa bg-vermelho-brasa text-branco-sal shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                              : isDisabled
                                ? "cursor-not-allowed border-cinza-osso text-cinza-osso"
                                : "border-cinza-osso text-cinza-ferro hover:border-preto-wagyu"
                          }`}
                        >
                          {p.name}
                        </button>
                      );
                    })}
                  </div>

                  {selectedIds.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {selectedIds.map((id) => {
                        const p = availableProducts.find((prod) => prod.id === id);
                        if (!p) return null;
                        const quantity = suggestedQuantity(p, perProductKg);
                        const quantityLabel =
                          p.unit_type === "kg"
                            ? `~${quantity.toFixed(2)} kg`
                            : `${quantity}x ${p.unit_type}`;
                        return (
                          <li
                            key={id}
                            className="flex items-center justify-between gap-3 rounded border border-cinza-osso bg-branco-sal px-3 py-2 text-sm"
                          >
                            <span className="text-preto-wagyu">
                              {p.name} —{" "}
                              <span className="text-cinza-ferro">
                                {quantityLabel} ({formatBRL(p.price_per_unit)}/{p.unit_type})
                              </span>
                            </span>
                            <button
                              onClick={() => handleAdd(p, quantity)}
                              className="rounded-full bg-vermelho-brasa px-3 py-1 text-xs font-semibold text-branco-sal hover:bg-sangue-nobre"
                            >
                              {added[p.id] ? "Adicionado!" : "Adicionar"}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))}

          {(breadProduct || cheeseProduct) && (
            <div className="rounded-lg border border-cinza-osso bg-marmoreio p-4">
              <h3 className="mb-3 font-semibold text-preto-wagyu">Complementos sugeridos</h3>
              <ul className="flex flex-col gap-2">
                {breadProduct && (
                  <li className="flex items-center justify-between gap-3 rounded border border-cinza-osso bg-branco-sal px-3 py-2 text-sm">
                    <span className="text-preto-wagyu">
                      {breadProduct.name} —{" "}
                      <span className="text-cinza-ferro">
                        {breadPackages}x {breadProduct.unit_type} ({formatBRL(breadProduct.price_per_unit)} cada)
                      </span>
                    </span>
                    <button
                      onClick={() => handleAdd(breadProduct, breadPackages)}
                      className="rounded-full bg-vermelho-brasa px-3 py-1 text-xs font-semibold text-branco-sal hover:bg-sangue-nobre"
                    >
                      {added[breadProduct.id] ? "Adicionado!" : "Adicionar"}
                    </button>
                  </li>
                )}
                {cheeseProduct && (
                  <li className="flex items-center justify-between gap-3 rounded border border-cinza-osso bg-branco-sal px-3 py-2 text-sm">
                    <span className="text-preto-wagyu">
                      {cheeseProduct.name} —{" "}
                      <span className="text-cinza-ferro">
                        {cheesePackages}x {cheeseProduct.unit_type} ({formatBRL(cheeseProduct.price_per_unit)} cada)
                      </span>
                    </span>
                    <button
                      onClick={() => handleAdd(cheeseProduct, cheesePackages)}
                      className="rounded-full bg-vermelho-brasa px-3 py-1 text-xs font-semibold text-branco-sal hover:bg-sangue-nobre"
                    >
                      {added[cheeseProduct.id] ? "Adicionado!" : "Adicionar"}
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}

          <Link
            href="/orcamento"
            className="mt-2 w-fit rounded-full bg-vermelho-brasa px-6 py-3 font-semibold text-branco-sal shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-sangue-nobre"
          >
            Ir para o orçamento
          </Link>
        </div>
      )}
    </div>
  );
}
