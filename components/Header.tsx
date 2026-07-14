"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

const links = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/novidades", label: "Novidades" },
  { href: "/eventos", label: "Eventos" },
  { href: "/calculadora", label: "Calculadora de Churrasco" },
];

export function Header() {
  const { items } = useCart();
  const [open, setOpen] = useState(false);
  const totalItens = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="bg-preto-wagyu text-branco-sal">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-wide">
          MITIZ
          <span className="ml-2 text-xs font-normal text-cinza-osso">
            Boutique de Carnes
          </span>
        </Link>

        <button
          className="text-branco-sal sm:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          ☰
        </button>

        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm hover:text-vermelho-brasa"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/orcamento"
            className="rounded-full bg-vermelho-brasa px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-sangue-nobre"
          >
            Orçamento{totalItens > 0 ? ` (${totalItens})` : ""}
          </Link>
        </nav>
      </div>

      {open && (
        <nav className="flex flex-col gap-3 border-t border-cinza-ferro px-4 py-4 sm:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/orcamento"
            className="rounded-full bg-vermelho-brasa px-4 py-2 text-center text-sm font-semibold text-branco-sal"
            onClick={() => setOpen(false)}
          >
            Orçamento{totalItens > 0 ? ` (${totalItens})` : ""}
          </Link>
        </nav>
      )}
    </header>
  );
}
