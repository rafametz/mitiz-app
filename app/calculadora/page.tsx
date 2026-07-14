"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart-context";
import { formatBRL } from "@/lib/format";
import type { BarbecueCalculatorRule, MeatType, Product } from "@/lib/types";

const MEAT_LABELS: Record<MeatType, string> = {
  bovina: "Carne bovina",
  suina: "Carne suína",
  frango: "Frango",
  linguica: "Linguiça",
  outros: "Outros",
};

export default function CalculadoraPage() {
  const supabase = useMemo(() => createClient(), []);
  const { addItem } = useCart();

  const [rules, setRules] = useState<BarbecueCalculatorRule[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [adults, setAdults] = useState(4);
  const [children, setChildren] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<MeatType[]>([]);
  const [added, setAdded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      const [rulesRes, productsRes] = await Promise.all([
        supabase
          .from("barbecue_calculator_rules")
          .select("*")
          .order("sort_order")
          .returns<BarbecueCalculatorRule[]>(),
        supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .returns<Product[]>(),
      ]);
      setRules(rulesRes.data ?? []);
      setProducts(productsRes.data ?? []);
      setLoading(false);
    }
    load();
  }, [supabase]);

  function toggleType(type: MeatType) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }

  const results = useMemo(() => {
    if (selectedTypes.length === 0) return [];
    return selectedTypes.map((type) => {
      const rule = rules.find((r) => r.meat_type === type);
      const gramsTotal = rule
        ? adults * rule.grams_per_adult + children * rule.grams_per_child
        : 0;
      const gramsFinal = gramsTotal / selectedTypes.length;
      const kg = gramsFinal / 1000;
      const suggestedProducts = products.filter((p) => p.meat_type === type);
      return { type, kg, suggestedProducts };
    });
  }, [selectedTypes, rules, adults, children, products]);

  function handleAdd(product: Product, kg: number) {
    addItem({
      productId: product.id,
      name: product.name,
      unitType: product.unit_type,
      unitPrice: product.price_per_unit,
      quantity: Number(kg.toFixed(2)),
    });
    setAdded((prev) => ({ ...prev, [product.id]: true }));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-preto-wagyu">
        Calculadora de Churrasco
      </h1>
      <p className="mb-6 text-cinza-ferro">
        Informe quantas pessoas vão participar e quais carnes deseja servir.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Adultos
          <input
            type="number"
            min={0}
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="rounded border border-cinza-osso px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Crianças
          <input
            type="number"
            min={0}
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            className="rounded border border-cinza-osso px-3 py-2"
          />
        </label>
      </div>

      {loading ? (
        <p className="text-cinza-ferro">Carregando...</p>
      ) : (
        <>
          <p className="mb-2 text-sm font-semibold text-preto-wagyu">
            Quais carnes você quer servir?
          </p>
          <div className="mb-8 flex flex-wrap gap-2">
            {rules.map((rule) => (
              <button
                key={rule.id}
                onClick={() => toggleType(rule.meat_type)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  selectedTypes.includes(rule.meat_type)
                    ? "border-vermelho-brasa bg-vermelho-brasa text-branco-sal"
                    : "border-cinza-osso text-cinza-ferro"
                }`}
              >
                {MEAT_LABELS[rule.meat_type]}
              </button>
            ))}
          </div>

          {results.length > 0 && (
            <div className="flex flex-col gap-6">
              {results.map(({ type, kg, suggestedProducts }) => (
                <div key={type} className="rounded-lg border border-cinza-osso p-4">
                  <h3 className="font-semibold text-preto-wagyu">
                    {MEAT_LABELS[type]}: ~{kg.toFixed(2)} kg
                  </h3>
                  {suggestedProducts.length > 0 ? (
                    <ul className="mt-3 flex flex-col gap-2">
                      {suggestedProducts.map((p) => (
                        <li
                          key={p.id}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span>
                            {p.name} — {formatBRL(p.price_per_unit)}/{p.unit_type}
                          </span>
                          <button
                            onClick={() => handleAdd(p, kg)}
                            className="rounded-full bg-preto-wagyu px-3 py-1 text-xs font-semibold text-branco-sal hover:bg-cinza-ferro"
                          >
                            {added[p.id] ? "Adicionado!" : "Adicionar"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-cinza-ferro">
                      Nenhum produto cadastrado para este tipo ainda.
                    </p>
                  )}
                </div>
              ))}

              <Link
                href="/orcamento"
                className="w-fit rounded-full bg-vermelho-brasa px-6 py-3 font-semibold text-branco-sal hover:bg-sangue-nobre"
              >
                Ir para o orçamento
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
