import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Parallax from "@/components/motion/Parallax";
import Avaliacoes from "@/components/home/Avaliacoes";
import RetratoConsultora from "@/components/ui/RetratoConsultora";
import { empresa, linkWhatsApp } from "@/content/site";
import { getHome, getSobre } from "@/lib/conteudo";

export const metadata: Metadata = {
  title: "A consultoria",
  description: `Conheça a ${empresa.nome} e a consultora ${empresa.consultora}: atendimento imobiliário próximo, transparente e cuidadoso em Curitiba.`,
  alternates: { canonical: "/sobre" },
};

export default async function Sobre() {
  const [paginaSobre, { servicos }] = await Promise.all([getSobre(), getHome()]);
  return (
    <>
      <Header />
      <main id="conteudo" className="pt-28 md:pt-36">
        {/* ---------- Abertura ---------- */}
        <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
          <header className="animate-[surgir_1.1s_var(--ease-soft)_both]">
            <p className="eyebrow text-gold">A consultoria</p>
            <h1 className="mt-3 font-serif text-[2.75rem] leading-[1.02] text-balance md:text-[4.25rem]">
              {paginaSobre.titulo}
            </h1>
            <p className="mt-6 max-w-[54ch] text-[1.125rem] leading-[1.75] text-graphite">{paginaSobre.introducao}</p>
          </header>

          <RetratoConsultora pagina="sobre" prioridade className="animate-[surgir_1.3s_var(--ease-soft)_0.15s_both]" />
        </div>

        {/* ---------- Imagem com parallax ---------- */}
        <div className="relative mt-24 h-[52vh] min-h-[320px] overflow-hidden md:mt-36 md:h-[70vh]">
          <Parallax velocidade={0.25} className="absolute inset-x-0 -top-[20%] h-[140%]">
            <Image src={paginaSobre.imagemFaixa ?? "/img/site/hero/imagem.jpg"} alt="" fill sizes="100vw" className="object-cover" />
          </Parallax>
        </div>

        {/* ---------- História ---------- */}
        <section aria-labelledby="historia" className="container-page grid gap-10 pt-16 md:grid-cols-[1fr_1.4fr] md:gap-20 md:pt-24">
          <h2 id="historia" data-reveal className="font-serif text-[2.5rem] leading-[1.05] md:text-[3.25rem]">
            {paginaSobre.tituloHistoria}
          </h2>
          <div data-reveal className="space-y-6 text-[1.0625rem] leading-[1.8] text-graphite">
            {paginaSobre.historia.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        {/* ---------- Serviços ---------- */}
        <section aria-labelledby="servicos" className="container-page pt-16 md:pt-24">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-20">
            <h2 id="servicos" data-reveal className="font-serif text-[2.5rem] leading-[1.05] md:order-2 md:text-right md:text-[3.25rem]">
              O que fazemos
            </h2>
            <ul className="border-t border-line md:order-1">
              {servicos.map((s) => (
                <li key={s.titulo} data-reveal className="grid gap-2 border-b border-line py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
                  <h3 className="font-serif text-[1.5rem] leading-tight">{s.titulo}</h3>
                  <p className="leading-relaxed text-graphite">{s.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Avaliacoes />

        {/* ---------- Chamada ---------- */}
        <section className="container-page">
          <div data-reveal className="flex flex-col items-start gap-8 border-t border-line pt-16 md:flex-row md:items-end md:justify-between">
            <p className="font-serif text-[2.5rem] leading-[1.05] md:text-[3.25rem]">
              {/* Duas linhas no computador; no celular quebra naturalmente */}
              <span className="md:block md:whitespace-nowrap">Vamos conversar sobre</span>{" "}
              <span className="md:block md:whitespace-nowrap">o seu próximo passo?</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={linkWhatsApp("Olá! Vim pela página da consultoria e gostaria de conversar.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-ink px-6 py-3 text-[0.875rem] font-medium text-white transition-colors duration-300 hover:bg-gold"
              >
                Falar com a consultora
              </a>
              <Link
                href="/comprar"
                className="rounded-full border border-ink/20 px-6 py-3 text-[0.875rem] transition-colors hover:border-ink"
              >
                Ver imóveis
              </Link>
            </div>
          </div>
        </section>
      </main>
      <div className="mt-28 md:mt-40">
        <Footer />
      </div>
    </>
  );
}
