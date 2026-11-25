/**
 * O painel (Keystatic) grava direto nos arquivos de /content.
 * - Em desenvolvimento (npm run dev): sempre ativo, editando os arquivos locais.
 * - Em produção: só funciona no modo GitHub (cada edição vira um commit e o site é republicado).
 *   Sem NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO, o servidor não tem onde salvar; o painel fica desativado
 *   e mostra uma explicação, em vez de aceitar edições que se perderiam.
 */
export const painelAtivo =
  process.env.NODE_ENV !== "production" || Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO);
