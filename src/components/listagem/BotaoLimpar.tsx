"use client";

import { useFiltros } from "./Transicao";
import type { Ordem } from "@/lib/filtros";

export default function BotaoLimpar({ ordem }: { ordem: Ordem }) {
  const { aplicar } = useFiltros();
  return (
    <button
      type="button"
      onClick={() => aplicar({ ordem })}
      className="rounded-full bg-ink px-6 py-3 text-[0.875rem] font-medium text-white transition-colors duration-300 hover:bg-gold"
    >
      Limpar filtros
    </button>
  );
}
