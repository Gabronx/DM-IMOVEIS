import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CabecalhoPagina from "@/components/layout/CabecalhoPagina";
import FormAnuncie from "@/components/form/FormAnuncie";
import Parallax from "@/components/motion/Parallax";
import { IconWhatsApp } from "@/components/ui/Icons";
import { linkWhatsApp } from "@/content/site";
import { getAnuncie } from "@/lib/conteudo";

export const metadata: Metadata = {
  title: "Anuncie seu imóvel",
  description:
    "Venda ou alugue seu imóvel em Curitiba com a DM Consultoria Patrimonial: avaliação, apresentação, visitas e negociação com acompanhamento próximo.",
  alternates: { canonical: "/anuncie" },
};

export default async function Anuncie() {
  const paginaAnuncie = await getAnuncie();
  return (
    <>
      <Header />
      <main id="conteudo" className="pt-28 md:pt-36">
        <div className="container-page">
          <CabecalhoPagina eyebrow="Para proprietários" titulo={paginaAnuncie.titulo}>
            <p>{paginaAnuncie.texto}</p>
          </CabecalhoPagina>

          <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-mist">
                <Parallax velocidade={0.1} className="absolute inset-x-0 -top-[25%] h-[150%]">
                  <Image
                    src="/img/anuncie.jpg"
                    alt="Sala de jantar integrada a um jardim interno, com mesa de madeira e cadeiras"
                    fill
                    sizes="(min-width: 1024px) 40vw, 92vw"
                    className="object-cover"
                    loading="eager"
                  />
                </Parallax>
              </div>

              <h2 className="mt-14 font-serif text-[2rem] leading-tight">Como funciona</h2>
              <ol className="mt-6 border-t border-line">
                {paginaAnuncie.etapas.map((et) => (
                  <li key={et.titulo} data-reveal className="border-b border-line py-5">
                    <div>
                      <p className="font-medium">{et.titulo}</p>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-graphite">{et.texto}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <a
                href={linkWhatsApp("Olá! Gostaria de anunciar meu imóvel com a DM Consultoria.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] link-underline"
              >
                <IconWhatsApp className="size-4" />
                Prefere conversar? Fale pelo WhatsApp
              </a>
            </div>

            <section aria-labelledby="form-anuncie" className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[6px] border border-line bg-white p-6 shadow-[0_24px_48px_-32px_rgba(3,3,26,0.3)] md:p-10">
                <h2 id="form-anuncie" className="font-serif text-[2rem] leading-tight">
                  Conte sobre o seu imóvel
                </h2>
                <p className="mb-8 mt-2 text-graphite">Leva menos de dois minutos.</p>
                <FormAnuncie />
              </div>
            </section>
          </div>
        </div>
      </main>
      <div className="mt-28 md:mt-40">
        <Footer />
      </div>
    </>
  );
}
