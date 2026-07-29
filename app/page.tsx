import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import { PromotionCard } from "@/components/PromotionCard";
import { NewsCard } from "@/components/NewsCard";
import { EventCard } from "@/components/EventCard";
import { buildActivePromotionMap, isPromotionActive } from "@/lib/promotions";
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

  const activePromotions = (promotions ?? []).filter(isPromotionActive);
  const promotionMap = buildActivePromotionMap(activePromotions);

  return (
    <div className="flex flex-col">
      <section className="relative flex h-[520px] items-center overflow-hidden sm:h-[600px]">
        <Image
          src="/hero-carne.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-preto-wagyu/95 via-preto-wagyu/60 to-preto-wagyu/10" />

        <div className="relative mx-auto w-full max-w-5xl px-4">
          <h1 className="text-3xl font-bold italic leading-[1.05] text-branco-sal sm:whitespace-nowrap sm:text-5xl md:text-6xl">
            Tudo para o seu churrasco
            <br />
            em um só lugar!
          </h1>
          <p className="mt-4 max-w-md text-cinza-osso">
            Carnes selecionadas, qualidade garantida e sabor que você sente em
            cada detalhe.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/calculadora"
              className="rounded-full bg-vermelho-brasa px-6 py-3 font-semibold text-branco-sal shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-sangue-nobre"
            >
              Calcular meu churrasco
            </Link>
            <Link
              href="/catalogo"
              className="rounded-full border border-cinza-osso px-6 py-3 font-semibold text-branco-sal hover:border-branco-sal"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>

      {activePromotions.length > 0 && (
        <Section title="Promoções" href="/promocoes">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {activePromotions.slice(0, 3).map((p) => (
              <PromotionCard key={p.id} promotion={p} />
            ))}
          </div>
        </Section>
      )}

      {featured && featured.length > 0 && (
        <Section title="Destaques do catálogo" href="/catalogo">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} promotion={promotionMap.get(p.id)} />
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
