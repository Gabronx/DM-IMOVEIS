"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

/** Peças reutilizáveis dos formulários (rótulos, erros, LGPD, antispam). */

export const campoCls =
  "mt-1.5 w-full rounded-[6px] border border-line bg-white px-3.5 py-3 text-[0.9375rem] text-ink transition-colors placeholder:text-graphite/60 hover:border-graphite/50 focus-visible:border-gold aria-[invalid=true]:border-red-700";

export const selectCls =
  `${campoCls} cursor-pointer appearance-none pr-10 ` +
  "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2303031a%22 stroke-width=%221.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat";

export function Campo({
  id,
  rotulo,
  erro,
  opcional,
  children,
}: {
  id: string;
  rotulo: string;
  erro?: string;
  opcional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[0.875rem]">
        {rotulo} {opcional && <span className="text-graphite">(opcional)</span>}
      </label>
      {children}
      {erro && (
        <p id={`${id}-erro`} className="mt-1.5 text-[0.8125rem] text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}

/** Atributos de acessibilidade para um campo com possível erro. */
export const a11y = (id: string, erro?: string) => ({
  id,
  "aria-invalid": !!erro,
  "aria-describedby": erro ? `${id}-erro` : undefined,
});

export function Consentimento({ id, erro, texto }: { id: string; erro?: string; texto: string }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-[0.8125rem] leading-relaxed text-graphite">
        <input
          type="checkbox"
          name="consentimento"
          {...a11y(id, erro)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--color-gold)]"
        />
        <span>
          {texto}, conforme a{" "}
          <Link href="/privacidade" className="text-ink underline underline-offset-2">
            Política de privacidade
          </Link>
          .
        </span>
      </label>
      {erro && (
        <p id={`${id}-erro`} className="mt-1.5 text-[0.8125rem] text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}

/** Campo invisível que só robôs preenchem. */
export function Honeypot() {
  return (
    <div className="absolute -left-[9999px]" aria-hidden>
      <label>
        Site <input type="text" name="site" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/**
 * Envolve a ação do formulário anexando o horário em que ele apareceu
 * (antispam por tempo mínimo, conferido no servidor).
 */
export function useAntispam(acao: (dados: FormData) => void) {
  const inicio = useRef(0);
  useEffect(() => {
    inicio.current = Date.now();
  }, []);
  return (dados: FormData) => {
    dados.set("inicio", String(inicio.current));
    acao(dados);
  };
}

export function Sucesso({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div role="status" className="rounded-[6px] border border-line bg-white p-8 text-center md:p-12">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold-soft text-gold">
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </span>
      <p className="mt-5 font-serif text-[1.875rem] leading-tight">{titulo}</p>
      <p className="mx-auto mt-3 max-w-[40ch] text-graphite">{texto}</p>
    </div>
  );
}

export function AlertaErro({ texto }: { texto?: string }) {
  if (!texto) return null;
  return (
    <p role="alert" className="rounded-[6px] bg-red-50 px-4 py-3 text-[0.875rem] text-red-800">
      {texto}
    </p>
  );
}

export function BotaoEnviar({ enviando, texto = "Enviar" }: { enviando: boolean; texto?: string }) {
  return (
    <button
      type="submit"
      disabled={enviando}
      className="w-full rounded-full bg-ink py-3.5 text-[0.9375rem] font-medium text-white transition-colors duration-300 hover:bg-gold disabled:opacity-60"
    >
      {enviando ? "Enviando…" : texto}
    </button>
  );
}
