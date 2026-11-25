import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Galeria from "@/components/imovel/Galeria";
import FormInteresse from "@/components/imovel/FormInteresse";
import Compartilhar from "@/components/imovel/Compartilhar";
import MapaLocalizacao from "@/components/imovel/MapaLocalizacao";
import CardImovel from "@/components/imovel/CardImovel";
import { IconArea, IconBanheiro, IconQuarto, IconSuite, IconVaga, IconWhatsApp } from "@/components/ui/Icons";
import { empresa, linkWhatsApp } from "@/content/site";
import {
  formatarPreco,
  getImoveis,
  getImovelPorSlug,
  getSemelhantes,
  urlImovel,
  type Imovel,
} from "@/lib/imoveis";

export async function generateStaticParams() {
  return (await getImoveis()).map((i) => ({ slug: i.slug }));
}

function resumo(i: Imovel) {
  const texto = i.descricao.find((p) => p.length > 60) ?? i.descricao[0] ?? "";
  return texto.length > 155 ? `${texto.slice(0, 152).trimEnd()}…` : texto;
}

function descricaoCurta(i: Imovel) {
  return `${i.tipo} no ${i.bairro}, ${i.cidade}`;
}

export async function generateMetadata({ params }: PageProps<"/imovel/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const achado = await getImovelPorSlug(slug);
  if (!achado) return {};
  const i = achado.imovel;
  const titulo = `${i.titulo} · ${i.bairro}, ${i.cidade}`;
  return {
    title: titulo,
    description: resumo(i),
    alternates: { canonical: urlImovel(i) },
    openGraph: {
      type: "website",
      title: titulo,
      description: resumo(i),
      url: urlImovel(i),
      images: i.fotos.slice(0, 1).map((url) => ({ url, alt: descricaoCurta(i) })),
    },
  };
}

/** Agrupa linhas "- item" / "• item" da descrição em listas. */
function blocosDescricao(paragrafos: string[]) {
  const blocos: ({ tipo: "p"; texto: string } | { tipo: "ul"; itens: string[] })[] = [];
  for (const p of paragrafos) {
    const item = p.match(/^\s*(?:[-•–]|\d+[.)])\s+(.*)$/);
    const ultimo = blocos.at(-1);
    if (item) {
      if (ultimo?.tipo === "ul") ultimo.itens.push(item[1]);
      else blocos.push({ tipo: "ul", itens: [item[1]] });
    } else blocos.push({ tipo: "p", texto: p });
  }
  return blocos;
}

/** Cabeçalho e rodapé aparecem na hora; o conteúdo do imóvel chega logo depois. */
export default function PaginaImovel({ params }: PageProps<"/imovel/[slug]">) {
  return (
    <>
      <Header />
      <Suspense fallback={<EsqueletoImovel />}>
        <ConteudoImovel params={params} />
      </Suspense>
      <div className="mt-24 pb-20 md:mt-36 lg:pb-0">
        <Footer />
      </div>
    </>
  );
}

function EsqueletoImovel() {
  return (
    <main className="container-page pt-20 md:pt-28" aria-busy="true" aria-label="Carregando imóvel">
      <div className="-mx-4 aspect-[4/3] animate-pulse bg-mist md:mx-0 md:aspect-auto md:h-[min(68vh,640px)] md:rounded-[6px]" />
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <div className="h-4 w-40 animate-pulse rounded bg-mist" />
          <div className="h-12 w-4/5 animate-pulse rounded bg-mist" />
          <div className="h-12 w-3/5 animate-pulse rounded bg-mist" />
        </div>
        <div className="hidden h-72 animate-pulse rounded-[6px] bg-mist lg:block" />
      </div>
    </main>
  );
}

async function ConteudoImovel({ params }: { params: PageProps<"/imovel/[slug]">["params"] }) {
  const { slug } = await params;
  const achado = await getImovelPorSlug(slug);
  if (!achado) notFound();
  if (achado.redirecionar) permanentRedirect(urlImovel(achado.imovel));
  const i = achado.imovel;

  const semelhantes = await getSemelhantes(i);
  const url = `${empresa.siteUrl}${urlImovel(i)}`;
  const venda = i.finalidade === "venda";
  const listagem = venda ? "/comprar" : "/alugar";
  const msgWhats = `Olá! Tenho interesse no imóvel cód. ${i.codigo} — ${descricaoCurta(i)}. ${url}`;

  const caracteristicas = [
    i.quartos != null && { Icon: IconQuarto, valor: i.quartos, rotulo: i.quartos === 1 ? "Quarto" : "Quartos" },
    i.suites != null && i.suites > 0 && { Icon: IconSuite, valor: i.suites, rotulo: i.suites === 1 ? "Suíte" : "Suítes" },
    i.banheiros != null && { Icon: IconBanheiro, valor: i.banheiros, rotulo: i.banheiros === 1 ? "Banheiro" : "Banheiros" },
    i.vagas != null && { Icon: IconVaga, valor: i.vagas, rotulo: i.vagas === 1 ? "Vaga" : "Vagas" },
    i.areaUtil != null && { Icon: IconArea, valor: `${i.areaUtil.toLocaleString("pt-BR")} m²`, rotulo: "Área útil" },
    i.areaTotal != null &&
      i.areaTotal !== i.areaUtil && { Icon: IconArea, valor: `${i.areaTotal.toLocaleString("pt-BR")} m²`, rotulo: "Área total" },
  ].filter(Boolean) as { Icon: typeof IconQuarto; valor: string | number; rotulo: string }[];

  const valores = [
    { rotulo: "Condomínio", valor: i.condominio != null ? `${formatarPreco(i.condominio)}/mês` : "Não informado" },
    { rotulo: "IPTU", valor: i.iptu != null ? `${formatarPreco(i.iptu)}/ano` : "Não informado" },
  ];

  const tipoSchema = i.categoria === "Casa" ? "SingleFamilyResidence" : "Apartment";
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: i.titulo,
      description: resumo(i),
      url,
      image: i.fotos.slice(0, 6),
      datePosted: i.atualizadoEm,
      offers: {
        "@type": "Offer",
        price: i.preco ?? undefined,
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        businessFunction: venda ? "https://schema.org/Sell" : "https://schema.org/LeaseOut",
        seller: { "@type": "RealEstateAgent", name: empresa.nome, telephone: `+${empresa.whatsapp}` },
      },
      about: {
        "@type": tipoSchema,
        numberOfRooms: i.quartos ?? undefined,
        numberOfBathroomsTotal: i.banheiros ?? undefined,
        floorSize: i.areaUtil ? { "@type": "QuantitativeValue", value: i.areaUtil, unitCode: "MTK" } : undefined,
        address: {
          "@type": "PostalAddress",
          addressLocality: i.cidade,
          addressRegion: i.uf,
          addressCountry: "BR",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: empresa.siteUrl },
        { "@type": "ListItem", position: 2, name: venda ? "Comprar" : "Alugar", item: `${empresa.siteUrl}${listagem}` },
        { "@type": "ListItem", position: 3, name: i.titulo, item: url },
      ],
    },
  ];

  return (
    <>
      <main id="conteudo" className="pt-20 md:pt-28">
        <div className="container-page">
          <nav aria-label="Trilha de navegação" className="mb-5 hidden text-[0.8125rem] text-graphite md:block">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-ink">
                  Início
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={listagem} className="hover:text-ink">
                  {venda ? "Comprar" : "Alugar"}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`${listagem}?bairro=${encodeURIComponent(i.bairro)}`} className="hover:text-ink">
                  {i.bairro}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink">
                Cód. {i.codigo}
              </li>
            </ol>
          </nav>

          <Galeria fotos={i.fotos} legendas={i.legendas} descricao={descricaoCurta(i)} />

          <div className="mt-8 grid gap-12 md:mt-12 lg:grid-cols-[1fr_22rem] lg:gap-16 xl:grid-cols-[1fr_24rem]">
            {/* ---------- Conteúdo ---------- */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <p className="eyebrow text-gold">
                  {i.tipo} · {venda ? "Venda" : "Locação"}
                </p>
                <Compartilhar titulo={i.titulo} url={url} />
              </div>
              <h1 className="mt-4 max-w-[22ch] font-serif text-[2.25rem] leading-[1.06] text-balance md:text-[3.25rem]">
                {i.titulo}
              </h1>
              <p className="mt-3 text-[1rem] text-graphite">
                {i.bairro}, {i.cidade}/{i.uf} · Cód. {i.codigo}
              </p>

              {/* Preço no celular (no desktop fica no card lateral) */}
              <div className="mt-6 lg:hidden">
                <p className="text-[0.75rem] uppercase tracking-[0.12em] text-graphite">{venda ? "Valor de venda" : "Aluguel"}</p>
                <p className="mt-1 text-[2rem] font-medium tracking-tight">{formatarPreco(i.preco)}</p>
                <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[0.875rem] text-graphite">
                  {valores.map((v) => (
                    <div key={v.rotulo} className="flex gap-1.5">
                      <dt>{v.rotulo}:</dt>
                      <dd className="text-ink">{v.valor}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <section aria-labelledby="carac-titulo" className="mt-10 border-y border-line py-8">
                <h2 id="carac-titulo" className="sr-only">
                  Características
                </h2>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3">
                  {caracteristicas.map(({ Icon, valor, rotulo }) => (
                    <div key={rotulo} className="grid grid-cols-[auto_1fr] items-center gap-x-4">
                      <dt className="col-start-2 row-start-2 mt-1 text-[0.8125rem] text-graphite">{rotulo}</dt>
                      <dd className="col-start-2 row-start-1 text-[1.25rem] font-medium leading-none">{valor}</dd>
                      <dd className="col-start-1 row-span-2 row-start-1" aria-hidden>
                        <Icon className="size-7 text-gold" />
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="desc-titulo" className="mt-12">
                <h2 id="desc-titulo" className="font-serif text-[2rem] leading-tight">
                  Sobre o imóvel
                </h2>
                <div className="mt-5 max-w-[68ch] space-y-4 text-[1.0625rem] leading-[1.75] text-ink/85">
                  {blocosDescricao(i.descricao).map((b, n) =>
                    b.tipo === "p" ? (
                      <p key={n}>{b.texto}</p>
                    ) : (
                      <ul key={n} className="space-y-1.5 pl-1">
                        {b.itens.map((t) => (
                          <li key={t} className="flex gap-3">
                            <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                            {t}
                          </li>
                        ))}
                      </ul>
                    ),
                  )}
                </div>
              </section>

              {i.comodidades.length > 0 && (
                <section aria-labelledby="comod-titulo" className="mt-12">
                  <h2 id="comod-titulo" className="font-serif text-[2rem] leading-tight">
                    Comodidades
                  </h2>
                  <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 text-[0.9375rem] sm:grid-cols-2 xl:grid-cols-3">
                    {i.comodidades.map((c) => (
                      <li key={c} className="flex items-center gap-3 border-b border-line pb-3">
                        <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                        {c}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section aria-labelledby="local-titulo" className="mt-12">
                <h2 id="local-titulo" className="font-serif text-[2rem] leading-tight">
                  Localização
                </h2>
                <p className="mt-2 text-[0.9375rem] text-graphite">
                  {i.bairro}, {i.cidade}/{i.uf}. Localização aproximada; o endereço exato é informado no agendamento da visita.
                </p>
                <div className="mt-5">
                  <MapaLocalizacao lat={i.lat} lng={i.lng} rotulo={`${i.bairro}, ${i.cidade}`} />
                </div>
              </section>

              <section id="interesse" aria-labelledby="form-titulo" className="mt-14 scroll-mt-28 rounded-[6px] bg-mist p-6 md:p-10">
                <p className="eyebrow text-gold">Tenho interesse</p>
                <h2 id="form-titulo" className="mt-3 font-serif text-[2rem] leading-tight">
                  Fale com a consultora sobre este imóvel
                </h2>
                <p className="mt-2 mb-7 text-graphite">Deixe seus dados e a consultora entra em contato com você.</p>
                <FormInteresse codigo={i.codigo} />
              </section>
            </div>

            {/* ---------- Card lateral (desktop) ---------- */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-[6px] border border-line bg-white p-7 shadow-[0_24px_48px_-32px_rgba(3,3,26,0.35)]">
                <p className="text-[0.75rem] uppercase tracking-[0.12em] text-graphite">{venda ? "Valor de venda" : "Aluguel"}</p>
                <p className="mt-1 text-[2.125rem] font-medium leading-tight tracking-tight">{formatarPreco(i.preco)}</p>
                <dl className="mt-5 divide-y divide-line border-y border-line text-[0.9375rem]">
                  {valores.map((v) => (
                    <div key={v.rotulo} className="flex justify-between py-3">
                      <dt className="text-graphite">{v.rotulo}</dt>
                      <dd>{v.valor}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between py-3">
                    <dt className="text-graphite">Código</dt>
                    <dd>{i.codigo}</dd>
                  </div>
                </dl>
                <a
                  href={linkWhatsApp(msgWhats)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[0.9375rem] font-medium text-white transition-colors duration-300 hover:bg-gold"
                >
                  <IconWhatsApp className="size-5" />
                  Conversar no WhatsApp
                </a>
                <a
                  href="#interesse"
                  className="mt-2.5 flex items-center justify-center rounded-full border border-ink/20 py-3.5 text-[0.9375rem] transition-colors hover:border-ink"
                >
                  Agendar uma visita
                </a>
                <p className="mt-6 flex items-center gap-3 border-t border-line pt-5 text-[0.8125rem] text-graphite">
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-gold-soft">
                    <Image src={empresa.avatarConsultora} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block text-ink">{empresa.consultora}</span>
                    {empresa.creci}
                  </span>
                </p>
              </div>
            </aside>
          </div>
        </div>

        {semelhantes.length > 0 && (
          <section aria-labelledby="semelhantes-titulo" className="container-page mt-24 md:mt-36">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="semelhantes-titulo" className="font-serif text-[2.25rem] leading-tight md:text-[3rem]">
                Imóveis semelhantes
              </h2>
              <Link href={listagem} className="link-underline text-[0.875rem]">
                Ver todos
              </Link>
            </div>
            <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {semelhantes.map((s, n) => (
                <li key={s.codigo} data-reveal style={{ "--reveal-offset": `${n * 8}%` } as React.CSSProperties}>
                  <CardImovel imovel={s} formato="paisagem" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* Barra fixa no celular */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[1.0625rem] font-medium leading-tight">{formatarPreco(i.preco)}</p>
          <a href="#interesse" className="text-[0.8125rem] text-graphite underline underline-offset-2">
            Agendar visita
          </a>
        </div>
        <a
          href={linkWhatsApp(msgWhats)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[0.875rem] font-medium text-white"
        >
          <IconWhatsApp className="size-5" />
          WhatsApp
        </a>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
