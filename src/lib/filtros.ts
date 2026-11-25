/**
 * Filtros da listagem. Tudo vive na URL (?bairro=Água Verde&quartos=3...),
 * então qualquer busca pode ser compartilhada como link.
 */
import type { Imovel } from "./imoveis";

export const ordens = [
  { valor: "recentes", rotulo: "Mais recentes" },
  { valor: "menor-preco", rotulo: "Menor preço" },
  { valor: "maior-preco", rotulo: "Maior preço" },
  { valor: "maior-area", rotulo: "Maior área" },
] as const;

export type Ordem = (typeof ordens)[number]["valor"];

export type Filtros = {
  cidade?: string;
  bairro?: string;
  tipo?: string;
  quartos?: number;
  suites?: number;
  vagas?: number;
  precoMin?: number;
  precoMax?: number;
  areaMin?: number;
  areaMax?: number;
  ordem: Ordem;
};

export const opcoesPreco = [300_000, 500_000, 750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000];
export const opcoesArea = [50, 80, 100, 150, 200, 300, 400];

type Params = Record<string, string | string[] | undefined>;

function texto(v: string | string[] | undefined) {
  const s = Array.isArray(v) ? v[0] : v;
  return s?.trim() || undefined;
}
function numero(v: string | string[] | undefined) {
  const s = texto(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function lerFiltros(sp: Params, cidadesConhecidas: string[] = []): Filtros {
  let cidade = texto(sp.cidade);
  let bairro = texto(sp.bairro);
  // Compatibilidade: ?local=X (cidade ou bairro)
  const local = texto(sp.local);
  if (local && !cidade && !bairro) {
    if (cidadesConhecidas.includes(local)) cidade = local;
    else bairro = local;
  }
  const ordem = texto(sp.ordem);
  return {
    cidade,
    bairro,
    tipo: texto(sp.tipo),
    quartos: numero(sp.quartos),
    suites: numero(sp.suites),
    vagas: numero(sp.vagas),
    precoMin: numero(sp.precoMin),
    precoMax: numero(sp.precoMax),
    areaMin: numero(sp.areaMin),
    areaMax: numero(sp.areaMax),
    ordem: ordens.some((o) => o.valor === ordem) ? (ordem as Ordem) : "recentes",
  };
}

export function paraQuery(f: Filtros) {
  const p = new URLSearchParams();
  const chaves: (keyof Filtros)[] = [
    "cidade", "bairro", "tipo", "quartos", "suites", "vagas",
    "precoMin", "precoMax", "areaMin", "areaMax",
  ];
  for (const k of chaves) {
    const v = f[k];
    if (v !== undefined && v !== "") p.set(k, String(v));
  }
  if (f.ordem !== "recentes") p.set("ordem", f.ordem);
  return p.toString();
}

const pelo = (v: number | null, min?: number) => min === undefined || (v ?? 0) >= min;

export function aplicarFiltros(lista: Imovel[], f: Filtros) {
  const area = (i: Imovel) => i.areaUtil ?? i.areaTotal;
  const resultado = lista.filter(
    (i) =>
      (!f.cidade || i.cidade === f.cidade) &&
      (!f.bairro || i.bairro === f.bairro) &&
      (!f.tipo || i.tipo === f.tipo) &&
      pelo(i.quartos, f.quartos) &&
      pelo(i.suites, f.suites) &&
      pelo(i.vagas, f.vagas) &&
      (f.precoMin === undefined || (i.preco ?? 0) >= f.precoMin) &&
      (f.precoMax === undefined || (i.preco ?? Infinity) <= f.precoMax) &&
      (f.areaMin === undefined || (area(i) ?? 0) >= f.areaMin) &&
      (f.areaMax === undefined || (area(i) ?? Infinity) <= f.areaMax),
  );

  const porPreco = (i: Imovel) => i.preco ?? Number.MAX_SAFE_INTEGER;
  switch (f.ordem) {
    case "menor-preco":
      return resultado.sort((a, b) => porPreco(a) - porPreco(b));
    case "maior-preco":
      return resultado.sort((a, b) => (b.preco ?? 0) - (a.preco ?? 0));
    case "maior-area":
      return resultado.sort((a, b) => (area(b) ?? 0) - (area(a) ?? 0));
    default:
      // Imóveis do painel não têm data: entram como os mais recentes
      return resultado.sort((a, b) => (b.atualizadoEm || "9").localeCompare(a.atualizadoEm || "9"));
  }
}

const compacto = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });
export const precoCurto = (v: number) => `R$ ${compacto.format(v)}`;

/** Lista de filtros ativos para os "chips" removíveis. */
export function filtrosAtivos(f: Filtros) {
  const chips: { chave: (keyof Filtros)[]; rotulo: string }[] = [];
  if (f.cidade) chips.push({ chave: ["cidade", "bairro"], rotulo: f.cidade });
  if (f.bairro) chips.push({ chave: ["bairro"], rotulo: f.bairro });
  if (f.tipo) chips.push({ chave: ["tipo"], rotulo: f.tipo });
  if (f.quartos) chips.push({ chave: ["quartos"], rotulo: `${f.quartos}+ quartos` });
  if (f.suites) chips.push({ chave: ["suites"], rotulo: `${f.suites}+ suítes` });
  if (f.vagas) chips.push({ chave: ["vagas"], rotulo: `${f.vagas}+ vagas` });
  if (f.precoMin || f.precoMax) {
    const r =
      f.precoMin && f.precoMax
        ? `${precoCurto(f.precoMin)} a ${precoCurto(f.precoMax)}`
        : f.precoMin
          ? `A partir de ${precoCurto(f.precoMin)}`
          : `Até ${precoCurto(f.precoMax!)}`;
    chips.push({ chave: ["precoMin", "precoMax"], rotulo: r });
  }
  if (f.areaMin || f.areaMax) {
    const r =
      f.areaMin && f.areaMax
        ? `${f.areaMin} a ${f.areaMax} m²`
        : f.areaMin
          ? `A partir de ${f.areaMin} m²`
          : `Até ${f.areaMax} m²`;
    chips.push({ chave: ["areaMin", "areaMax"], rotulo: r });
  }
  return chips;
}
