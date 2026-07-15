"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CadastroPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || password.length < 6) {
      setError("Preencha nome, telefone, e-mail e uma senha com pelo menos 6 caracteres.");
      return;
    }
    setError(null);
    setSending(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setError("Este e-mail já está cadastrado. Tente entrar.");
      } else if (error.message.includes("rate limit")) {
        setError(
          "Muitas tentativas de cadastro em pouco tempo. Aguarde alguns minutos e tente de novo.",
        );
      } else {
        setError("Não foi possível criar sua conta. Tente novamente.");
      }
      setSending(false);
      return;
    }

    if (data.session) {
      router.push("/minha-conta");
      router.refresh();
      return;
    }

    setNeedsConfirmation(true);
    setSending(false);
  }

  if (needsConfirmation) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-preto-wagyu">Falta pouco!</h1>
        <p className="mt-3 text-cinza-ferro">
          Enviamos um e-mail de confirmação para <strong>{email}</strong>.
          Clique no link para ativar sua conta.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-2xl font-bold text-preto-wagyu">Criar conta</h1>
      <p className="mb-6 text-cinza-ferro">
        Cadastre-se para acumular pontos e acompanhar seus orçamentos.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          required
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-cinza-osso px-3 py-2"
        />
        <input
          required
          placeholder="Seu WhatsApp (com DDD)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded border border-cinza-osso px-3 py-2"
        />
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
          placeholder="Crie uma senha"
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
          {sending ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-cinza-ferro">
        Já tem conta?{" "}
        <Link href="/entrar" className="text-vinho-defumado underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
