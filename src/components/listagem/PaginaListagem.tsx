import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CardImovel from "@/components/imovel/CardImovel";
import PainelFiltros, { BarraResultados } from "./PainelFiltros";
import { AreaResultados, TransicaoFiltros } from "./Transicao";
import BotaoLimpar from "./BotaoLimpar";
import { linkWhatsApp } from "@/content/site";
import { aplicarFiltros, lerFiltros } from "@/lib/filtros";
import { getImoveis, getOpcoesBusca, type Finalidade } from "@/lib/imoveis";

type SP = Promise<Record<string, string | string[] | undefined>>;

const textos = {
  venda: {
    eyebrow: "Comprar",
    titulo: "Imóveis à venda",
    sub: "Apartamentos, coberturas e sobrados selecionados em Curitiba e região.",
    singular: "imóvel à venda",
    plural: "imóveis à venda",
  },
  aluguel: {
    eyebrow: "Alugar",
    titulo: "Imóveis para alugar",
    sub: "Imóveis para locação em Curitiba e região, com contrato e atendimento acompanhados de perto.",
    singular: "imóvel para alugar",
    plural: "imóveis para alugar",
  },
};

export default function PaginaListagem({ finalidade, searchParams }: { finalidade: Finalidade; searchParams: SP }) {
  const t = textos[finalidade];
  return (
    <>
      <Header />
      <main id="conteudo" className="pt-28 md:pt-36">
        <div className="container-page">
          <header className="max-w-3xl animate-[surgir_1.1s_var(--ease-soft)_both]">
            <p className="eyebrow text-gold">{t.eyebrow}</p>
            <h1 className="mt-3 font-serif text-[2.75rem] leading-[1.02] md:text-[4.25rem]">{t.titulo}</h1>
            <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-graphite">{t.sub}</p>
          </header>

          <Suspense fallback={<Esqueleto />}>
            <Resultados finalidade={finalidade} searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
      <div className="mt-28 md:mt-40">
        <Footer />
      </div>
    </>
  );
}

async function Resultados({ finalidade, searchParams }: { finalidade: Finalidade; searchParams: SP }) {
  const [sp, base, opcoes] = await Promise.all([searchParams, getImoveis(finalidade), getOpcoesBusca()]);
  const filtros = lerFiltros(sp, opcoes.cidades);
  const lista = aplicarFiltros([...base], filtros);
  const t = textos[finalidade];

  if (base.length === 0) return <SemImoveis finalidade={finalidade} />;

  return (
    <TransicaoFiltros>
      <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-[18rem_1fr] lg:gap-14">
        <aside aria-label="Filtros da busca">
          <PainelFiltros filtros={filtros} opcoes={opcoes} total={lista.length} />
        </aside>

        <section aria-labelledby="resultados-titulo" className="min-w-0 lg:pt-5">
          <h2 id="resultados-titulo" className="sr-only">
            Resultados da busca
          </h2>
          <BarraResultados
            filtros={filtros}
            total={lista.length}
            rotuloTotal={lista.length === 1 ? t.singular : t.plural}
          />
          <AreaResultados>
            {lista.length > 0 ? (
              <ul className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 2xl:grid-cols-3">
                {lista.map((imovel, i) => (
                  <li
                    key={imovel.codigo}
                    data-reveal
                    style={{ "--reveal-offset": `${(i % 2) * 8}%` } as React.CSSProperties}
                  >
                    <CardImovel imovel={imovel} formato="paisagem" prioridade={i < 2} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-8 rounded-[6px] border border-line bg-white px-6 py-16 text-center md:px-16">
                <p className="font-serif text-[2rem] leading-tight">Nenhum imóvel com esses filtros</p>
                <p className="mx-auto mt-3 max-w-[44ch] text-graphite">
                  Tente ampliar a busca ou fale com a consultora: ela pode encontrar opções que ainda não estão no site.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <BotaoLimpar ordem={filtros.ordem} />
                  <a
                    href={linkWhatsApp("Olá! Estou procurando um imóvel e não encontrei no site. Pode me ajudar?")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-ink/20 px-6 py-3 text-[0.875rem] transition-colors hover:border-ink"
                  >
                    Falar com a consultora
                  </a>
                </div>
              </div>
            )}
          </AreaResultados>
        </section>
      </div>
    </TransicaoFiltros>
  );
}

function SemImoveis({ finalidade }: { finalidade: Finalidade }) {
  const aluguel = finalidade === "aluguel";
  return (
    <div className="mt-12 grid overflow-hidden rounded-[6px] border border-line bg-white md:mt-16 md:grid-cols-[1.2fr_1fr]">
      <div className="px-6 py-14 md:px-14 md:py-20">
        <p className="eyebrow text-gold">Em breve</p>
        <h2 className="mt-4 font-serif text-[2.25rem] leading-[1.08] md:text-[2.75rem]">
          {aluguel ? "Novos imóveis para locação estão a caminho." : "Novos imóveis à venda estão a caminho."}
        </h2>
        <p className="mt-5 max-w-[46ch] leading-relaxed text-graphite">
          No momento não há imóveis {aluguel ? "para alugar" : "à venda"} publicados. Conte o que você procura e
          avisamos assim que surgir uma opção com o seu perfil.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href={linkWhatsApp(
              `Olá! Estou procurando um imóvel para ${aluguel ? "alugar" : "comprar"}. Podem me avisar quando surgir uma opção?`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-6 py-3 text-[0.875rem] font-medium text-white transition-colors duration-300 hover:bg-gold"
          >
            Quero ser avisado
          </a>
          <Link
            href="/anuncie"
            className="rounded-full border border-ink/20 px-6 py-3 text-[0.875rem] transition-colors hover:border-ink"
          >
            {aluguel ? "Anunciar para locação" : "Anunciar meu imóvel"}
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-4 border-t border-line bg-mist px-6 py-12 md:border-l md:border-t-0 md:px-12">
        <p className="text-[0.75rem] font-medium uppercase tracking-[0.12em] text-graphite">Enquanto isso</p>
        <Link href={aluguel ? "/comprar" : "/alugar"} className="group flex items-center justify-between gap-4 border-b border-line pb-4">
          <span className="font-serif text-[1.625rem] transition-colors group-hover:text-gold">
            {aluguel ? "Ver imóveis à venda" : "Ver imóveis para alugar"}
          </span>
          <span aria-hidden className="text-gold transition-transform duration-500 group-hover:translate-x-1">→</span>
        </Link>
        <Link href="/sobre" className="group flex items-center justify-between gap-4 border-b border-line pb-4">
          <span className="font-serif text-[1.625rem] transition-colors group-hover:text-gold">Conhecer a consultoria</span>
          <span aria-hidden className="text-gold transition-transform duration-500 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
}

function Esqueleto() {
  return (
    <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-[18rem_1fr] lg:gap-14" aria-hidden>
      <div className="hidden space-y-4 lg:block">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-[6px] bg-mist" />
        ))}
      </div>
      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i}>
            <div className="aspect-[4/3] animate-pulse rounded-[3px] bg-mist" />
            <div className="mt-5 h-4 w-1/3 animate-pulse rounded bg-mist" />
            <div className="mt-3 h-6 w-4/5 animate-pulse rounded bg-mist" />
          </div>
        ))}
      </div>
    </div>
  );
}
