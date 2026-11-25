# DM Consultoria Patrimonial — site

Site da DM Consultoria Patrimonial (Curitiba/PR).
Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Keystatic (painel de conteúdo), publicado no Netlify.

## Rodar localmente

Requer **Node 20.9 ou superior**.

```bash
npm install
npm run dev        # site:   http://localhost:3000
                   # painel: http://localhost:3000/admin  (→ /keystatic)
npm run check      # lint + tipos + build de produção (rode antes de subir)
```

Outros scripts: `npm run build`, `npm start` (serve o build), `npm run lint`, `npm run typecheck`.

## Estrutura

```
.
├── content/                 Conteúdo editável pelo painel (JSON): home, sobre, anuncie, avaliações, imóveis
├── public/img/              Imagens servidas pelo site
│   ├── site/                  fotos do banner, da consultora e da faixa (trocadas pelo painel)
│   ├── avaliacoes/            fotos das pessoas nas avaliações
│   └── imoveis/               fotos dos imóveis cadastrados no painel
├── src/
│   ├── app/                 Rotas (App Router)
│   │   ├── (site)/            páginas públicas: home, comprar, alugar, imovel/[slug], anuncie, sobre, contato, termos, privacidade
│   │   ├── keystatic/         painel de conteúdo
│   │   ├── api/keystatic/     API do painel
│   │   ├── acoes.ts           server actions dos formulários
│   │   ├── layout.tsx         layout raiz (fontes, metadados)
│   │   ├── globals.css        design system (cores, fontes, animações)
│   │   └── robots.ts · sitemap.ts · not-found.tsx · icon.png · apple-icon.png
│   ├── components/          Componentes por área: busca, form, home, imovel, layout, listagem, motion, ui
│   ├── lib/                 Regras e dados: conteudo (leitura do painel), imoveis, filtros, leads, painel
│   ├── content/site.ts      Dados fixos da empresa (nome, CRECI, WhatsApp, endereço, redes) e URL do site
│   ├── data/                Carteira atual da EEmovel (imoveis.json) e lista de comodidades
│   └── fonts/               Lemon Milk (títulos de destaque e busca)
├── docs/                    Documentação do projeto (não vai para o site)
│   ├── guia-do-painel.md      guia de uso do painel para a consultora
│   ├── dados-empresa.md       dados confirmados e pendentes
│   ├── auditoria-lighthouse.md
│   ├── email-eemovel.md       pedido de acesso à API da EEmovel
│   ├── marca/                 logo DM (preta e branca) em alta
│   └── propostas/             direções visuais apresentadas no início
├── keystatic.config.tsx     Campos e rótulos do painel
├── netlify.toml             Configuração de publicação
└── .env.example             Variáveis de ambiente (todas opcionais)
```

Arquivos originais pesados (fotos em alta, fontes de terceiros) ficam em `_originais/`, fora do repositório.

## Publicar no Netlify

1. No Netlify: **Add new site → Import an existing project → GitHub** e escolha este repositório.
2. Deixe as configurações que o Netlify sugere (já vêm do `netlify.toml`):
   build `npm run build`, publish `.next`, Node 22. O Netlify reconhece o Next.js e usa o adaptador oficial sozinho.
3. Clique em **Deploy**. Nenhuma variável é obrigatória para a versão de apresentação.

Como a versão de apresentação fica:

- **Fora do Google:** o site envia `noindex` e o `robots.txt` bloqueia tudo, para não concorrer com o site atual.
  Quando for o site oficial, cadastre `NEXT_PUBLIC_INDEXAR=true` e `NEXT_PUBLIC_SITE_URL=https://dominio-final`.
- **Links absolutos** (compartilhamento, sitemap) usam o endereço do Netlify automaticamente.
- **Formulários** validam e respondem normalmente, mas sem e-mail configurado o contato só fica no log das funções do Netlify.
  Para receber por e-mail, configure `RESEND_API_KEY` e `LEADS_EMAIL_PARA` (ou `LEADS_WEBHOOK_URL` para um CRM).
- **Painel** (`/admin`): desativado no site publicado até ser ligado ao GitHub (abaixo). Localmente funciona sempre.

Variáveis: veja `.env.example` e cadastre em **Site configuration → Environment variables**.

## Painel de conteúdo (Keystatic)

Guia para quem edita: [`docs/guia-do-painel.md`](docs/guia-do-painel.md).

Editável sem mexer no código:

- **Página inicial:** banner (título, frase, fotos), imóveis em destaque e ordem, "Por que a DM", serviços e chamada "Anuncie".
- **A consultoria:** textos, fotos da consultora (home e página), foto larga e história.
- **Anuncie seu imóvel:** textos e etapas.
- **Avaliações:** nota, total e pessoas exibidas (com foto).
- **Imóveis cadastrados no painel:** cadastro completo, com fotos, legendas, comodidades e destaque. Aparecem junto com os da EEmovel.

O conteúdo fica em arquivos (`content/*.json`), sem banco de dados.
Localmente o painel grava direto nesses arquivos; no site publicado, cada "Salvar" vira um commit no GitHub e o Netlify republica em cerca de 1 minuto.

### Ligar o painel no site publicado (uma vez)

1. Em `.env.local`, preencha `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=Gabronx/DM-IMOVEIS` e rode `npm run dev`.
2. Abra `http://localhost:3000/keystatic`: o Keystatic guia a criação do GitHub App e grava
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` e `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` no `.env`.
3. No GitHub App, adicione a URL do Netlify como callback: `https://SEU-SITE.netlify.app/api/keystatic/github/oauth/callback`.
4. Cadastre as 5 variáveis no Netlify e faça um novo deploy.
5. Dê acesso ao repositório a quem vai editar (o login no painel é com a conta do GitHub).

## Formulários e mapa

Antispam sem captcha: campo invisível + tempo mínimo de preenchimento (`src/lib/leads.ts`).
O mapa do imóvel mostra só a região aproximada (coordenadas arredondadas); na página de contato ele carrega só ao clicar.
`NEXT_PUBLIC_GOOGLE_MAPS_KEY` é opcional. GA4 e Meta Pixel só carregam após o aceite de cookies.

## Pendências (TODO)

- **Licença da fonte Lemon Milk** (`src/fonts/`): grátis para uso pessoal; para uso comercial o autor pede uma doação (valor livre). Resolver antes de o site ir ao ar.
- **Avaliações são simuladas** (painel → Avaliações): trocar por avaliações reais antes de publicar oficialmente.
- Fonte dos imóveis: aguardando resposta da EEmovel sobre API/feed ([`docs/email-eemovel.md`](docs/email-eemovel.md)).
- Domínio final (`NEXT_PUBLIC_SITE_URL`), e-mail de contato, bairro/CEP do endereço.
- Termos e Privacidade são MODELOS: revisar com assessoria jurídica e preencher CNPJ, e-mail do encarregado (DPO) e prazos de retenção.
- Textos de "A consultoria", "Anuncie", "Por que a DM" e serviços são provisórios (editáveis no painel).
- E-mail de destino dos leads (`LEADS_EMAIL_PARA`) e conta no Resend.
- IDs do GA4 / Meta Pixel (`NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`).
- Imóveis da EEmovel: sem legendas por foto e sem IPTU (aparece "Não informado").
- Ligar o painel ao GitHub para editar no site publicado.
- Mapa na listagem (opcional) e paginação quando a carteira crescer.
