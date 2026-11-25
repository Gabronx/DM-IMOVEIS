"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { pausarRolagem } from "@/components/motion/SmoothScroll";
import { IconFechar } from "@/components/ui/Icons";

type Props = {
  fotos: string[];
  /** Legendas por foto (cadastradas no painel), ex.: "Sala de estar com lareira". */
  legendas?: (string | null)[];
  /** Ex.: "Sobrado no Portão, Curitiba" — usado nos textos alternativos. */
  descricao: string;
};

const Seta = ({ dir }: { dir: "esq" | "dir" }) => (
  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
    <path d={dir === "esq" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
  </svg>
);

/**
 * Galeria do imóvel: mosaico no desktop, carrossel com deslize no celular e
 * visualização em tela cheia com teclado (← → Esc) e gesto de arrastar.
 * TODO: legendas por foto (ex.: "Sala de estar") quando o CMS/feed fornecer.
 */
export default function Galeria({ fotos, legendas = [], descricao }: Props) {
  const [aberta, setAberta] = useState<number | null>(null);
  const [atualMovel, setAtualMovel] = useState(0);
  const trilho = useRef<HTMLDivElement>(null);
  const total = fotos.length;
  const alt = (i: number) =>
    legendas[i] ? `${legendas[i]} — ${descricao}` : `${descricao} — foto ${i + 1} de ${total}`;

  const abrir = (i: number) => setAberta(i);
  const fechar = useCallback(() => setAberta(null), []);
  const ir = useCallback(
    (passo: number) => setAberta((a) => (a === null ? a : (a + passo + total) % total)),
    [total],
  );

  // Contador do carrossel do celular
  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    const aoRolar = () => setAtualMovel(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", aoRolar, { passive: true });
    return () => el.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <>
      {/* Celular: carrossel com deslize */}
      <div className="relative -mx-4 md:hidden">
        <div
          ref={trilho}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Fotos do imóvel"
          role="region"
        >
          {fotos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => abrir(i)}
              className="relative aspect-[4/3] w-full shrink-0 snap-center bg-mist"
              aria-label={`Ampliar foto ${i + 1} de ${total}`}
            >
              <Image
                src={src}
                alt={alt(i)}
                fill
                sizes="100vw"
                {...(i === 0 ? { loading: "eager", fetchPriority: "high" } : {})}
                className="object-cover"
              />
            </button>
          ))}
        </div>
        <span className="pointer-events-none absolute bottom-3 right-4 rounded-full bg-ink/75 px-3 py-1 text-[0.75rem] text-white backdrop-blur-sm">
          {atualMovel + 1} / {total}
        </span>
      </div>

      {/* Desktop: mosaico */}
      <div className="hidden h-[min(68vh,640px)] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-[6px] md:grid">
        {fotos.slice(0, 5).map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => abrir(i)}
            className={`group relative overflow-hidden bg-mist ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            aria-label={`Ampliar foto ${i + 1} de ${total}`}
          >
            <Image
              src={src}
              alt={alt(i)}
              fill
              sizes={i === 0 ? "50vw" : "25vw"}
              // Mosaico só aparece no desktop: "lazy" evita baixar estas fotos no celular (onde ficam ocultas)
              {...(i === 0 ? { fetchPriority: "high" } : {})}
              className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" aria-hidden />
          </button>
        ))}
      </div>
      <div className="mt-3 hidden justify-end md:flex">
        <button
          type="button"
          onClick={() => abrir(0)}
          className="flex items-center gap-2 rounded-full border border-ink/20 bg-white px-4 py-2 text-[0.8125rem] transition-colors hover:border-ink"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Ver as {total} fotos
        </button>
      </div>

      {aberta !== null && (
        <TelaCheia fotos={fotos} indice={aberta} alt={alt} onFechar={fechar} onIr={ir} onSelecionar={setAberta} />
      )}
    </>
  );
}

function TelaCheia({
  fotos,
  indice,
  alt,
  onFechar,
  onIr,
  onSelecionar,
}: {
  fotos: string[];
  indice: number;
  alt: (i: number) => string;
  onFechar: () => void;
  onIr: (passo: number) => void;
  onSelecionar: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const miniaturas = useRef<HTMLDivElement>(null);
  const inicio = useRef<{ x: number; y: number } | null>(null);
  const [arraste, setArraste] = useState(0);
  const total = fotos.length;

  useEffect(() => {
    pausarRolagem(true);
    const anterior = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
      if (e.key === "ArrowRight") onIr(1);
      if (e.key === "ArrowLeft") onIr(-1);
    };
    window.addEventListener("keydown", tecla);
    return () => {
      window.removeEventListener("keydown", tecla);
      pausarRolagem(false);
      anterior?.focus();
    };
  }, [onFechar, onIr]);

  // Mantém a miniatura atual visível
  useEffect(() => {
    miniaturas.current
      ?.querySelector<HTMLElement>(`[data-i="${indice}"]`)
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [indice]);

  // Gesto de arrastar (toque ou mouse)
  const aoIniciar = (e: React.PointerEvent) => {
    inicio.current = { x: e.clientX, y: e.clientY };
  };
  const aoMover = (e: React.PointerEvent) => {
    if (!inicio.current) return;
    setArraste(e.clientX - inicio.current.x);
  };
  const aoSoltar = (e: React.PointerEvent) => {
    if (!inicio.current) return;
    const dx = e.clientX - inicio.current.x;
    const dy = e.clientY - inicio.current.y;
    inicio.current = null;
    setArraste(0);
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) onIr(dx < 0 ? 1 : -1);
    else if (dy > 120) onFechar(); // arrastar para baixo fecha
  };

  const vizinhos = [(indice + 1) % total, (indice - 1 + total) % total];

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Galeria de fotos em tela cheia"
      tabIndex={-1}
      data-lenis-prevent
      className="fixed inset-0 z-[70] flex flex-col bg-black/25 text-white backdrop-blur-2xl backdrop-saturate-150 outline-none animate-[aparecer_0.35s_var(--ease-soft)]"
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5">
        <p className="rounded-full bg-black/45 px-3 py-1 text-[0.875rem] tabular-nums text-white" aria-live="polite">
          {indice + 1} / {total}
        </p>
        <button
          type="button"
          onClick={onFechar}
          className="-mr-1 flex size-11 items-center justify-center rounded-full bg-black/45 transition-colors hover:bg-black/65"
        >
          <IconFechar className="size-6" />
          <span className="sr-only">Fechar galeria</span>
        </button>
      </div>

      <div
        className="relative flex-1 touch-pan-y select-none"
        onPointerDown={aoIniciar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={() => {
          inicio.current = null;
          setArraste(0);
        }}
      >
        <div
          className="absolute inset-0 md:inset-x-24"
          style={{
            transform: `translate3d(${arraste}px,0,0)`,
            transition: arraste ? "none" : "transform 0.4s var(--ease-soft)",
          }}
        >
          <Image
            key={fotos[indice]}
            src={fotos[indice]}
            alt={alt(indice)}
            fill
            sizes="100vw"
            className="object-contain animate-[aparecer_0.4s_var(--ease-soft)]"
            draggable={false}
            loading="eager"
          />
        </div>
        {/* Pré-carrega as vizinhas para a troca ser instantânea */}
        <div className="hidden" aria-hidden>
          {vizinhos.map((v) => (
            <Image key={v} src={fotos[v]} alt="" width={1024} height={768} sizes="100vw" />
          ))}
        </div>

        <button
          type="button"
          onClick={() => onIr(-1)}
          className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 backdrop-blur transition-colors hover:bg-black/65 md:flex"
        >
          <Seta dir="esq" />
          <span className="sr-only">Foto anterior</span>
        </button>
        <button
          type="button"
          onClick={() => onIr(1)}
          className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 backdrop-blur transition-colors hover:bg-black/65 md:flex"
        >
          <Seta dir="dir" />
          <span className="sr-only">Próxima foto</span>
        </button>
      </div>

      <div
        ref={miniaturas}
        className="flex gap-2 overflow-x-auto px-4 py-4 [scrollbar-width:none] md:justify-center-safe md:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {fotos.map((src, i) => (
          <button
            key={src}
            type="button"
            data-i={i}
            onClick={() => onSelecionar(i)}
            aria-label={`Ver foto ${i + 1}`}
            aria-current={i === indice}
            className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-[3px] transition-opacity duration-300 ${
              i === indice ? "opacity-100 ring-2 ring-white" : "opacity-45 hover:opacity-80"
            }`}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
