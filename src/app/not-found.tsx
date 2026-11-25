import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NaoEncontrada() {
  return (
    <>
      <Header />
      <main id="conteudo" className="container-page pb-28 pt-40 md:pb-40 md:pt-52">
        <p className="eyebrow text-gold">Erro 404</p>
        <h1 className="mt-4 max-w-[18ch] font-serif text-[2.75rem] leading-[1.04] md:text-[4.25rem]">
          Esta página não foi encontrada.
        </h1>
        <p className="mt-5 max-w-[48ch] text-[1.0625rem] leading-relaxed text-graphite">
          O endereço pode ter mudado ou o imóvel pode já ter sido vendido. Veja os imóveis disponíveis ou volte ao
          início.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/comprar"
            className="rounded-full bg-ink px-6 py-3 text-[0.875rem] font-medium text-white transition-colors duration-300 hover:bg-gold"
          >
            Ver imóveis à venda
          </Link>
          <Link
            href="/"
            className="rounded-full border border-ink/20 px-6 py-3 text-[0.875rem] transition-colors hover:border-ink"
          >
            Página inicial
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
