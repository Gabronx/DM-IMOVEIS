import { IconArea, IconBanheiro, IconQuarto, IconVaga } from "@/components/ui/Icons";
import type { Imovel } from "@/lib/imoveis";

function plural(n: number, um: string, varios: string) {
  return `${n} ${n === 1 ? um : varios}`;
}

/** Características com ícone de linha e legenda sempre visível. */
export default function Caracteristicas({
  imovel,
  className = "",
}: {
  imovel: Imovel;
  className?: string;
}) {
  const itens = [
    imovel.quartos != null && { Icon: IconQuarto, texto: plural(imovel.quartos, "quarto", "quartos") },
    imovel.banheiros != null && { Icon: IconBanheiro, texto: plural(imovel.banheiros, "banheiro", "banheiros") },
    imovel.vagas != null && { Icon: IconVaga, texto: plural(imovel.vagas, "vaga", "vagas") },
    imovel.areaUtil != null && { Icon: IconArea, texto: `${imovel.areaUtil.toLocaleString("pt-BR")} m²` },
  ].filter(Boolean) as { Icon: typeof IconQuarto; texto: string }[];

  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-2 text-[0.8125rem] text-graphite ${className}`}>
      {itens.map(({ Icon, texto }) => (
        <li key={texto} className="flex items-center gap-1.5">
          <Icon className="size-[1.05rem] shrink-0 text-gold" />
          {texto}
        </li>
      ))}
    </ul>
  );
}
