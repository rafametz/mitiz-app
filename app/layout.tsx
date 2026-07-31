import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

const outfit = localFont({
  src: "./fonts/Outfit-VariableFont_wght.ttf",
  variable: "--font-outfit",
  weight: "100 900",
  display: "swap",
});

const aleo = localFont({
  src: [
    { path: "./fonts/Aleo-VariableFont_wght.ttf", style: "normal" },
    { path: "./fonts/Aleo-Italic-VariableFont_wght.ttf", style: "italic" },
  ],
  variable: "--font-aleo",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MITIZ Boutique de Carnes",
  description: "Promoções, novidades, calculadora de churrasco e orçamentos da MITIZ Boutique de Carnes.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MITIZ",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .maybeSingle<SiteSettings>();

  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${aleo.variable} h-full antialiased`}
      style={
        {
          "--color-vermelho-brasa": settings?.primary_color,
          "--color-sangue-nobre": settings?.primary_hover_color,
        } as React.CSSProperties
      }
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegister />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
