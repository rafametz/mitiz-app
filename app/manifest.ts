import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MITIZ Boutique de Carnes",
    short_name: "MITIZ",
    description:
      "Promoções, novidades, calculadora de churrasco e orçamentos da MITIZ Boutique de Carnes.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2ECE6",
    theme_color: "#1A1A1A",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
