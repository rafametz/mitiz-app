"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { QuantityInput } from "@/components/QuantityInput";
import type { Product } from "@/lib/types";

export function AddToCartForm({
  product,
  unitPrice,
}: {
  product: Product;
  unitPrice?: number;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      unitType: product.unit_type,
      unitPrice: unitPrice ?? product.price_per_unit,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 text-sm text-cinza-ferro">
        Quantidade
        <QuantityInput
          defaultValue={1}
          unitType={product.unit_type}
          onChange={setQuantity}
        />
      </div>
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
