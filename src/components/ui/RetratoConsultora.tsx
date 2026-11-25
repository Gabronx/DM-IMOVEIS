import Image from "next/image";
import { empresa } from "@/content/site";
import { getSobre } from "@/lib/conteudo";

/**
 * Retrato da consultora (PNG sem fundo) sobre o mesmo branco da página com degradê escuro na base, onde ficam nome e CRECI.
 * Fotos no painel → A consultoria: "Foto da consultora (home)" e "Foto da consultora (página A consultoria)".
 */
export default async function RetratoConsultora({
  prioridade = false,
  className = "",
  pagina = "home",
}: {
  prioridade?: boolean;
  className?: string;
  /** Qual foto usar: a da home ou a da página "A consultoria" (que cai na da home se estiver vazia). */
  pagina?: "home" | "sobre";
}) {
  const sobre = await getSobre();
  const fotoConsultora = pagina === "sobre" ? (sobre.fotoPaginaSobre ?? sobre.fotoConsultora) : sobre.fotoConsultora;
  return (
    <figure className={`relative aspect-[4/5] overflow-hidden rounded-[3px] bg-paper ${className}`}>
      {fotoConsultora && (
        <Image
          src={fotoConsultora}
          alt={`${empresa.consultora}, consultora imobiliária da ${empresa.nome}`}
          fill
          sizes="(min-width: 768px) 45vw, 92vw"
          {...(prioridade ? { loading: "eager", fetchPriority: "high" } : {})}
          className="object-contain object-bottom"
        />
      )}
      <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(28,28,36,0.62)_0%,rgba(28,28,36,0.46)_22%,rgba(28,28,36,0.26)_48%,rgba(28,28,36,0.1)_74%,rgba(28,28,36,0.03)_90%,transparent_100%)] p-6 pt-44 text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] md:p-8 md:pt-52">
        <span className="block font-serif text-[1.875rem] leading-none">{empresa.consultora}</span>
        <span className="mt-2 block text-[0.8125rem] text-white/80">Consultora imobiliária · {empresa.creci}</span>
      </figcaption>
    </figure>
  );
}
