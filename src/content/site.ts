/**
 * Dados fixos da empresa (nome, contatos, redes) e configuração de endereço/indexação.
 * Textos das páginas, banner, destaques e avaliações ficam no painel (pasta /content).
 *
 * Itens marcados com TODO são provisórios e devem ser validados com a
 * consultora antes de o site ir ao ar.
 */

export const empresa = {
  nome: "DM Consultoria Patrimonial",
  nomeCurto: "DM Consultoria",
  consultora: "Deborah Moreira",
  avatarConsultora: "/img/consultora-avatar.jpg",
  creci: "CRECI/PR 12345-F",
  whatsapp: "5541985115695",
  telefoneExibicao: "(41) 98511-5695",
  email: null as string | null, // TODO: e-mail de contato
  endereco: {
    logradouro: "Rua Matheus Leme, 512",
    bairro: null as string | null, // TODO: confirmar bairro e CEP
    cidade: "Curitiba",
    uf: "PR",
  },
  redes: [
    { nome: "Instagram", url: "https://www.instagram.com/deborahmoreiraa" },
    { nome: "Facebook", url: "https://www.facebook.com/deborahmoreiraa" },
    { nome: "X", url: "https://x.com/deborahmoreiraa" },
  ],
  usuarioRedes: "@deborahmoreiraa",
  siteUrl: urlDoSite(),
};

/**
 * Endereço público do site, usado em links absolutos (Open Graph, sitemap, dados estruturados).
 * 1. NEXT_PUBLIC_SITE_URL, quando o domínio final estiver definido (TODO: domínio final);
 * 2. URL, que o Netlify preenche sozinho com o endereço do site publicado;
 * 3. localhost, em desenvolvimento.
 */
function urlDoSite() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

/**
 * O site só pede para ser indexado pelo Google quando NEXT_PUBLIC_INDEXAR=true.
 * Enquanto for uma versão de apresentação, fica fora das buscas (evita concorrer com o site atual).
 */
export const indexar = process.env.NEXT_PUBLIC_INDEXAR === "true";

export const navegacao = [
  { href: "/comprar", rotulo: "Comprar" },
  { href: "/alugar", rotulo: "Alugar" },
  { href: "/anuncie", rotulo: "Anuncie seu imóvel" },
  { href: "/sobre", rotulo: "A consultoria" },
  { href: "/contato", rotulo: "Contato" },
];

export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${empresa.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Textos das páginas, banner, destaques e avaliações agora são editados no
 * painel (/keystatic) e ficam em /content. Ver src/lib/conteudo.ts.
 */

/** Tipos oferecidos no formulário "Anuncie seu imóvel". */
export const tiposAnuncio = ["Apartamento", "Casa", "Sobrado", "Cobertura", "Terreno", "Comercial", "Outro"];
