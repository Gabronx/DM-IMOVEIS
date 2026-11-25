"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { lerConsentimento, type Consentimento } from "./AvisoCookies";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Google Analytics 4 e Meta Pixel — carregados SOMENTE depois que o visitante
 * aceita os cookies, e só se os IDs estiverem configurados (.env).
 * Se o visitante recusar depois, a página é recarregada para descarregar os scripts.
 */
export default function Analytics() {
  const [aceito, setAceito] = useState(false);

  useEffect(() => {
    // Lê a escolha salva fora da renderização (localStorage só existe no navegador).
    const inicial = lerConsentimento() === "aceito";
    if (inicial) queueMicrotask(() => setAceito(true));
    const aoMudar = (e: Event) => {
      const valor = (e as CustomEvent<Consentimento>).detail;
      if (valor === "aceito") setAceito(true);
      else if (inicial || aceito) window.location.reload();
    };
    window.addEventListener("dm:consentimento", aoMudar);
    return () => window.removeEventListener("dm:consentimento", aoMudar);
  }, [aceito]);

  if (!aceito) return null;

  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}

/** Botão do rodapé que reabre o aviso de cookies. */
export function BotaoPreferenciasCookies({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("dm:abrir-cookies"))}
    >
      Preferências de cookies
    </button>
  );
}
