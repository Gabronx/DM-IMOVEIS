import Image from "next/image";
import { IconEstrela } from "@/components/ui/Icons";
import { getAvaliacoes } from "@/lib/conteudo";

const tons = ["#16130e", "#8b6b2e", "#5d5e6b", "#6f5524"];

const iniciais = (nome: string) =>
  nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

/** "Mariana, Rafael e +46 clientes" */
function quemAvaliou(nomes: string[], total: number) {
  const exibidos = nomes.slice(0, 2);
  const resto = Math.max(0, total - exibidos.length);
  if (exibidos.length === 0) return `${total} clientes`;
  return resto > 0 ? `${exibidos.join(", ")} e +${resto} clientes` : exibidos.join(" e ");
}

/**
 * Resumo de avaliações: fotos sobrepostas (estilo "seguidores em comum")
 * e nota geral com estrelas. Editável no painel → Avaliações.
 * TODO: os dados atuais são SIMULADOS — trocar por avaliações reais antes de publicar.
 */
export default async function Avaliacoes({ className = "container-page py-16 md:py-20" }: { className?: string }) {
  const dados = await getAvaliacoes();
  const { nota, pessoas } = dados;
  const total = dados.total ?? 0;
  const estrelas = Array.from({ length: 5 }, (_, i) => Math.max(0, Math.min(1, nota - i)));
  // Arredonda a última estrela para quartos (4,9 → 4 cheias + 75%), como no pedido.
  const preenchimentos = estrelas.map((v) => (v === 1 ? 1 : Math.floor(v * 4) / 4));

  return (
    <section aria-labelledby="avaliacoes-titulo" className={className}>
      <div
        data-reveal
        className="flex flex-col gap-8 rounded-[12px] border border-line bg-white px-6 py-8 md:flex-row md:items-center md:justify-between md:px-12 md:py-10"
      >
        {/* Celular: fotos em cima e texto centralizado embaixo. Desktop: lado a lado. */}
        <div className="flex flex-col items-center gap-2 text-center md:flex-row md:gap-5 md:text-left">
          <ul className="flex shrink-0" aria-hidden>
            {pessoas.map((p, i) => (
              <li
                key={`${p.nome}-${i}`}
                className="-ml-3 size-12 overflow-hidden rounded-full border-[3px] border-white first:ml-0 md:size-14"
                style={{ background: tons[i % tons.length], zIndex: pessoas.length - i }}
              >
                {p.foto ? (
                  <Image src={p.foto} alt="" width={56} height={56} className="size-full object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center text-[0.8125rem] font-semibold text-white">
                    {iniciais(p.nome)}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div>
            <h2 id="avaliacoes-titulo" className="text-[0.875rem] font-semibold md:text-[0.9375rem]">
              {quemAvaliou(
                pessoas.map((p) => p.nome),
                total,
              )}
            </h2>
            <p className="mt-0.5 text-[0.8125rem] text-graphite md:text-[0.875rem]">avaliaram o atendimento da DM</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-5 border-t border-line pt-6 md:border-l md:border-t-0 md:pl-12 md:pt-0">
          {/* Algarismos alinhados (lining): sem o "9" descendo, a nota fica no mesmo centro das estrelas */}
          <p className="font-serif text-[3.75rem] leading-none [font-variant-numeric:lining-nums]">{nota.toLocaleString("pt-BR")}</p>
          <div>
            <div className="flex gap-0.5 text-gold" role="img" aria-label={`Nota ${nota.toLocaleString("pt-BR")} de 5`}>
              {preenchimentos.map((p, i) => (
                <IconEstrela key={i} preenchimento={p} className="size-5" />
              ))}
            </div>
            <p className="mt-1.5 text-[0.8125rem] text-graphite">
              de 5 · {total} avaliações
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
