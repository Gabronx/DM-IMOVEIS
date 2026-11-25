"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let instancia: Lenis | null = null;

/** Pausa/retoma a rolagem da página (menus, gavetas e galeria em tela cheia). */
export function pausarRolagem(pausar: boolean) {
  document.documentElement.classList.toggle("lenis-stopped", pausar);
  if (pausar) instancia?.stop();
  else instancia?.start();
}

/**
 * Rolagem suave (Lenis) para a página inteira.
 * Desativada quando o usuário prefere movimento reduzido.
 * A revelação dos blocos (`data-reveal`) é feita só com CSS, em globals.css.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    instancia = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -96 },
      autoRaf: true,
    });

    return () => {
      instancia?.destroy();
      instancia = null;
    };
  }, []);

  return null;
}
