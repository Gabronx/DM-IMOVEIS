"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { IconFechar } from "@/components/ui/Icons";
import { useFiltros } from "./Transicao";
import { pausarRolagem } from "@/components/motion/SmoothScroll";
import {
  filtrosAtivos,
  opcoesArea,
  opcoesPreco,
  ordens,
  precoCurto,
  type Filtros,
  type Ordem,
} from "@/lib/filtros";
import type { OpcoesBusca } from "@/lib/imoveis";

const selectCls =
  "w-full cursor-pointer appearance-none rounded-[6px] border border-line bg-white py-2 pl-3 pr-9 text-[0.9375rem] text-ink transition-colors hover:border-graphite/50 focus-visible:border-gold " +
  "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2303031a%22 stroke-width=%221.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:14px] bg-[right_0.75rem_center] bg-no-repeat";

// Grupos sem linhas divisórias: o título fica colado ao seu conteúdo (8 px) e longe do grupo de cima (20 px).
const grupoCls = "pt-5 first:pt-0";
const tituloCls = "mb-2 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-graphite";
// legend de fieldset ignora margens/padding normais; flutuando, ela se comporta como um título comum.
const legendaCls = `float-left w-full ${tituloCls}`;

function Grupo({ titulo, children, htmlFor }: { titulo: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className={grupoCls}>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={`block ${tituloCls}`}>
          {titulo}
        </label>
      ) : (
        <p className={tituloCls}>{titulo}</p>
      )}
      {children}
    </div>
  );
}

/** Botões "Qualquer · 1+ · 2+ · 3+ · 4+" */
function Pilulas({
  legenda,
  nome,
  valor,
  onChange,
}: {
  legenda: string;
  nome: string;
  valor?: number;
  onChange: (v?: number) => void;
}) {
  const opcoes = [undefined, 1, 2, 3, 4];
  return (
    <fieldset className={grupoCls}>
      <legend className={legendaCls}>{legenda}</legend>
      <div className="clear-both flex flex-wrap gap-1.5">
        {opcoes.map((o) => {
          const ativo = valor === o;
          return (
            <label
              key={o ?? 0}
              className={`relative cursor-pointer rounded-full border px-2.5 py-1.5 text-[0.8125rem] transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
                ativo ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-graphite/60"
              }`}
            >
              <input
                type="radio"
                name={nome}
                value={o ?? ""}
                aria-label={o === undefined ? `${legenda}: qualquer` : `${legenda}: ${o} ou mais`}
                checked={ativo}
                onChange={() => onChange(o)}
                className="sr-only"
              />
              {o === undefined ? "Qualquer" : `${o}+`}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

type Props = {
  filtros: Filtros;
  opcoes: OpcoesBusca;
  total: number;
};

export default function PainelFiltros({ filtros, opcoes, total }: Props) {
  const { aplicar } = useFiltros();
  const [aberto, setAberto] = useState(false);
  const id = useId();
  const ativos = filtrosAtivos(filtros);

  const mudar = (parcial: Partial<Filtros>) => aplicar({ ...filtros, ...parcial });
  const num = (v: string) => (v ? Number(v) : undefined);

  const bairros = opcoes.bairros.filter((b) => !filtros.cidade || b.cidade === filtros.cidade);

  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", esc);
    pausarRolagem(true);
    return () => {
      window.removeEventListener("keydown", esc);
      pausarRolagem(false);
    };
  }, [aberto]);

  return (
    <>
      {/* Barra do celular: botão de filtros + ordenação */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-expanded={aberto}
          aria-controls={`${id}-painel`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ink py-2.5 text-[0.875rem]"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M4 7h10m4 0h2M4 17h4m4 0h8M14 5v4M8 15v4" />
          </svg>
          Filtros{ativos.length > 0 && ` (${ativos.length})`}
        </button>
        <Ordenacao valor={filtros.ordem} onChange={(ordem) => mudar({ ordem })} compacto />
      </div>

      <div
        id={`${id}-painel`}
        role={aberto ? "dialog" : undefined}
        aria-modal={aberto || undefined}
        aria-label="Filtros"
        data-lenis-prevent
        className={`${
          aberto ? "fixed inset-0 z-[60] flex flex-col bg-paper" : "hidden"
        } lg:inset-auto lg:top-24 lg:z-auto lg:block lg:bg-transparent lg:[@media(min-height:48rem)]:sticky`}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-4 lg:hidden">
          <p className="font-serif text-[1.5rem]">Filtros</p>
          <button type="button" onClick={() => setAberto(false)} className="-mr-2 flex size-11 items-center justify-center">
            <IconFechar className="size-6" />
            <span className="sr-only">Fechar filtros</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-5 lg:overflow-visible lg:px-0 lg:pt-0">
          <Grupo titulo="Cidade" htmlFor={`${id}-cidade`}>
            <select
              id={`${id}-cidade`}
              className={selectCls}
              value={filtros.cidade ?? ""}
              onChange={(e) => mudar({ cidade: e.target.value || undefined, bairro: undefined })}
            >
              <option value="">Todas</option>
              {opcoes.cidades.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Grupo>

          <Grupo titulo="Bairro" htmlFor={`${id}-bairro`}>
            <select
              id={`${id}-bairro`}
              className={selectCls}
              value={filtros.bairro ?? ""}
              onChange={(e) => mudar({ bairro: e.target.value || undefined })}
            >
              <option value="">Todos</option>
              {bairros.map((b) => (
                <option key={`${b.bairro}-${b.cidade}`} value={b.bairro}>
                  {b.bairro}
                  {!filtros.cidade && b.cidade !== "Curitiba" ? ` (${b.cidade})` : ""}
                </option>
              ))}
            </select>
          </Grupo>

          <Grupo titulo="Tipo de imóvel" htmlFor={`${id}-tipo`}>
            <select
              id={`${id}-tipo`}
              className={selectCls}
              value={filtros.tipo ?? ""}
              onChange={(e) => mudar({ tipo: e.target.value || undefined })}
            >
              <option value="">Todos</option>
              {opcoes.tipos.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Grupo>

          <Pilulas legenda="Quartos" nome={`${id}-q`} valor={filtros.quartos} onChange={(quartos) => mudar({ quartos })} />
          <Pilulas legenda="Suítes" nome={`${id}-s`} valor={filtros.suites} onChange={(suites) => mudar({ suites })} />
          <Pilulas legenda="Vagas" nome={`${id}-v`} valor={filtros.vagas} onChange={(vagas) => mudar({ vagas })} />

          <fieldset className={grupoCls}>
            <legend className={legendaCls}>Faixa de preço</legend>
            <div className="clear-both grid grid-cols-2 gap-2">
              <select
                aria-label="Preço mínimo"
                className={selectCls}
                value={filtros.precoMin ?? ""}
                onChange={(e) => mudar({ precoMin: num(e.target.value) })}
              >
                <option value="">Mínimo</option>
                {opcoesPreco.map((v) => (
                  <option key={v} value={v} disabled={!!filtros.precoMax && v >= filtros.precoMax}>
                    {precoCurto(v)}
                  </option>
                ))}
              </select>
              <select
                aria-label="Preço máximo"
                className={selectCls}
                value={filtros.precoMax ?? ""}
                onChange={(e) => mudar({ precoMax: num(e.target.value) })}
              >
                <option value="">Máximo</option>
                {opcoesPreco.map((v) => (
                  <option key={v} value={v} disabled={!!filtros.precoMin && v <= filtros.precoMin}>
                    {precoCurto(v)}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <fieldset className={grupoCls}>
            <legend className={legendaCls}>Área útil</legend>
            <div className="clear-both grid grid-cols-2 gap-2">
              <select
                aria-label="Área mínima"
                className={selectCls}
                value={filtros.areaMin ?? ""}
                onChange={(e) => mudar({ areaMin: num(e.target.value) })}
              >
                <option value="">Mínima</option>
                {opcoesArea.map((v) => (
                  <option key={v} value={v} disabled={!!filtros.areaMax && v >= filtros.areaMax}>
                    {v} m²
                  </option>
                ))}
              </select>
              <select
                aria-label="Área máxima"
                className={selectCls}
                value={filtros.areaMax ?? ""}
                onChange={(e) => mudar({ areaMax: num(e.target.value) })}
              >
                <option value="">Máxima</option>
                {opcoesArea.map((v) => (
                  <option key={v} value={v} disabled={!!filtros.areaMin && v <= filtros.areaMin}>
                    {v} m²
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          {ativos.length > 0 && (
            <button
              type="button"
              onClick={() => aplicar({ ordem: filtros.ordem })}
              className="link-underline mt-5 mb-6 hidden text-[0.875rem] text-graphite lg:inline"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>

        {/* Rodapé da gaveta no celular */}
        <div className="flex gap-3 border-t border-line bg-paper px-4 py-4 lg:hidden">
          <button
            type="button"
            onClick={() => aplicar({ ordem: filtros.ordem })}
            disabled={ativos.length === 0}
            className="rounded-full border border-line px-5 py-3 text-[0.875rem] disabled:opacity-40"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={() => setAberto(false)}
            className="flex-1 rounded-full bg-ink py-3 text-[0.875rem] font-medium text-white"
          >
            Ver {total} {total === 1 ? "imóvel" : "imóveis"}
          </button>
        </div>
      </div>
    </>
  );
}

export function Ordenacao({
  valor,
  onChange,
  compacto = false,
}: {
  valor: Ordem;
  onChange: (o: Ordem) => void;
  compacto?: boolean;
}) {
  const id = useId();
  return (
    <div className={`flex items-center gap-2 ${compacto ? "flex-1" : ""}`}>
      <label htmlFor={id} className={compacto ? "sr-only" : "whitespace-nowrap text-[0.8125rem] text-graphite"}>
        Ordenar por
      </label>
      <select
        id={id}
        value={valor}
        onChange={(e) => onChange(e.target.value as Ordem)}
        className={`${selectCls} ${compacto ? "rounded-full !border-ink py-2.5 text-[0.875rem]" : "w-auto"}`}
      >
        {ordens.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Ordenação + chips de filtros ativos (desktop) */
export function BarraResultados({ filtros, total, rotuloTotal }: { filtros: Filtros; total: number; rotuloTotal: string }) {
  const { aplicar } = useFiltros();
  const ativos = filtrosAtivos(filtros);

  function remover(chaves: (keyof Filtros)[]) {
    const novo = { ...filtros };
    for (const k of chaves) if (k !== "ordem") delete novo[k];
    aplicar(novo);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <p className="text-[0.9375rem]" aria-live="polite">
          <strong className="font-semibold">{total}</strong> {rotuloTotal}
        </p>
        <div className="hidden lg:block">
          <Ordenacao valor={filtros.ordem} onChange={(ordem) => aplicar({ ...filtros, ordem })} />
        </div>
      </div>
      {ativos.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Filtros ativos">
          {ativos.map((c) => (
            <li key={c.rotulo}>
              <button
                type="button"
                onClick={() => remover(c.chave)}
                className="group flex items-center gap-1.5 rounded-full bg-gold-soft py-1.5 pl-3.5 pr-2.5 text-[0.8125rem] text-gold-deep transition-colors hover:bg-gold hover:text-white"
              >
                {c.rotulo}
                <IconFechar className="size-3.5" />
                <span className="sr-only">Remover filtro</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
