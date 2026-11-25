import Image from "next/image";
import Link from "next/link";
import Caracteristicas from "./Caracteristicas";
import { formatarPreco, localImovel, urlImovel, type Imovel } from "@/lib/imoveis";

export default function CardImovel({
  imovel,
  prioridade = false,
  formato = "retrato",
}: {
  imovel: Imovel;
  prioridade?: boolean;
  formato?: "retrato" | "paisagem";
}) {
  return (
    <article className="group relative flex h-full flex-col">
      <div
        className={`relative overflow-hidden rounded-[3px] bg-mist ${
          formato === "retrato" ? "aspect-[4/5]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={imovel.fotos[0]}
          alt={`${imovel.tipo} no ${imovel.bairro}, ${imovel.cidade}`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          {...(prioridade ? { loading: "eager", fetchPriority: "high" } : {})}
          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.045]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ink backdrop-blur-sm">
          {imovel.tipo}
        </span>
      </div>

      {/* O preço fica sempre no pé do card, alinhado com os vizinhos mesmo quando o título ocupa 1 linha só */}
      <div className="flex flex-1 flex-col pt-5">
        <p className="eyebrow text-[0.6875rem] text-graphite">{localImovel(imovel)}</p>
        <h3 className="mt-2 font-serif text-[1.5rem] leading-[1.15] font-medium text-balance line-clamp-2">
          <Link href={urlImovel(imovel)} className="after:absolute after:inset-0">
            {imovel.titulo}
          </Link>
        </h3>
        <Caracteristicas imovel={imovel} className="mt-4 mb-5" />
        <div className="mt-auto flex items-baseline justify-between border-t border-line pt-4">
          <p className="text-[1.0625rem] font-medium tracking-tight">{formatarPreco(imovel.preco)}</p>
          <p className="text-[0.75rem] text-graphite">Cód. {imovel.codigo}</p>
        </div>
      </div>
    </article>
  );
}
