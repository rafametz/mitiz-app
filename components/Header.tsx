"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/novidades", label: "Novidades" },
  { href: "/eventos", label: "Eventos" },
  { href: "/calculadora", label: "Calculadora de Churrasco" },
];

export function Header() {
  const { items } = useCart();
  const supabase = useMemo(() => createClient(), []);
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const totalItens = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });
    return () => subscription.subscription.unsubscribe();
  }, [supabase]);

  const accountLink = loggedIn
    ? { href: "/minha-conta", label: "Minha Conta" }
    : { href: "/entrar", label: "Entrar" };

  return (
    <header className="border-b border-cinza-osso bg-branco-sal">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/mitiz-logo.svg"
            alt="MITIZ Boutique de Carnes"
            width={48}
            height={41}
            className="h-11 w-auto"
            priority
          />
        </Link>

        <button
          className="text-preto-wagyu sm:hidden"
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
              className="text-sm text-preto-wagyu hover:text-vermelho-brasa"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={accountLink.href}
            className="text-sm text-preto-wagyu hover:text-vermelho-brasa"
          >
            {accountLink.label}
          </Link>
          <Link
            href="/orcamento"
            className="rounded-full bg-vermelho-brasa px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-sangue-nobre"
          >
            Orçamento{totalItens > 0 ? ` (${totalItens})` : ""}
          </Link>
        </nav>
      </div>

      {open && (
        <nav className="flex flex-col gap-3 border-t border-cinza-osso px-4 py-4 sm:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-preto-wagyu"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={accountLink.href}
            className="text-sm text-preto-wagyu"
            onClick={() => setOpen(false)}
          >
            {accountLink.label}
          </Link>
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
