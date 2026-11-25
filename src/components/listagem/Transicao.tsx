"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useTransition, type ReactNode } from "react";
import { paraQuery, type Filtros } from "@/lib/filtros";

type Ctx = { carregando: boolean; aplicar: (f: Filtros) => void };
const Contexto = createContext<Ctx | null>(null);

/** Compartilha a navegação dos filtros e o estado "carregando" entre painel e resultados. */
export function TransicaoFiltros({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [carregando, iniciar] = useTransition();

  function aplicar(f: Filtros) {
    const qs = paraQuery(f);
    iniciar(() => router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false }));
  }

  return <Contexto.Provider value={{ carregando, aplicar }}>{children}</Contexto.Provider>;
}

export function useFiltros() {
  const c = useContext(Contexto);
  if (!c) throw new Error("useFiltros precisa de <TransicaoFiltros>");
  return c;
}

/** Esmaece os resultados enquanto a nova busca carrega. */
export function AreaResultados({ children }: { children: ReactNode }) {
  const { carregando } = useFiltros();
  return (
    <div
      aria-busy={carregando}
      className={`transition-opacity duration-300 ${carregando ? "pointer-events-none opacity-45" : ""}`}
    >
      {children}
    </div>
  );
}
