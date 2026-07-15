"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EntrarPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setSending(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("E-mail ou senha incorretos.");
      setSending(false);
      return;
    }

    router.push("/minha-conta");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-2xl font-bold text-preto-wagyu">Entrar</h1>
      <p className="mb-6 text-cinza-ferro">
        Acesse sua conta para ver seus pontos e orçamentos.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border border-cinza-osso px-3 py-2"
        />
        <input
          type="password"
          required
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border border-cinza-osso px-3 py-2"
        />

        {error && <p className="text-sm text-vermelho-brasa">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-vermelho-brasa px-6 py-3 font-semibold text-branco-sal hover:bg-sangue-nobre disabled:opacity-50"
        >
          {sending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-cinza-ferro">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="text-vinho-defumado underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
