"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CHAVE = "dm-consentimento";

export type Consentimento = "aceito" | "recusado";

/** Lê a escolha do visitante. GA4 e Meta Pixel só carregam com "aceito". */
export function lerConsentimento(): Consentimento | null {
  try {
    return (localStorage.getItem(CHAVE) as Consentimento | null) ?? null;
  } catch {
    return null;
  }
}

export default function AvisoCookies() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisivel(lerConsentimento() === null), 1200);
    // "Preferências de cookies" (rodapé) reabre o aviso
    const reabrir = () => setVisivel(true);
    window.addEventListener("dm:abrir-cookies", reabrir);
    return () => {
      clearTimeout(t);
      window.removeEventListener("dm:abrir-cookies", reabrir);
    };
  }, []);

  function escolher(valor: Consentimento) {
    try {
      localStorage.setItem(CHAVE, valor);
    } catch {}
    window.dispatchEvent(new CustomEvent("dm:consentimento", { detail: valor }));
    setVisivel(false);
  }

  if (!visivel) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-4 bottom-24 z-40 max-w-sm rounded-[10px] border border-line bg-paper p-5 text-[0.8125rem] leading-relaxed text-graphite shadow-[0_20px_40px_-20px_rgba(3,3,26,0.35)] md:bottom-28 md:left-auto md:right-8"
    >
      <p>
        Usamos cookies para entender como o site é usado e melhorar a sua experiência. Saiba mais na{" "}
        <Link href="/privacidade" className="text-ink underline underline-offset-2">
          Política de privacidade
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => escolher("aceito")}
          className="rounded-full bg-ink px-4 py-2 text-white transition-colors hover:bg-gold"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={() => escolher("recusado")}
          className="rounded-full border border-line px-4 py-2 text-ink transition-colors hover:border-ink"
        >
          Recusar
        </button>
      </div>
    </div>
  );
}
