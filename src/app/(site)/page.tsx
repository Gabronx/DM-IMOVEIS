import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Avaliacoes from "@/components/home/Avaliacoes";
import CardImovel from "@/components/imovel/CardImovel";
import Parallax from "@/components/motion/Parallax";
import { IconSeta } from "@/components/ui/Icons";
import RetratoConsultora from "@/components/ui/RetratoConsultora";
import { empresa, linkWhatsApp } from "@/content/site";
import { getHome } from "@/lib/conteudo";
import { getBairros, getDestaques, getImoveis, getOpcoesBusca } from "@/lib/imoveis";

export default async function Home() {
  const home = await getHome();
  const [destaques, bairros, opcoes, todos] = await Promise.all([
    getDestaques(home.destaques),
    getBairros(),
    getOpcoesBusca(),
    getImoveis("venda"),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: empresa.nome,
    url: empresa.siteUrl,
    telephone: `+${empresa.whatsapp}`,
    image: `${empresa.siteUrl}/img/site/hero/imagem.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: empresa.endereco.logradouro,
      addressLocality: empresa.endereco.cidade,
      addressRegion: empresa.endereco.uf,
      addressCountry: "BR",
    },
    sameAs: empresa.redes.map((r) => r.url),
  };

  return (
    <>
      <Header sobreposto />
      <main id="conteudo">
        <Hero opcoes={opcoes} hero={home.hero} />

        {/* ---------------- Em destaque ---------------- */}
        <section aria-labelledby="destaques-titulo" className="container-page pt-16 md:pt-24">
          <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-gold">Seleção da consultora</p>
              <h2 id="destaques-titulo" className="mt-3 font-serif text-[2.5rem] leading-[1.05] md:text-[3.5rem]">
                Imóveis em destaque
              </h2>
            </div>
            <Link href="/comprar" className="link-underline text-[0.875rem]">
              Ver todos os {todos.length} imóveis
            </Link>
          </div>

          <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((imovel, i) => (
              <div key={imovel.codigo} data-reveal style={{ "--reveal-offset": `${(i % 3) * 8}%` } as React.CSSProperties}>
                <CardImovel imovel={imovel} />
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- Por que a DM ---------------- */}
        <section aria-labelledby="porque-titulo" className="container-page pt-16 md:pt-24">
          <div className="grid items-center gap-12 md:grid-cols-[0.9fr_1fr] md:gap-20">
            <div data-reveal>
              <RetratoConsultora />
            </div>

            <div data-reveal style={{ "--reveal-offset": "8%" } as React.CSSProperties}>
              <p className="eyebrow text-gold">{home.porQue.eyebrow}</p>
              <h2 id="porque-titulo" className="mt-4 font-serif text-[2.375rem] leading-[1.06] text-balance md:text-[3.25rem]">
                {home.porQue.titulo}
              </h2>
              <p className="mt-6 max-w-[48ch] text-[1.0625rem] leading-[1.75] text-graphite">{home.porQue.texto}</p>
              <ol className="mt-10 border-t border-line">
                {home.porQue.diferenciais.map((d, i) => (
                  <li key={d} className="flex gap-6 border-b border-line py-5 text-[1rem]">
                    <span className="font-serif text-[1.375rem] leading-none text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {d}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ---------------- Avaliações (logo abaixo da foto da consultora) ---------------- */}
        <Avaliacoes className="container-page pt-12 md:pt-16" />

        {/* ---------------- Bairros ---------------- */}
        <section aria-labelledby="bairros-titulo" className="container-page pt-16 md:pt-24">
          <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:gap-20">
            <div data-reveal>
              <p className="eyebrow text-gold">Onde estamos</p>
              <h2 id="bairros-titulo" className="mt-3 font-serif text-[2.5rem] leading-[1.05] md:text-[3.5rem]">
                Explore por bairro
              </h2>
              <p className="mt-5 max-w-[36ch] text-[1rem] leading-relaxed text-graphite">
                Imóveis selecionados nos bairros mais procurados de Curitiba e da região metropolitana.
              </p>
            </div>
            <ul data-reveal className="border-t border-line sm:columns-2 sm:gap-10">
              {bairros.map((b) => (
                <li key={`${b.bairro}-${b.cidade}`} className="break-inside-avoid border-b border-line">
                  <Link
                    href={`/comprar?bairro=${encodeURIComponent(b.bairro)}`}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span>
                      <span className="block font-serif text-[1.5rem] leading-tight transition-colors duration-300 group-hover:text-gold">
                        {b.bairro}
                      </span>
                      <span className="text-[0.8125rem] text-graphite">
                        {b.cidade} · {b.total} {b.total === 1 ? "imóvel" : "imóveis"}
                      </span>
                    </span>
                    <IconSeta className="size-5 -translate-x-2 text-gold opacity-0 transition-all duration-500 ease-[var(--ease-soft)] group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- Anuncie ---------------- */}
        <section aria-labelledby="anuncie-titulo" className="container-page py-16 md:py-24">
          <div className="relative isolate overflow-hidden rounded-[6px] bg-[#16130e] text-white">
            <Parallax velocidade={0.18} className="absolute inset-x-0 -top-[15%] -z-10 h-[130%]">
              <Image
                src="/img/anuncie.jpg"
                alt=""
                fill
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover opacity-55"
              />
            </Parallax>
            {/* Véu escuro neutro + leve dourado claro (mesmo tratamento do rodapé) */}
            <div
              className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(22,19,14,0.9)_0%,rgba(22,19,14,0.6)_50%,rgba(22,19,14,0.1)_100%)]"
              aria-hidden
            />
            <div className="absolute inset-0 -z-10 bg-[#efe2c2] opacity-20 mix-blend-color" aria-hidden />
            <div data-reveal className="max-w-xl px-6 py-16 md:px-16 md:py-24">
              <p className="eyebrow text-white/75">{home.anuncie.eyebrow}</p>
              <h2 id="anuncie-titulo" className="mt-4 font-serif text-[2.5rem] leading-[1.05] md:text-[3.5rem]">
                {home.anuncie.titulo}
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-white/80">{home.anuncie.texto}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/anuncie"
                  className="rounded-full bg-white px-6 py-3 text-[0.875rem] font-medium text-ink transition-colors duration-300 hover:bg-gold hover:text-white"
                >
                  Anunciar meu imóvel
                </Link>
                <a
                  href={linkWhatsApp("Olá! Gostaria de anunciar meu imóvel com a DM Consultoria.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/50 px-6 py-3 text-[0.875rem] transition-colors duration-300 hover:border-white hover:bg-white/10"
                >
                  Conversar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
