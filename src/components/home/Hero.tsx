import { getImageProps } from "next/image";
import Parallax from "@/components/motion/Parallax";
import BuscaHome from "@/components/busca/BuscaHome";
import type { ConteudoHome } from "@/lib/conteudo";
import type { OpcoesBusca } from "@/lib/imoveis";

const PADRAO = "/img/site/hero/imagem.jpg";

export default function Hero({ opcoes, hero }: { opcoes: OpcoesBusca; hero: ConteudoHome["hero"] }) {
  const { tituloLinha1: l1, tituloLinha2: l2, tituloLinha3: l3 } = hero;

  // Imagem principal da página (LCP): carrega já, com prioridade alta.
  const comum = { alt: hero.imagemAlt, fill: true, loading: "eager", fetchPriority: "high" } as const;
  const desktop = getImageProps({ ...comum, src: hero.imagem ?? PADRAO, sizes: "100vw" }).props;
  // Sem foto vertical, usa a horizontal maior (ela é cortada pelas laterais em telas em pé).
  const temCelular = Boolean(hero.imagemCelular);
  const { srcSet, sizes, ...rest } = getImageProps({
    ...comum,
    src: hero.imagemCelular ?? hero.imagem ?? PADRAO,
    sizes: temCelular ? "100vw" : "200vh",
  }).props;
  const celular = { srcSet, sizes, rest };

  return (
    <>
      <section
        aria-labelledby="hero-titulo"
        className="relative isolate h-[92svh] min-h-[580px] max-h-[1000px] overflow-hidden bg-[#16130e] text-white"
      >
        {/* Foto com parallax: fica maior que a seção e desliza mais devagar que a página */}
        <Parallax velocidade={0.35} className="absolute inset-x-0 -top-[6%] -z-10 h-[124%]">
          {/* Foto horizontal em telas deitadas e vertical em telas em pé (celular) */}
          <picture>
            <source media="(min-aspect-ratio: 1/1)" srcSet={desktop.srcSet} sizes="100vw" />
            <source media="(max-aspect-ratio: 1/1)" srcSet={celular.srcSet} sizes={celular.sizes} />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- o alt vem nas props geradas por getImageProps */}
            <img {...celular.rest} className="object-cover object-[50%_60%]" />
          </picture>
        </Parallax>
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(22,19,14,0.5)_0%,rgba(22,19,14,0.08)_32%,rgba(22,19,14,0.2)_55%,rgba(22,19,14,0.72)_100%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(22,19,14,0.55)_0%,rgba(22,19,14,0.2)_45%,transparent_70%)]"
          aria-hidden
        />
        {/* Toque de dourado claro bem leve sobre a foto (mais sutil que no rodapé, para não apagar as cores) */}
        <div className="absolute inset-0 -z-10 bg-[#efe2c2] opacity-[0.12] mix-blend-color" aria-hidden />

        <Parallax velocidade={0.12} className="container-page flex h-full flex-col justify-end pb-24 md:pb-36">
          {hero.eyebrow && (
            <p className="eyebrow mb-5 text-white/85 animate-[surgir_1.2s_var(--ease-soft)_0.2s_both]">{hero.eyebrow}</p>
          )}
          <h1
            id="hero-titulo"
            className="max-w-[24ch] font-display text-[1.875rem] leading-[1.12] font-normal tracking-[0.01em] text-balance sm:text-[2.5rem] lg:text-[3.25rem] xl:text-[3.75rem]"
          >
            <span className="block animate-[surgir_1.3s_var(--ease-soft)_0.3s_both]">{l1}</span>
            {l2 && <em className="block animate-[surgir_1.3s_var(--ease-soft)_0.42s_both]">{l2}</em>}
            {l3 && <span className="block animate-[surgir_1.3s_var(--ease-soft)_0.54s_both]">{l3}</span>}
          </h1>
          {hero.subtitulo && (
            <p className="mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed text-white/90 animate-[surgir_1.3s_var(--ease-soft)_0.62s_both] md:text-[1.25rem]">
              {hero.subtitulo}
            </p>
          )}
        </Parallax>
      </section>

      <div className="container-page relative z-10 -mt-12 animate-[surgir_1.3s_var(--ease-soft)_0.75s_both] md:-mt-14">
        <BuscaHome opcoes={opcoes} />
      </div>
    </>
  );
}
