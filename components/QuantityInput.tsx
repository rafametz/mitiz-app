"use client";

import { useState } from "react";
import type { UnitType } from "@/lib/types";

function formatQuantity(value: number, decimals: number) {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: decimals });
}

function parseText(raw: string, min: number) {
  const parsed = parseFloat(raw.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : min;
}

export function QuantityInput({
  defaultValue = 1,
  unitType,
  min = 0.1,
  onChange,
}: {
  defaultValue?: number;
  unitType: UnitType;
  min?: number;
  onChange: (value: number) => void;
}) {
  const step = unitType === "kg" ? 0.1 : 1;
  const decimals = unitType === "kg" ? 3 : 0;

  const [value, setValue] = useState(defaultValue);
  const [text, setText] = useState(() => formatQuantity(defaultValue, decimals));

  function commit(next: number) {
    const rounded = Math.round(Math.max(min, next) * 1000) / 1000;
    setValue(rounded);
    setText(formatQuantity(rounded, decimals));
    onChange(rounded);
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => commit(value - step)}
        aria-label="Diminuir quantidade"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-cinza-osso text-lg text-preto-wagyu hover:bg-marmoreio"
      >
        −
      </button>
      <input
        type="text"
        inputMode="decimal"
        value={text}
        onChange={(e) => {
          const raw = e.target.value;
          if (!/^[\d.,]*$/.test(raw)) return;
          setText(raw);
          // propaga o valor numerico a cada tecla, mesmo sem o campo perder o foco
          setValue(parseText(raw, min));
          onChange(parseText(raw, min));
        }}
        onBlur={() => commit(parseText(text, min))}
        className="w-16 rounded border border-cinza-osso px-2 py-1.5 text-center"
      />
      <button
        type="button"
        onClick={() => commit(value + step)}
        aria-label="Aumentar quantidade"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-cinza-osso text-lg text-preto-wagyu hover:bg-marmoreio"
      >
        +
      </button>
      <span className="text-sm text-cinza-ferro">{unitType}</span>
    </div>
  );
}
