"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart-context";
import { QuantityInput } from "@/components/QuantityInput";
import { formatBRL } from "@/lib/format";

export default function OrcamentoPage() {
  const supabase = useMemo(() => createClient(), []);
  const { items, updateQuantity, removeItem, clear } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setCustomerId(user.id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, phone")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.name) setName(profile.name);
      if (profile?.phone) setPhone(profile.phone);
    }
    loadProfile();
  }, [supabase]);

  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  async function handleSubmit() {
    if (items.length === 0) return;
    if (!name.trim() || !phone.trim()) {
      setError("Preencha seu nome e telefone para enviar o orçamento.");
      return;
    }
    setError(null);
    setSending(true);

    const orderId = crypto.randomUUID();
    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      customer_id: customerId,
      customer_name: name,
      customer_phone: phone,
      notes,
      total_estimated: total,
    });

    if (orderError) {
      setError("Não foi possível enviar o orçamento. Tente novamente.");
      setSending(false);
      return;
    }

    const orderItems = items.map((i) => ({
      order_id: orderId,
      product_id: i.productId,
      quantity: i.quantity,
      unit_price_snapshot: i.unitPrice,
      subtotal: i.quantity * i.unitPrice,
    }));

    await supabase.from("order_items").insert(orderItems);

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const lines = [
      `Olá! Meu nome é ${name}, gostaria de fazer um orçamento na MITIZ:`,
      "",
      ...items.map(
        (i) => `- ${i.name}: ${i.quantity} ${i.unitType} (${formatBRL(i.quantity * i.unitPrice)})`,
      ),
      "",
      `Total estimado: ${formatBRL(total)}`,
      notes ? `Observações: ${notes}` : "",
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join("\n"));

    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    }

    await supabase
      .from("orders")
      .update({ whatsapp_sent_at: new Date().toISOString() })
      .eq("id", orderId);

    clear();
    setSent(true);
    setSending(false);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <Image
          src="/mitiz-simbolo.svg"
          alt=""
          width={64}
          height={78}
          className="mx-auto h-16 w-auto"
        />
        <h1 className="mt-6 text-2xl text-preto-wagyu">Orçamento enviado!</h1>
        <p className="mt-3 text-cinza-ferro">
          Recebemos seu pedido e abrimos o WhatsApp para você confirmar direto
          com a gente. Em breve entraremos em contato.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="eyebrow text-vermelho-brasa">Quase lá</p>
      <h1 className="mt-2 mb-6 text-3xl text-preto-wagyu">Meu Orçamento</h1>

      {items.length === 0 ? (
        <p className="text-cinza-ferro">
          Seu orçamento está vazio. Adicione produtos pelo{" "}
          <a href="/catalogo" className="text-vinho-defumado underline">
            catálogo
          </a>{" "}
          ou pela{" "}
          <a href="/calculadora" className="text-vinho-defumado underline">
            calculadora de churrasco
          </a>
          .
        </p>
      ) : (
        <>
          <ul className="mb-6 flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center justify-between gap-3 rounded-lg border border-cinza-osso bg-marmoreio p-3"
              >
                <div>
                  <p className="font-semibold text-preto-wagyu">{item.name}</p>
                  <p className="text-sm text-cinza-ferro">
                    {formatBRL(item.unitPrice)} / {item.unitType}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <QuantityInput
                    defaultValue={item.quantity}
                    unitType={item.unitType}
                    onChange={(q) => updateQuantity(item.productId, q)}
                  />
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-vinho-defumado hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mb-6 flex items-center justify-between rounded-lg bg-preto-wagyu px-5 py-4 text-branco-sal">
            <span className="eyebrow text-cinza-osso">Total estimado</span>
            <span className="price-tag text-xl">{formatBRL(total)}</span>
          </div>

          <div className="flex flex-col gap-3">
            <input
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded border border-cinza-osso px-3 py-2"
            />
            <input
              placeholder="Seu telefone/WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded border border-cinza-osso px-3 py-2"
            />
            <textarea
              placeholder="Observações (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded border border-cinza-osso px-3 py-2"
            />

            {error && <p className="text-sm text-vermelho-brasa">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={sending}
              className="rounded-full bg-vermelho-brasa px-6 py-3 font-semibold text-branco-sal shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-sangue-nobre disabled:opacity-50"
            >
              {sending ? "Enviando..." : "Enviar orçamento pelo WhatsApp"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
