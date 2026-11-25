/**
 * Painel de conteúdo (Keystatic) — acessível em /keystatic (atalho: /admin).
 *
 * Em desenvolvimento as edições são gravadas direto nos arquivos de /content.
 * Em produção, defina NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO ("usuario/repositorio")
 * para que cada edição vire um commit no GitHub (e o Netlify publique sozinho).
 */
import { collection, config, fields, singleton } from "@keystatic/core";
import imoveisEEmovel from "./src/data/imoveis.json";
import comodidades from "./src/data/comodidades.json";

const repo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const opcoesEEmovel = imoveisEEmovel.map((i) => ({
  value: i.codigo,
  label: `${i.codigo} · ${i.tipo} · ${i.bairro} · ${i.preco ? brl.format(i.preco) : "Consulte"}`,
}));

const imagemSite = (label: string, description?: string) =>
  fields.image({ label, description, directory: "public/img/site", publicPath: "/img/site/" });

const tiposImovel = ["Apartamento", "Casa", "Sobrado", "Cobertura", "Casa em condomínio", "Terreno", "Comercial"];

export default config({
  storage: repo ? { kind: "github", repo } : { kind: "local" },
  locale: "pt-BR",
  ui: {
    brand: { name: "DM Consultoria" },
    navigation: {
      "Páginas": ["home", "sobre", "anuncie"],
      "Avaliações": ["avaliacoes"],
      "Imóveis": ["imoveis"],
    },
  },

  singletons: {
    /* ------------------------------ HOME ------------------------------ */
    home: singleton({
      label: "Página inicial",
      path: "content/home",
      format: { data: "json" },
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({ label: "Texto pequeno acima do título (opcional)" }),
            tituloLinha1: fields.text({ label: "Título — linha 1", validation: { isRequired: true } }),
            tituloLinha2: fields.text({ label: "Título — linha 2 (em itálico)" }),
            tituloLinha3: fields.text({ label: "Título — linha 3" }),
            subtitulo: fields.text({ label: "Frase abaixo do título (opcional)", multiline: true }),
            imagem: imagemSite("Foto de fundo", "Use uma foto horizontal grande (ideal: 2880 px de largura)."),
            imagemCelular: imagemSite(
              "Foto de fundo no celular (opcional)",
              "Versão vertical da mesma foto, para ficar nítida e leve no celular (ideal: 1400 × 2200 px).",
            ),
            imagemAlt: fields.text({
              label: "Descrição da foto (acessibilidade)",
              description: "Descreva o que aparece na foto. Ex.: Varanda ampla com sofá branco e jardim tropical.",
            }),
          },
          { label: "Banner principal" },
        ),
        destaques: fields.array(
          fields.select({ label: "Imóvel", options: opcoesEEmovel, defaultValue: opcoesEEmovel[0]?.value ?? "" }),
          {
            label: "Imóveis em destaque (EEmovel)",
            description:
              "Escolha e ordene os imóveis exibidos na home. Imóveis cadastrados aqui no painel entram em destaque marcando “Mostrar em destaque” no cadastro.",
            itemLabel: (p) => opcoesEEmovel.find((o) => o.value === p.value)?.label ?? p.value,
          },
        ),
        porQue: fields.object(
          {
            eyebrow: fields.text({ label: "Texto pequeno", defaultValue: "Por que a DM" }),
            titulo: fields.text({ label: "Título" }),
            texto: fields.text({ label: "Texto", multiline: true }),
            diferenciais: fields.array(fields.text({ label: "Diferencial" }), {
              label: "Diferenciais",
              itemLabel: (p) => p.value,
            }),
          },
          { label: "Bloco “Por que a DM”" },
        ),
        servicos: fields.array(
          fields.object({
            titulo: fields.text({ label: "Serviço" }),
            texto: fields.text({ label: "Descrição", multiline: true }),
          }),
          { label: "Serviços", description: "Aparecem na página “A consultoria”.", itemLabel: (p) => p.fields.titulo.value },
        ),
        anuncie: fields.object(
          {
            eyebrow: fields.text({ label: "Texto pequeno", defaultValue: "Para proprietários" }),
            titulo: fields.text({ label: "Título" }),
            texto: fields.text({ label: "Texto", multiline: true }),
          },
          { label: "Chamada “Anuncie seu imóvel”" },
        ),
      },
    }),

    /* ------------------------------ SOBRE ------------------------------ */
    sobre: singleton({
      label: "A consultoria",
      path: "content/sobre",
      format: { data: "json" },
      schema: {
        titulo: fields.text({ label: "Título" }),
        introducao: fields.text({ label: "Introdução", multiline: true }),
        fotoConsultora: imagemSite(
          "Foto da consultora (home)",
          "Aparece no bloco “Por que a DM” da página inicial. PNG com fundo transparente (proporção 4:5).",
        ),
        fotoPaginaSobre: imagemSite(
          "Foto da consultora (página A consultoria)",
          "Aparece no topo desta página. Se ficar vazia, usa a foto da home. PNG com fundo transparente (proporção 4:5).",
        ),
        imagemFaixa: imagemSite(
          "Foto larga abaixo da abertura",
          "Foto de ambiente em largura total, logo abaixo do título da página. Use uma foto horizontal grande (ideal: 2400 px de largura).",
        ),
        tituloHistoria: fields.text({ label: "Título da história" }),
        historia: fields.array(fields.text({ label: "Parágrafo", multiline: true }), {
          label: "História (parágrafos)",
          itemLabel: (p) => p.value.slice(0, 60) + (p.value.length > 60 ? "…" : ""),
        }),
      },
    }),

    /* ------------------------------ ANUNCIE ------------------------------ */
    anuncie: singleton({
      label: "Anuncie seu imóvel",
      path: "content/anuncie",
      format: { data: "json" },
      schema: {
        titulo: fields.text({ label: "Título" }),
        texto: fields.text({ label: "Texto", multiline: true }),
        etapas: fields.array(
          fields.object({
            titulo: fields.text({ label: "Etapa" }),
            texto: fields.text({ label: "Descrição", multiline: true }),
          }),
          { label: "Como funciona (etapas)", itemLabel: (p) => p.fields.titulo.value },
        ),
      },
    }),

    /* ------------------------------ AVALIAÇÕES ------------------------------ */
    avaliacoes: singleton({
      label: "Avaliações",
      path: "content/avaliacoes",
      format: { data: "json" },
      schema: {
        nota: fields.number({
          label: "Nota média (0 a 5)",
          step: 0.1,
          validation: { min: 0, max: 5, isRequired: true },
          defaultValue: 5,
        }),
        total: fields.integer({ label: "Total de avaliações", validation: { min: 0 }, defaultValue: 0 }),
        pessoas: fields.array(
          fields.object({
            nome: fields.text({ label: "Primeiro nome" }),
            foto: fields.image({
              label: "Foto (quadrada)",
              directory: "public/img/avaliacoes",
              publicPath: "/img/avaliacoes/",
            }),
          }),
          {
            label: "Pessoas exibidas (até 4)",
            description: "Aparecem sobrepostas, como “seguidores em comum”. Sem foto, mostramos as iniciais.",
            itemLabel: (p) => p.fields.nome.value,
            validation: { length: { max: 4 } },
          },
        ),
      },
    }),
  },

  collections: {
    /* ------------------------------ IMÓVEIS ------------------------------ */
    imoveis: collection({
      label: "Imóveis cadastrados no painel",
      path: "content/imoveis/*",
      slugField: "codigo",
      format: { data: "json" },
      columns: ["titulo", "bairro", "preco"],
      entryLayout: "form",
      schema: {
        codigo: fields.slug({
          name: {
            label: "Código do imóvel",
            description: "Ex.: DM001. Aparece na página, na URL e na mensagem do WhatsApp.",
            validation: { length: { min: 1 } },
          },
          slug: {
            label: "Código no endereço (gerado automaticamente)",
            description: "Não precisa mexer. Evite alterar depois de publicado.",
          },
        }),
        publicado: fields.checkbox({ label: "Publicado no site", defaultValue: true }),
        destaque: fields.checkbox({ label: "Mostrar em destaque na home", defaultValue: false }),
        titulo: fields.text({
          label: "Título do anúncio",
          description: "Ex.: Apartamento com 3 quartos e vista para o Parque Barigui",
          validation: { isRequired: true },
        }),
        finalidade: fields.select({
          label: "Finalidade",
          options: [
            { label: "Venda", value: "venda" },
            { label: "Locação", value: "aluguel" },
          ],
          defaultValue: "venda",
        }),
        tipo: fields.select({
          label: "Tipo",
          options: tiposImovel.map((t) => ({ label: t, value: t })),
          defaultValue: "Apartamento",
        }),
        preco: fields.integer({ label: "Preço (R$)", description: "Só números. Ex.: 980000", validation: { min: 0 } }),
        condominio: fields.integer({ label: "Condomínio mensal (R$)", validation: { min: 0 } }),
        iptu: fields.integer({ label: "IPTU anual (R$)", validation: { min: 0 } }),
        bairro: fields.text({ label: "Bairro", validation: { isRequired: true } }),
        cidade: fields.text({ label: "Cidade", defaultValue: "Curitiba" }),
        uf: fields.text({ label: "UF", defaultValue: "PR" }),
        quartos: fields.integer({ label: "Quartos", validation: { min: 0 } }),
        suites: fields.integer({ label: "Suítes", validation: { min: 0 } }),
        banheiros: fields.integer({ label: "Banheiros", validation: { min: 0 } }),
        vagas: fields.integer({ label: "Vagas", validation: { min: 0 } }),
        areaUtil: fields.number({ label: "Área útil (m²)", validation: { min: 0 } }),
        areaTotal: fields.number({ label: "Área total (m²)", validation: { min: 0 } }),
        andar: fields.text({ label: "Andar", description: "Opcional" }),
        descricao: fields.text({
          label: "Descrição",
          multiline: true,
          description: "Separe parágrafos com uma linha em branco. Linhas começando com “- ” viram lista.",
        }),
        comodidades: fields.multiselect({
          label: "Comodidades",
          options: comodidades.map((c) => ({ label: c, value: c })),
        }),
        fotos: fields.array(
          fields.object({
            imagem: fields.image({
              label: "Foto",
              directory: "public/img/imoveis",
              publicPath: "/img/imoveis/",
              validation: { isRequired: true },
            }),
            legenda: fields.text({
              label: "Legenda",
              description: "Descreva o ambiente. Ex.: Sala de estar com vista para o parque.",
            }),
          }),
          {
            label: "Fotos",
            description: "A primeira foto é a capa. Arraste para mudar a ordem.",
            itemLabel: (p) => p.fields.legenda.value || "Foto",
          },
        ),
        latitude: fields.number({
          label: "Latitude (opcional)",
          description: "Sem coordenadas, o mapa mostra o bairro. No Google Maps: clique com o botão direito no local e copie os números.",
        }),
        longitude: fields.number({ label: "Longitude (opcional)" }),
      },
    }),
  },
});
