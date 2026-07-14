import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${aleo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
