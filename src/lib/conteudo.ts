/* eslint-disable @typescript-eslint/no-unused-vars -- `_versao` só existe para entrar na chave do cache */
import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cacheLife } from "next/cache";
import { createReader } from "@keystatic/core/reader";
import config from "../../keystatic.config";

/**
 * Leitura do conteúdo editado no painel (Keystatic), em /content.
 *
 * Em produção o conteúdo é lido no build: cada edição publicada pelo painel
 * gera um commit e um novo deploy. Em desenvolvimento, a "versão" do conteúdo
 * (data de modificação dos arquivos) entra na chave do cache, então qualquer
 * edição feita no painel aparece ao recarregar a página.
 */
const reader = createReader(process.cwd(), config);
const PASTA = path.join(process.cwd(), "content");

function versaoConteudo(): string {
  if (process.env.NODE_ENV !== "development") return "build";
  let maior = 0;
  const visitar = (dir: string) => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, item.name);
      if (item.isDirectory()) visitar(p);
      else maior = Math.max(maior, fs.statSync(p).mtimeMs);
    }
  };
  try {
    visitar(PASTA);
  } catch {}
  return String(maior);
}

function exigir<T>(valor: T | null, arquivo: string): T {
  if (!valor) throw new Error(`Conteúdo ausente: content/${arquivo}. Abra o painel (/keystatic) e salve a página.`);
  return valor;
}

async function lerHome(_versao: string) {
  "use cache";
  cacheLife("max");
  return exigir(await reader.singletons.home.read(), "home.json");
}
async function lerSobre(_versao: string) {
  "use cache";
  cacheLife("max");
  return exigir(await reader.singletons.sobre.read(), "sobre.json");
}
async function lerAnuncie(_versao: string) {
  "use cache";
  cacheLife("max");
  return exigir(await reader.singletons.anuncie.read(), "anuncie.json");
}
async function lerAvaliacoes(_versao: string) {
  "use cache";
  cacheLife("max");
  return exigir(await reader.singletons.avaliacoes.read(), "avaliacoes.json");
}
async function lerImoveisPainel(_versao: string) {
  "use cache";
  cacheLife("max");
  return reader.collections.imoveis.all();
}

export const getHome = () => lerHome(versaoConteudo());
export const getSobre = () => lerSobre(versaoConteudo());
export const getAnuncie = () => lerAnuncie(versaoConteudo());
export const getAvaliacoes = () => lerAvaliacoes(versaoConteudo());
export const getImoveisPainel = () => lerImoveisPainel(versaoConteudo());

export type ConteudoHome = Awaited<ReturnType<typeof getHome>>;
