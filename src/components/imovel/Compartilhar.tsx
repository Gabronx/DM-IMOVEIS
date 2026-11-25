"use client";

import { useState } from "react";
import { IconWhatsApp } from "@/components/ui/Icons";

/** Compartilhar: menu nativo do celular quando existe; senão, WhatsApp e copiar link. */
export default function Compartilhar({ titulo, url }: { titulo: string; url: string }) {
  const [copiado, setCopiado] = useState(false);

  async function compartilhar() {
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, url });
        return;
      } catch {
        return; // usuário cancelou
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {}
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={compartilhar}
        className="flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-[0.8125rem] transition-colors hover:border-ink"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
          <path d="M12 15V3m0 0L8 7m4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
        </svg>
        <span aria-live="polite">{copiado ? "Link copiado!" : "Compartilhar"}</span>
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex size-9 items-center justify-center rounded-full border border-ink/20 transition-colors hover:border-ink"
      >
        <IconWhatsApp className="size-4" />
        <span className="sr-only">Compartilhar no WhatsApp</span>
      </a>
    </div>
  );
}
