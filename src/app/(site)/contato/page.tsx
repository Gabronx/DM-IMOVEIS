import type { Metadata } from "next";
import { Fragment } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CabecalhoPagina from "@/components/layout/CabecalhoPagina";
import FormContato from "@/components/form/FormContato";
import MapaSobDemanda from "@/components/ui/MapaSobDemanda";
import { empresa } from "@/content/site";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a ${empresa.nome}: WhatsApp ${empresa.telefoneExibicao}, ${empresa.endereco.logradouro}, ${empresa.endereco.cidade}/${empresa.endereco.uf}.`,
  alternates: { canonical: "/contato" },
};

export default function Contato() {
  const { endereco } = empresa;
  const enderecoCompleto = `${endereco.logradouro}, ${endereco.cidade} - ${endereco.uf}`;
  const mapa = `https://maps.google.com/maps?q=${encodeURIComponent(enderecoCompleto)}&z=16&hl=pt-BR&output=embed`;

  return (
    <>
      <Header />
      <main id="conteudo" className="pt-28 md:pt-36">
        <div className="container-page">
          <CabecalhoPagina eyebrow="Contato" titulo="Vamos conversar?">
            <p>Tire dúvidas, agende uma visita ou conte o que você procura. O atendimento é feito diretamente pela consultora.</p>
          </CabecalhoPagina>

          <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <div>

              <dl className="divide-y divide-line border-y border-line">
                <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]">
                  <dt className="text-[0.8125rem] uppercase tracking-[0.12em] text-graphite">Telefone</dt>
                  <dd>
                    <a href={`tel:+${empresa.whatsapp}`} className="hover:text-gold">
                      {empresa.telefoneExibicao}
                    </a>
                  </dd>
                </div>
                {empresa.email && (
                  <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]">
                    <dt className="text-[0.8125rem] uppercase tracking-[0.12em] text-graphite">E-mail</dt>
                    <dd>
                      <a href={`mailto:${empresa.email}`} className="hover:text-gold">
                        {empresa.email}
                      </a>
                    </dd>
                  </div>
                )}
                <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]">
                  <dt className="text-[0.8125rem] uppercase tracking-[0.12em] text-graphite">Endereço</dt>
                  <dd>
                    {endereco.logradouro}
                    <br />
                    {endereco.cidade}/{endereco.uf}
                  </dd>
                </div>
                <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]">
                  <dt className="text-[0.8125rem] uppercase tracking-[0.12em] text-graphite">Redes</dt>
                  <dd className="flex flex-wrap gap-x-5 gap-y-1">
                    <span className="text-graphite">{empresa.usuarioRedes}</span>
                    <span className="flex items-center gap-3">
                      {empresa.redes.map((r, i) => (
                        <Fragment key={r.nome}>
                          {i > 0 && (
                            <span className="text-graphite/50" aria-hidden>
                              |
                            </span>
                          )}
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                            {r.nome}
                          </a>
                        </Fragment>
                      ))}
                    </span>
                  </dd>
                </div>
                <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]">
                  <dt className="text-[0.8125rem] uppercase tracking-[0.12em] text-graphite">Registro</dt>
                  <dd>{empresa.creci}</dd>
                </div>
              </dl>

              <MapaSobDemanda
                src={mapa}
                titulo={`Mapa: ${enderecoCompleto}`}
                endereco={enderecoCompleto}
                linkExterno={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`}
                className="mt-8 aspect-[16/10]"
              />
            </div>

            <section aria-labelledby="form-contato" className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[6px] border border-line bg-white p-6 shadow-[0_24px_48px_-32px_rgba(3,3,26,0.3)] md:p-10">
                <h2 id="form-contato" className="mb-8 font-serif text-[2rem] leading-tight">
                  Envie uma mensagem
                </h2>
                <FormContato />
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
