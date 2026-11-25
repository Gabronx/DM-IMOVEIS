import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { empresa, indexar } from "@/content/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

// Texto sem serifa: Inter (licença livre, SIL OFL; desenho muito próximo do SF Pro).
// Sem pré-carregamento, para não disputar banda com a foto principal.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Título do banner e busca da home (só maiúsculas).
const lemonMilk = localFont({
  src: [
    { path: "../fonts/LemonMilk-Light.woff2", style: "normal", weight: "300" },
    { path: "../fonts/LemonMilk-Regular.woff2", style: "normal", weight: "400" },
    { path: "../fonts/LemonMilk-RegularItalic.woff2", style: "italic", weight: "400" },
  ],
  variable: "--font-lemon",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(empresa.siteUrl),
  title: {
    default: `${empresa.nome} · Imóveis em Curitiba`,
    template: `%s · ${empresa.nome}`,
  },
  description:
    "Consultoria imobiliária em Curitiba. Apartamentos, coberturas e sobrados selecionados com critério, com atendimento próximo do primeiro contato à escritura.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: empresa.nome,
    images: [{ url: "/img/site/hero/imagem.jpg", width: 2880, height: 1645 }],
  },
  // Versão de apresentação fora do Google até NEXT_PUBLIC_INDEXAR=true (ver README).
  robots: indexar ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fafaf8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable} ${lemonMilk.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
