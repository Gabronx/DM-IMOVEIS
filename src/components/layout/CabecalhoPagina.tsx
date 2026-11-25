import type { ReactNode } from "react";

/** Cabeçalho editorial das páginas internas. */
export default function CabecalhoPagina({
  eyebrow,
  titulo,
  children,
}: {
  eyebrow: string;
  titulo: string;
  children?: ReactNode;
}) {
  return (
    <header className="max-w-3xl animate-[surgir_1.1s_var(--ease-soft)_both]">
      <p className="eyebrow text-gold">{eyebrow}</p>
      <h1 className="mt-3 font-serif text-[2.75rem] leading-[1.02] text-balance md:text-[4.25rem]">{titulo}</h1>
      {children && <div className="mt-5 max-w-[56ch] text-[1.0625rem] leading-relaxed text-graphite">{children}</div>}
    </header>
  );
}
