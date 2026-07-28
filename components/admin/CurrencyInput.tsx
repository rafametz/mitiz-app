"use client";

import { useState } from "react";

function centsToDisplay(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CurrencyInput({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: number;
}) {
  const [cents, setCents] = useState(() =>
    defaultValue ? Math.round(defaultValue * 100) : 0,
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    setCents(digits ? parseInt(digits, 10) : 0);
  }

  return (
    <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
      {label}
      <div className="flex items-center gap-2 rounded border border-cinza-osso px-3 py-2">
        <span className="text-cinza-ferro">R$</span>
        <input
          type="text"
          inputMode="decimal"
          value={centsToDisplay(cents)}
          onChange={handleChange}
          className="w-full outline-none"
        />
      </div>
      <input type="hidden" name={name} value={(cents / 100).toFixed(2)} />
    </label>
  );
}
