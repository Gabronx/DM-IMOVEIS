import "server-only";

/**
 * Envio de contatos (leads) dos formulários.
 *
 * Configuração por variáveis de ambiente (ver .env.example):
 *  - RESEND_API_KEY + LEADS_EMAIL_PARA (+ LEADS_EMAIL_DE): envia por e-mail via Resend.
 *  - LEADS_WEBHOOK_URL: envia o mesmo conteúdo em JSON para um CRM / automação.
 * Sem nenhuma configuração (ambiente de desenvolvimento), o lead é só registrado no log.
 */

export type Lead = {
  origem: "interesse-imovel" | "anuncie" | "contato";
  nome: string;
  email: string;
  telefone: string;
  mensagem?: string;
  imovel?: { codigo: string; titulo: string; url: string };
  extras?: Record<string, string>;
};

function escapar(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function assunto(l: Lead) {
  if (l.origem === "interesse-imovel" && l.imovel) return `Interesse no imóvel ${l.imovel.codigo} — ${l.nome}`;
  if (l.origem === "anuncie") return `Novo imóvel para anunciar — ${l.nome}`;
  return `Contato pelo site — ${l.nome}`;
}

function corpoHtml(l: Lead) {
  const linhas: [string, string][] = [
    ["Nome", l.nome],
    ["E-mail", l.email],
    ["Telefone", l.telefone],
    ...(l.imovel ? ([["Imóvel", `${l.imovel.codigo} — ${l.imovel.titulo}`], ["Link", l.imovel.url]] as [string, string][]) : []),
    ...Object.entries(l.extras ?? {}),
    ...(l.mensagem ? ([["Mensagem", l.mensagem]] as [string, string][]) : []),
  ];
  return `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${linhas
    .map(([k, v]) => `<tr><td style="color:#5d5e6b;vertical-align:top">${escapar(k)}</td><td>${escapar(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;
}

export async function enviarLead(lead: Lead) {
  const { RESEND_API_KEY, LEADS_EMAIL_PARA, LEADS_EMAIL_DE, LEADS_WEBHOOK_URL } = process.env;
  const tarefas: Promise<unknown>[] = [];

  if (RESEND_API_KEY && LEADS_EMAIL_PARA) {
    tarefas.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: LEADS_EMAIL_DE ?? "Site DM <site@dmconsultimoveis.com.br>",
          to: LEADS_EMAIL_PARA.split(",").map((s) => s.trim()),
          reply_to: lead.email,
          subject: assunto(lead),
          html: corpoHtml(lead),
        }),
      }).then((r) => {
        if (!r.ok) throw new Error(`Resend respondeu ${r.status}`);
      }),
    );
  }

  if (LEADS_WEBHOOK_URL) {
    tarefas.push(
      fetch(LEADS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, recebidoEm: new Date().toISOString() }),
      }).then((r) => {
        if (!r.ok) throw new Error(`Webhook respondeu ${r.status}`);
      }),
    );
  }

  if (tarefas.length === 0) {
    // TODO: configurar e-mail de destino dos leads antes de publicar.
    console.info("[lead] (sem envio configurado)", assunto(lead));
    return;
  }

  await Promise.all(tarefas);
}

/* ---------- Validação e antispam ---------- */

export function validarContato(dados: FormData) {
  const nome = String(dados.get("nome") ?? "").trim();
  const email = String(dados.get("email") ?? "").trim();
  const telefone = String(dados.get("telefone") ?? "").trim();
  const erros: Record<string, string> = {};
  if (nome.length < 2) erros.nome = "Informe seu nome.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) erros.email = "Informe um e-mail válido.";
  if (telefone.replace(/\D/g, "").length < 10) erros.telefone = "Informe um telefone com DDD.";
  if (dados.get("consentimento") !== "on") erros.consentimento = "É preciso concordar para enviarmos o contato.";
  return { nome, email, telefone, erros };
}

/**
 * Antispam sem captcha: campo invisível (honeypot) e tempo mínimo de preenchimento.
 * Robôs costumam preencher todos os campos e enviar em menos de 3 segundos.
 */
export function pareceSpam(dados: FormData) {
  if (String(dados.get("site") ?? "") !== "") return true;
  const inicio = Number(dados.get("inicio"));
  return !Number.isFinite(inicio) || inicio <= 0 || Date.now() - inicio < 3000;
}
