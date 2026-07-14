import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import { PromotionCard } from "@/components/PromotionCard";
import { NewsCard } from "@/components/NewsCard";
import { EventCard } from "@/components/EventCard";
import type { Product, Promotion, NewsItem, EventItem } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: featured }, { data: promotions }, { data: news }, { data: events }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .limit(4)
        .returns<Product[]>(),
      supabase
        .from("promotions")
        .select("*")
        .eq("is_active", true)
        .limit(3)
        .returns<Promotion[]>(),
      supabase
        .from("news")
        .select("*")
        .eq("is_active", true)
        .order("published_at", { ascending: false })
        .limit(3)
        .returns<NewsItem[]>(),
      supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .order("event_date", { ascending: true })
        .limit(3)
        .returns<EventItem[]>(),
    ]);

  return (
    <div className="flex flex-col">
      <section className="bg-preto-wagyu px-4 py-16 text-center text-branco-sal">
        <h1 className="text-3xl font-bold sm:text-4xl">MITIZ Boutique de Carnes</h1>
        <p className="mt-3 text-cinza-osso">
          As melhores carnes para o seu churrasco, com pontos e prêmios a cada compra.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/calculadora"
            className="rounded-full bg-vermelho-brasa px-6 py-3 font-semibold hover:bg-sangue-nobre"
          >
            Calcular meu churrasco
          </Link>
          <Link
            href="/catalogo"
            className="rounded-full border border-branco-sal px-6 py-3 font-semibold hover:bg-cinza-ferro"
          >
            Ver catálogo
          </Link>
        </div>
      </section>

      {promotions && promotions.length > 0 && (
        <Section title="Promoções" href="/promocoes">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {promotions.map((p) => (
              <PromotionCard key={p.id} promotion={p} />
            ))}
          </div>
        </Section>
      )}

      {featured && featured.length > 0 && (
        <Section title="Destaques do catálogo" href="/catalogo">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Section>
      )}

      {news && news.length > 0 && (
        <Section title="Novidades" href="/novidades">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {news.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        </Section>
      )}

      {events && events.length > 0 && (
        <Section title="Próximos eventos" href="/eventos">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-preto-wagyu">{title}</h2>
        <Link href={href} className="text-sm text-vinho-defumado hover:underline">
          Ver todos
        </Link>
      </div>
      {children}
    </section>
  );
}
