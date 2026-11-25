import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import KeystaticApp from "./keystatic";
import { painelAtivo } from "@/lib/painel";

export const metadata: Metadata = {
  title: "Painel de conteúdo",
  robots: { index: false, follow: false },
};

export default function LayoutPainel() {
  if (!painelAtivo) {
    return (
      <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-4 px-6 py-16">
        <p className="eyebrow text-gold">Painel de conteúdo</p>
        <h1 className="font-serif text-[2.5rem] leading-tight">Painel disponível após a configuração</h1>
        <p className="leading-relaxed text-graphite">
          Nesta versão de apresentação, o painel de edição ainda não está conectado. Para editar textos, fotos e
          imóveis direto pelo site publicado, é preciso ligar o painel ao GitHub (passo a passo no README do projeto).
        </p>
        <Link href="/" className="link-underline self-start text-[0.9375rem]">
          Voltar ao site
        </Link>
      </main>
    );
  }
  return (
    <Suspense>
      <KeystaticApp />
    </Suspense>
  );
}
