"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { IconBusca } from "@/components/ui/Icons";
import type { OpcoesBusca } from "@/lib/imoveis";

export const faixasPreco = [
  { valor: "", rotulo: "Qualquer valor" },
  { valor: "0-600000", rotulo: "Até R$ 600 mil" },
  { valor: "600000-1000000", rotulo: "R$ 600 mil a 1 mi" },
  { valor: "1000000-2000000", rotulo: "R$ 1 a 2 mi" },
  { valor: "2000000-", rotulo: "Acima de R$ 2 mi" },
];

type Props = { opcoes: OpcoesBusca };

// Tipografia da busca: Lemon Milk (só maiúsculas). Rótulos em light/cinza claro, valores em regular/cinza escuro.
// O cinza dos rótulos (#767676) é o mais claro que ainda passa no contraste AA sobre branco.
function Campo({ rotulo, id, children, className = "" }: { rotulo: string; id: string; children: ReactNode; className?: string }) {
  return (
    <div className={`relative flex flex-col justify-center border-line bg-white px-5 py-4 transition-colors focus-within:bg-[#f4f4f2] md:border-r md:py-4 ${className}`}>
      <label htmlFor={id} className="font-display text-[0.5625rem] font-light tracking-[0.02em] text-[#767676]">
        {rotulo}
      </label>
      {children}
    </div>
  );
}

const selectCls =
  "busca-select mt-1.5 w-full cursor-pointer appearance-none truncate bg-transparent font-display text-[0.75rem] font-normal tracking-[0.01em] text-[#3a3a3a] outline-none";

/** Busca principal da home. Envia para /comprar ou /alugar com os filtros na URL. */
export default function BuscaHome({ opcoes }: Props) {
  const router = useRouter();
  const id = useId();
  const [finalidade, setFinalidade] = useState<"comprar" | "alugar">("comprar");
  const { cidades, bairros, tipos } = opcoes;

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    // Local vem como "cidade:Curitiba" ou "bairro:Água Verde"
    const [tipoLocal, ...resto] = String(dados.get("local") ?? "").split(":");
    if (resto.length) params.set(tipoLocal, resto.join(":"));
    for (const chave of ["tipo", "quartos"]) {
      const v = String(dados.get(chave) ?? "");
      if (v) params.set(chave, v);
    }
    const [min, max] = String(dados.get("preco") ?? "").split("-"); // ex.: "600000-1000000"
    if (min && min !== "0") params.set("precoMin", min);
    if (max) params.set("precoMax", max);
    const qs = params.toString();
    router.push(`/${finalidade}${qs ? `?${qs}` : ""}`);
  }

  return (
    <form
      onSubmit={enviar}
      role="search"
      aria-label="Buscar imóveis"
      // Sem fundo branco no formulário: cada campo tem o seu. Assim o canto arredondado do botão escuro não deixa um fio branco.
      className="overflow-hidden rounded-[14px] text-ink shadow-[0_24px_50px_-24px_rgba(3,3,26,0.45)] md:grid md:grid-cols-[8.5rem_1.8fr_1fr_1fr_1.5fr_10rem] [&>*]:border-line max-md:[&>div]:border-b md:[&>div]:border-r"
    >
      {/* Comprar / Alugar: centralizados, com uma linha entre eles. Selecionado = regular dourado; o outro = light cinza. */}
      <fieldset className="flex items-stretch border-b bg-white border-line md:flex-col md:justify-center md:border-r md:border-b-0 md:px-2.5">
        <legend className="sr-only">Finalidade</legend>
        {(["comprar", "alugar"] as const).map((f, i) => (
          <label
            key={f}
            className={`relative flex flex-1 cursor-pointer items-center justify-center py-4 font-display text-[0.75rem] tracking-[0.02em] transition-colors md:flex-none md:py-2.5 ${
              finalidade === f ? "font-normal text-gold" : "font-light text-[#767676] hover:text-[#3a3a3a]"
            } ${i === 1 ? "border-l border-line md:border-l-0 md:border-t" : ""}`}
          >
            <input
              type="radio"
              name="finalidade"
              value={f}
              checked={finalidade === f}
              onChange={() => setFinalidade(f)}
              className="peer sr-only"
            />
            <span className="peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-gold">
              {f === "comprar" ? "Comprar" : "Alugar"}
            </span>
          </label>
        ))}
      </fieldset>

      <Campo rotulo="Bairro ou cidade" id={`${id}-local`}>
        <select id={`${id}-local`} name="local" className={selectCls} defaultValue="">
          <option value="">Todos os locais</option>
          <optgroup label="Cidades">
            {cidades.map((c) => (
              <option key={c} value={`cidade:${c}`}>
                {c}
              </option>
            ))}
          </optgroup>
          <optgroup label="Bairros">
            {bairros.map((b) => (
              <option key={`${b.bairro}-${b.cidade}`} value={`bairro:${b.bairro}`}>
                {b.bairro}
              </option>
            ))}
          </optgroup>
        </select>
      </Campo>

      <div className="grid grid-cols-2 md:contents">
        <Campo rotulo="Tipo" id={`${id}-tipo`} className="max-md:border-r">
          <select id={`${id}-tipo`} name="tipo" className={selectCls} defaultValue="">
            <option value="">Todos</option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Campo>
        <Campo rotulo="Quartos" id={`${id}-quartos`}>
          <select id={`${id}-quartos`} name="quartos" className={selectCls} defaultValue="">
            <option value="">Qualquer</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}+ quartos
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <Campo rotulo="Faixa de preço" id={`${id}-preco`}>
        <select id={`${id}-preco`} name="preco" className={selectCls} defaultValue="">
          {faixasPreco.map((f) => (
            <option key={f.valor} value={f.valor}>
              {f.rotulo}
            </option>
          ))}
        </select>
      </Campo>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2.5 bg-ink px-6 py-4 font-display text-[0.875rem] font-normal tracking-[0.01em] text-white transition-colors duration-300 hover:bg-ink-soft md:w-auto"
      >
        <IconBusca className="size-[0.95rem]" />
        Buscar
      </button>
    </form>
  );
}
