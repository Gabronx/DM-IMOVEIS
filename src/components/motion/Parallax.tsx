"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Fração da rolagem aplicada como deslocamento (0.3 = 30%). */
  velocidade?: number;
  className?: string;
};

/**
 * Desloca o conteúdo mais devagar que a página, criando o efeito parallax.
 * Só calcula enquanto o elemento está visível e respeita movimento reduzido.
 */
export default function Parallax({ children, velocidade = 0.3, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pai = el.parentElement ?? el;
    let visivel = true;
    let frame = 0;

    const atualizar = () => {
      frame = 0;
      if (!visivel) return;
      const topo = pai.getBoundingClientRect().top;
      el.style.transform = `translate3d(0, ${(-topo * velocidade).toFixed(1)}px, 0)`;
    };
    const agendar = () => {
      if (!frame) frame = requestAnimationFrame(atualizar);
    };

    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      agendar();
    });
    io.observe(pai);
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    atualizar();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      cancelAnimationFrame(frame);
    };
  }, [velocidade]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
