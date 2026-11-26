"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import { pausarRolagem } from "@/components/motion/SmoothScroll";
import { IconFechar, IconMenu, IconWhatsApp } from "@/components/ui/Icons";
import { empresa, linkWhatsApp, navegacao } from "@/content/site";

/**
 * Cabeçalho fixo. Transparente sobre a foto do hero (`sobreposto`) e
 * sólido depois que a página começa a rolar.
 */
export default function Header({ sobreposto = false }: { sobreposto?: boolean }) {
  const pathname = usePathname();
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 40);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    pausarRolagem(aberto);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto]);

  const transparente = sobreposto && !rolou && !aberto;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow,padding] duration-500 ease-[var(--ease-soft)] ${
        aberto
          ? // Menu do celular aberto: cabeçalho ocupa a tela inteira, fundo sólido e sem a linha de baixo
            "flex h-svh flex-col bg-paper py-3 text-ink lg:h-auto lg:shadow-[0_1px_0_var(--color-line)]"
          : transparente
            ? "bg-transparent py-5 text-white"
            : "bg-paper/92 py-3 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <div className="container-page flex items-center justify-between gap-6">
        <Logo claro={transparente} />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.8125rem] tracking-[0.03em]">
            {navegacao.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={pathname === n.href ? "page" : undefined}
                  className="link-reveal opacity-90 transition-opacity hover:opacity-100"
                >
                  {n.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={linkWhatsApp("Olá! Vim pelo site da DM Consultoria e gostaria de mais informações.")}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-[0.8125rem] transition-colors duration-300 sm:flex ${
              transparente
                ? "border-white/55 hover:bg-white hover:text-ink"
                : "border-ink/20 hover:border-ink hover:bg-ink hover:text-white"
            }`}
          >
            <IconWhatsApp className="size-4" />
            {empresa.telefoneExibicao}
          </a>
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls="menu-movel"
            className="-mr-2 flex size-11 items-center justify-center lg:hidden"
          >
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
            {aberto ? <IconFechar className="size-6" /> : <IconMenu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Menu do celular */}
      <div
        id="menu-movel"
        hidden={!aberto}
        className="min-h-0 flex-1 overflow-y-auto bg-paper lg:hidden"
      >
        <nav aria-label="Menu" className="container-page pb-10 pt-8">
          <ul className="divide-y divide-line border-y border-line">
            {navegacao.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setAberto(false)}
                  className="flex items-center justify-between py-5 font-serif text-[1.75rem]"
                >
                  {n.rotulo}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={linkWhatsApp("Olá! Vim pelo site da DM Consultoria e gostaria de mais informações.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-ink py-4 text-white"
          >
            <IconWhatsApp className="size-5" /> Conversar no WhatsApp
          </a>
          <p className="mt-6 text-center text-sm text-graphite">{empresa.creci}</p>
        </nav>
      </div>
    </header>
  );
}
