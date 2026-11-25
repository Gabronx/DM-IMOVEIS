/**
 * Camada de dados dos imóveis.
 *
 * As páginas só conversam com as funções deste arquivo, que juntam duas fontes:
 *  1. `src/data/imoveis.json` — carteira atual publicada pela EEmovel
 *     (será trocada pela API/feed quando a EEmovel liberar o acesso);
 *  2. imóveis cadastrados no painel (Keystatic), em `content/imoveis`.
 * As páginas não precisam saber de onde cada imóvel veio.
 */
import "server-only";
import dados from "@/data/imoveis.json";
import { getImoveisPainel } from "./conteudo";

export type Finalidade = "venda" | "aluguel";

export type Imovel = {
  codigo: string;
  slug: string;
  titulo: string;
  finalidade: Finalidade;
  categoria: string;
  tipo: string;
  descricao: string[];
  quartos: number | null;
  suites: number | null;
  banheiros: number | null;
  vagas: number | null;
  andar: string | null;
  comodidades: string[];
  fotos: string[];
  /** Legenda de cada foto (mesma ordem de `fotos`), usada no texto alternativo. */
  legendas: (string | null)[];
  areaTotal: number | null;
  areaUtil: number | null;
  preco: number | null;
  condominio: number | null;
  iptu: number | null;
  /** Coordenadas; sem elas o mapa mostra o bairro. */
  lat: number | null;
  lng: number | null;
  bairro: string;
  cidade: string;
  uf: string;
  atualizadoEm: string;
  origem: "eemovel" | "painel";
  /** Só para imóveis do painel: marcado como destaque da home. */
  destaque: boolean;
};

function slugificar(t: string) {
  return t
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Parágrafos separados por linha em branco; cada linha de lista vira um item. */
function paragrafos(texto: string) {
  return texto
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/**
 * Ajustes editoriais por imóvel, sem mexer na fonte original.
 * `capa`: índice da foto usada como capa (ex.: quando a 1ª foto tem texto escrito).
 * TODO: mover para o CMS.
 */
const ajustes: Record<string, { capa?: number }> = {
  "274444": { capa: 1 },
};

/** "COBERTURA DUPLEX - ELEVADOR" → "Cobertura duplex - elevador" */
function normalizarTitulo(t: string) {
  const letras = t.replace(/[^A-Za-zÀ-ÿ]/g, "");
  const maiusculas = letras.replace(/[^A-ZÀ-Þ]/g, "").length;
  if (letras.length === 0 || maiusculas / letras.length < 0.6) return t.trim();
  const minusculo = t.toLocaleLowerCase("pt-BR").trim();
  return minusculo.charAt(0).toLocaleUpperCase("pt-BR") + minusculo.slice(1);
}

type ImovelEEmovel = Omit<Imovel, "legendas" | "origem" | "destaque">;

const daEEmovel: Imovel[] = (dados as ImovelEEmovel[]).map((i) => {
  const capa = ajustes[i.codigo]?.capa ?? 0;
  const fotos = capa ? [i.fotos[capa], ...i.fotos.filter((_, n) => n !== capa)] : i.fotos;
  return {
    ...i,
    titulo: normalizarTitulo(i.titulo),
    fotos,
    legendas: fotos.map(() => null),
    origem: "eemovel",
    destaque: false,
  };
});

async function doPainel(): Promise<Imovel[]> {
  const entradas = await getImoveisPainel();
  return entradas
    .filter(({ entry }) => entry.publicado)
    .map(({ slug, entry: e }) => {
      const fotos = e.fotos.filter((f) => f.imagem);
      const codigo = e.codigo?.trim() || slug;
      return {
        codigo,
        slug: `${slugificar(`${e.tipo} ${e.quartos ?? ""} quartos ${e.bairro} ${e.cidade}`)}-${slugificar(codigo)}`,
        titulo: e.titulo,
        finalidade: e.finalidade,
        categoria: ["Casa", "Sobrado", "Casa em condomínio"].includes(e.tipo) ? "Casa" : "Apartamento",
        tipo: e.tipo,
        descricao: paragrafos(e.descricao),
        quartos: e.quartos,
        suites: e.suites,
        banheiros: e.banheiros,
        vagas: e.vagas,
        andar: e.andar || null,
        comodidades: [...e.comodidades],
        fotos: fotos.map((f) => f.imagem),
        legendas: fotos.map((f) => f.legenda || null),
        areaTotal: e.areaTotal,
        areaUtil: e.areaUtil,
        preco: e.preco,
        condominio: e.condominio,
        iptu: e.iptu,
        lat: e.latitude,
        lng: e.longitude,
        bairro: e.bairro,
        cidade: e.cidade || "Curitiba",
        uf: e.uf || "PR",
        atualizadoEm: "",
        origem: "painel" as const,
        destaque: e.destaque,
      };
    })
    .filter((i) => i.fotos.length > 0);
}

async function carregar(): Promise<Imovel[]> {
  // Imóveis do painel primeiro (são os mais recentes)
  return [...(await doPainel()), ...daEEmovel];
}

export async function getImoveis(finalidade?: Finalidade) {
  const todos = await carregar();
  return finalidade ? todos.filter((i) => i.finalidade === finalidade) : todos;
}

export async function getImovelPorCodigo(codigo: string) {
  const alvo = codigo.trim().toLowerCase();
  return (await carregar()).find((i) => i.codigo.toLowerCase() === alvo) ?? null;
}

/**
 * Busca pelo slug da URL. Se o slug mudou (ex.: o título foi editado) mas o
 * código no final ainda existe, devolve o imóvel para a página redirecionar.
 */
export async function getImovelPorSlug(slug: string) {
  const todos = await carregar();
  const exato = todos.find((i) => i.slug === slug);
  if (exato) return { imovel: exato, redirecionar: false };
  // O código vai sempre no final do endereço (ex.: ...-curitiba-dm-001)
  const porCodigo = todos.find((i) => slug.toLowerCase().endsWith(`-${slugificar(i.codigo)}`));
  return porCodigo ? { imovel: porCodigo, redirecionar: true } : null;
}

/** Semelhantes: mesma finalidade, priorizando tipo, bairro e preço próximo. */
export async function getSemelhantes(base: Imovel, quantidade = 3) {
  const todos = await carregar();
  const pontuar = (i: Imovel) => {
    let p = 0;
    if (i.tipo === base.tipo) p += 3;
    if (i.bairro === base.bairro) p += 2;
    if (i.cidade === base.cidade) p += 1;
    if (i.preco && base.preco) p += Math.max(0, 3 - (Math.abs(i.preco - base.preco) / base.preco) * 6);
    if (i.quartos != null && i.quartos === base.quartos) p += 1;
    return p;
  };
  return todos
    .filter((i) => i.codigo !== base.codigo && i.finalidade === base.finalidade)
    .map((i) => ({ i, p: pontuar(i) }))
    .sort((a, b) => b.p - a.p)
    .slice(0, quantidade)
    .map(({ i }) => i);
}

/** Destaques da home: imóveis do painel marcados como destaque + os escolhidos da EEmovel, na ordem do painel. */
export async function getDestaques(codigos: readonly string[]) {
  const todos = await carregar();
  const doPainel = todos.filter((i) => i.origem === "painel" && i.destaque);
  const escolhidos = await getImoveisPorCodigos([...codigos]);
  const vistos = new Set<string>();
  return [...doPainel, ...escolhidos].filter((i) => !vistos.has(i.codigo) && vistos.add(i.codigo));
}

export async function getImoveisPorCodigos(codigos: string[]) {
  const todos = await carregar();
  return codigos
    .map((c) => todos.find((i) => i.codigo === c))
    .filter((i): i is Imovel => Boolean(i));
}

export async function getBairros() {
  const todos = await carregar();
  const mapa = new Map<string, { bairro: string; cidade: string; total: number }>();
  for (const i of todos) {
    const chave = `${i.bairro}|${i.cidade}`;
    const atual = mapa.get(chave) ?? { bairro: i.bairro, cidade: i.cidade, total: 0 };
    atual.total += 1;
    mapa.set(chave, atual);
  }
  return [...mapa.values()].sort((a, b) => b.total - a.total || a.bairro.localeCompare(b.bairro));
}

export type OpcoesBusca = {
  cidades: string[];
  bairros: { bairro: string; cidade: string }[];
  tipos: string[];
};

/** Opções dos filtros, montadas a partir da carteira (de todas as finalidades). */
export async function getOpcoesBusca(): Promise<OpcoesBusca> {
  const todos = await carregar();
  const cidades = new Set<string>();
  const tipos = new Set<string>();
  const bairros = new Map<string, { bairro: string; cidade: string }>();
  for (const i of todos) {
    cidades.add(i.cidade);
    tipos.add(i.tipo);
    bairros.set(`${i.bairro}|${i.cidade}`, { bairro: i.bairro, cidade: i.cidade });
  }
  const ordenar = (a: string, b: string) => a.localeCompare(b, "pt-BR");
  return {
    cidades: [...cidades].sort(ordenar),
    bairros: [...bairros.values()].sort((a, b) => ordenar(a.bairro, b.bairro)),
    tipos: [...tipos].sort(ordenar),
  };
}

/* ---------- Formatação ---------- */

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function formatarPreco(valor: number | null) {
  return valor == null ? "Consulte" : brl.format(valor);
}

export function formatarArea(valor: number | null) {
  return valor == null ? null : `${valor.toLocaleString("pt-BR")} m²`;
}

export function urlImovel(i: Pick<Imovel, "slug">) {
  return `/imovel/${i.slug}`;
}

export function localImovel(i: Pick<Imovel, "bairro" | "cidade">) {
  return `${i.bairro} · ${i.cidade}`;
}
