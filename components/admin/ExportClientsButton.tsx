"use client";

import type { Profile } from "@/lib/types";

export function ExportClientsButton({ clientes }: { clientes: Profile[] }) {
  async function handleExport() {
    const XLSX = await import("xlsx");

    const rows = clientes.map((c) => ({
      Nome: c.name ?? "",
      "E-mail": c.email ?? "",
      WhatsApp: c.phone ?? "",
    }));

    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Clientes");
    XLSX.writeFile(workbook, "clientes-mitiz.xlsx");
  }

  return (
    <button
      onClick={handleExport}
      className="rounded-full border border-preto-wagyu px-4 py-2 text-sm font-semibold text-preto-wagyu hover:bg-marmoreio"
    >
      Exportar XLSX
    </button>
  );
}
