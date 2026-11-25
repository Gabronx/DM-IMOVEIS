import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CabecalhoPagina from "./CabecalhoPagina";

/** Páginas de texto longo (termos, privacidade), com tipografia de leitura. */
export default function PaginaTexto({
  eyebrow,
  titulo,
  atualizacao,
  children,
}: {
  eyebrow: string;
  titulo: string;
  atualizacao: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="conteudo" className="container-page pt-28 md:pt-36">
        <CabecalhoPagina eyebrow={eyebrow} titulo={titulo}>
          <p className="text-[0.9375rem]">Última atualização: {atualizacao}</p>
        </CabecalhoPagina>
        <article
          className="mt-14 max-w-[70ch] text-[1.0625rem] leading-[1.8] text-ink/85 md:mt-20
            [&_h2]:mt-14 [&_h2]:font-serif [&_h2]:text-[1.875rem] [&_h2]:leading-tight [&_h2]:text-ink
            [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:list-disc [&_li]:marker:text-gold
            [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold [&_strong]:text-ink"
        >
          {children}
        </article>
      </main>
      <div className="mt-28 md:mt-40">
        <Footer />
      </div>
    </>
  );
}

/** Marca de pendência, propositalmente visível: substituir antes de publicar. */
export function Pendente({ children }: { children: ReactNode }) {
  return <span className="rounded bg-amber-100 px-1.5 text-[0.9em] text-amber-900">{children}</span>;
}
