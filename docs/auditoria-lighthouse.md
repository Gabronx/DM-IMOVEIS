# Auditoria Lighthouse — 25/11/2026

Lighthouse 13.6, build de produção rodando localmente (`next start`), Chrome headless.
Celular = perfil padrão do Lighthouse (4G lento simulado + CPU 4× mais lenta). Valores = **mediana de 3 execuções**.

| Página | Desempenho (celular) | Desempenho (desktop) | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|---|
| Home | 90 (88/90/90) | 99 | 100 | 100 | 100 |
| Comprar | 90 (90/90/88) | 100 | 100 | 100 | 100 |
| Imóvel | 91 | 100 | 100 | 100 | 100 |
| A consultoria | 93 | 100 | 100 | 100 | 100 |
| Contato | 92 | 100 | 100 | 100 | 100 |
| Anuncie | 94 | 100 | 100 | 100 | 100 |

CLS (estabilidade do layout) = 0 em todas as páginas.

## O que mudou desde a primeira medição

| Problema | Antes | Correção |
|---|---|---|
| Contato lento (mapa do Google carregava de cara) | desempenho 78 / 83 | Mapa carrega só ao clicar em "Ver no mapa" (também melhor para a LGPD: o Google só grava cookies depois do clique) |
| Lista de características do imóvel com HTML inválido | acessibilidade 94 | Estrutura `dl/dt/dd` corrigida |
| Listagem pulava do título principal para os títulos dos cards | acessibilidade 98 | Título "Resultados da busca" para leitores de tela |
| Foto principal sem prioridade alta (o Next 16 trocou a opção `priority`) | — | `fetchPriority="high"` + carregamento imediato |
| Foto do banner borrada no celular (750 px esticados para ~1.600 px) | — | Versão vertical própria para celular, editável no painel |
| Fontes disputando banda com a foto principal | 3 fontes pré-carregadas | Peso 600 removido; Inter sem pré-carregamento |

## Observações

- No celular, o tempo até o maior elemento (≈3,1–3,6 s simulados) é dominado pelo JavaScript base do Next/React (~115 KB) e pela foto principal. Com CDN (Vercel) e HTTP/2 em produção, o resultado real costuma ser melhor que o simulado localmente.
- A home e a listagem ficam no limite (88–90 entre execuções). Para mais folga: reduzir as fotos dos cards visíveis no carregamento ou adiar a rolagem suave (Lenis) para depois do primeiro desenho.
- Refaça a auditoria após publicar, na URL final (PageSpeed Insights), porque os dados reais de campo só existem com tráfego.
