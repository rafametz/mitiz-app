"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(product.unit_type === "kg" ? 1 : 1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      unitType: product.unit_type,
      unitPrice: product.price_per_unit,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 text-sm text-cinza-ferro">
        Quantidade ({product.unit_type})
        <input
          type="number"
          min={0.1}
          step={product.unit_type === "kg" ? 0.1 : 1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-24 rounded border border-cinza-osso px-2 py-1"
        />
      </label>
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          className="rounded-full bg-vermelho-brasa px-5 py-2 font-semibold text-branco-sal hover:bg-sangue-nobre"
        >
          {added ? "Adicionado!" : "Adicionar ao orçamento"}
        </button>
        <button
          onClick={() => {
            handleAdd();
            router.push("/orcamento");
          }}
          className="rounded-full border border-preto-wagyu px-5 py-2 font-semibold text-preto-wagyu hover:bg-marmoreio"
        >
          Ir para o orçamento
        </button>
      </div>
    </div>
  );
}
