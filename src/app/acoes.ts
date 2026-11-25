"use server";

import { enviarLead, pareceSpam, validarContato } from "@/lib/leads";
import { getImovelPorCodigo, urlImovel } from "@/lib/imoveis";
import { empresa } from "@/content/site";

export type EstadoForm = {
  status: "inicial" | "ok" | "erro";
  mensagem?: string;
  erros?: Record<string, string>;
  valores?: Record<string, string>;
};

const texto = (dados: FormData, campo: string, max = 300) => String(dados.get(campo) ?? "").trim().slice(0, max);
const FALHA = "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.";

/** "Anuncie seu imóvel" */
export async function enviarAnuncio(_: EstadoForm, dados: FormData): Promise<EstadoForm> {
  const { nome, email, telefone, erros } = validarContato(dados);
  const valores = {
    nome,
    email,
    telefone,
    tipo: texto(dados, "tipo"),
    finalidade: texto(dados, "finalidade"),
    bairro: texto(dados, "bairro"),
    cidade: texto(dados, "cidade") || "Curitiba",
    endereco: texto(dados, "endereco"),
    observacoes: texto(dados, "observacoes", 2000),
  };
  if (pareceSpam(dados)) return { status: "ok" };
  if (!valores.tipo) erros.tipo = "Escolha o tipo de imóvel.";
  if (!valores.finalidade) erros.finalidade = "Escolha a finalidade.";
  if (!valores.bairro) erros.bairro = "Informe o bairro.";
  if (Object.keys(erros).length) return { status: "erro", erros, valores };

  try {
    await enviarLead({
      origem: "anuncie",
      nome,
      email,
      telefone,
      mensagem: valores.observacoes || undefined,
      extras: {
        "Tipo de imóvel": valores.tipo,
        Finalidade: valores.finalidade,
        Bairro: valores.bairro,
        Cidade: valores.cidade,
        ...(valores.endereco ? { Endereço: valores.endereco } : {}),
      },
    });
    return { status: "ok" };
  } catch (e) {
    console.error("[lead] falha ao enviar", e);
    return { status: "erro", mensagem: FALHA, valores };
  }
}

/** Página de contato */
export async function enviarContato(_: EstadoForm, dados: FormData): Promise<EstadoForm> {
  const { nome, email, telefone, erros } = validarContato(dados);
  const mensagem = texto(dados, "mensagem", 2000);
  const assunto = texto(dados, "assunto");
  const valores = { nome, email, telefone, mensagem, assunto };
  if (pareceSpam(dados)) return { status: "ok" };
  if (mensagem.length < 5) erros.mensagem = "Escreva sua mensagem.";
  if (Object.keys(erros).length) return { status: "erro", erros, valores };

  try {
    await enviarLead({ origem: "contato", nome, email, telefone, mensagem, extras: assunto ? { Assunto: assunto } : {} });
    return { status: "ok" };
  } catch (e) {
    console.error("[lead] falha ao enviar", e);
    return { status: "erro", mensagem: FALHA, valores };
  }
}

/** Formulário de interesse na página do imóvel */
export async function enviarInteresse(_: EstadoForm, dados: FormData): Promise<EstadoForm> {
  const { nome, email, telefone, erros } = validarContato(dados);
  const mensagem = texto(dados, "mensagem", 2000);
  const valores = { nome, email, telefone, mensagem };
  if (pareceSpam(dados)) return { status: "ok" };
  if (Object.keys(erros).length) return { status: "erro", erros, valores };

  const imovel = await getImovelPorCodigo(texto(dados, "codigo"));
  if (!imovel) return { status: "erro", mensagem: "Imóvel não encontrado.", valores };

  try {
    await enviarLead({
      origem: "interesse-imovel",
      nome,
      email,
      telefone,
      mensagem,
      imovel: { codigo: imovel.codigo, titulo: imovel.titulo, url: `${empresa.siteUrl}${urlImovel(imovel)}` },
      extras: { Interesse: texto(dados, "assunto") || "Mais informações" },
    });
    return { status: "ok" };
  } catch (e) {
    console.error("[lead] falha ao enviar", e);
    return { status: "erro", mensagem: FALHA, valores };
  }
}
