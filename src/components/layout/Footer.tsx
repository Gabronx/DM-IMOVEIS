import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { IconFacebook, IconInstagram, IconX } from "@/components/ui/Icons";
import Parallax from "@/components/motion/Parallax";
import { BotaoPreferenciasCookies } from "./Analytics";
import { empresa, linkWhatsApp, navegacao } from "@/content/site";

async function anoAtual() {
  "use cache";
  return new Date().getFullYear();
}

const iconesRedes: Record<string, typeof IconX> = { Instagram: IconInstagram, Facebook: IconFacebook, X: IconX };

export default async function Footer() {
  const ano = await anoAtual();
  const { endereco } = empresa;
  return (
    <footer className="relative isolate overflow-hidden bg-[#16130e] text-white">
      <Parallax velocidade={0.2} className="absolute inset-x-0 -top-[20%] -z-10 h-[140%]">
        <Image src="/img/rodape.jpg" alt="" fill sizes="100vw" className="object-cover opacity-60" />
      </Parallax>
      {/* Véu escuro neutro (sem o azul) para o texto branco seguir legível… */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(22,19,14,0.74)_0%,rgba(22,19,14,0.7)_50%,rgba(22,19,14,0.94)_100%)]"
        aria-hidden
      />
      {/* …e um banho de dourado claro bem suave, que só tinge a foto. */}
      <div className="absolute inset-0 -z-10 bg-[#efe2c2] opacity-20 mix-blend-color" aria-hidden />

      <div className="container-page pb-10 pt-20 md:pt-28">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div data-reveal>
            <p className="eyebrow text-white/70">Vamos conversar</p>
            <p className="mt-4 max-w-[18ch] font-display text-[1.625rem] leading-[1.15] tracking-[0.01em] text-balance md:text-[2rem]">
              Vamos encontrar o seu próximo endereço?
            </p>
            <a
              href={linkWhatsApp("Olá! Vim pelo site da DM Consultoria e gostaria de conversar.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[0.875rem] font-medium text-ink transition-colors duration-300 hover:bg-gold hover:text-white"
            >
              Falar com a consultora
            </a>
          </div>

          <div>
            <h2 className="eyebrow text-white/60">Navegue</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {navegacao.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-white/85 transition-colors hover:text-white">
                    {n.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-white/60">Contato</h2>
            <address className="mt-5 space-y-3 text-[0.9375rem] not-italic text-white/85">
              <p>
                {endereco.logradouro}
                <br />
                {endereco.cidade}/{endereco.uf}
              </p>
              <p>
                <a href={`tel:+${empresa.whatsapp}`} className="hover:text-white">
                  {empresa.telefoneExibicao}
                </a>
              </p>
              {empresa.email && (
                <p>
                  <a href={`mailto:${empresa.email}`} className="hover:text-white">
                    {empresa.email}
                  </a>
                </p>
              )}
            </address>
          </div>

          <div>
            <h2 className="eyebrow text-white/60">Redes</h2>
            <p className="mt-5 text-[0.9375rem] text-white/85">{empresa.usuarioRedes}</p>
            <ul className="mt-4 -ml-2.5 flex items-center gap-1">
              {empresa.redes.map((r) => {
                const Icone = iconesRedes[r.nome];
                return (
                  <li key={r.nome}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${r.nome} da ${empresa.consultora}`}
                      className="flex size-10 items-center justify-center text-white/85 transition-colors hover:text-white"
                    >
                      {Icone ? <Icone className="size-5" /> : r.nome}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-white/15 pt-8 text-[0.8125rem] text-white/65 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6 text-white">
            <Logo claro />
          </div>
          <p>
            © {ano} {empresa.nome} · {empresa.creci}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link href="/termos" className="hover:text-white">
                Termos de uso
              </Link>
            </li>
            <li>
              <Link href="/privacidade" className="hover:text-white">
                Privacidade
              </Link>
            </li>
            <li>
              <BotaoPreferenciasCookies className="hover:text-white" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
