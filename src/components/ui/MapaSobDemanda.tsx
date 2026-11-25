"use client";

import { useState } from "react";

/**
 * Mapa do Google carregado só quando o visitante pede.
 * O iframe do Maps é pesado (≈1 MB de scripts) e grava cookies do Google;
 * carregando sob demanda, a página abre mais rápido e respeita a LGPD.
 */
export default function MapaSobDemanda({
  src,
  titulo,
  endereco,
  linkExterno,
  className = "",
}: {
  src: string;
  titulo: string;
  endereco: string;
  linkExterno: string;
  className?: string;
}) {
  const [ativo, setAtivo] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-[6px] border border-line bg-mist ${className}`}>
      {ativo ? (
        <iframe
          src={src}
          title={titulo}
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full grayscale-[35%]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_center,var(--color-gold-soft)_0,transparent_70%)] p-6 text-center">
          {/* Malha discreta, sugerindo um mapa */}
          <svg aria-hidden className="absolute inset-0 size-full text-line" preserveAspectRatio="none">
            <defs>
              <pattern id="malha-mapa" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M36 0H0v36" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#malha-mapa)" />
          </svg>
          <span className="relative flex size-12 items-center justify-center rounded-full bg-gold text-white shadow-[0_10px_24px_-8px_rgba(43,43,184,0.6)]">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
          </span>
          <p className="relative max-w-[30ch] text-[0.9375rem]">{endereco}</p>
          <div className="relative flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setAtivo(true)}
              className="rounded-full bg-ink px-5 py-2.5 text-[0.875rem] font-medium text-white transition-colors duration-300 hover:bg-gold"
            >
              Ver no mapa
            </button>
            <a
              href={linkExterno}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink/20 bg-white px-5 py-2.5 text-[0.875rem] transition-colors hover:border-ink"
            >
              Abrir no Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
