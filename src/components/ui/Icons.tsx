import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconQuarto = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 19V7m0 8h18v4M3 12h7.5a2.5 2.5 0 0 1 2.5 2.5V15m0-3h5.5a2.5 2.5 0 0 1 2.5 2.5V15" />
  </svg>
);
export const IconSuite = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 19V9m0 6h18v4m-18-7h7a2 2 0 0 1 2 2v1m0-3h7a2 2 0 0 1 2 2v1M16 3l.9 1.8L19 5.1l-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L13 5.1l2.1-.3z" />
  </svg>
);
export const IconBanheiro = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12h16v2.5A4.5 4.5 0 0 1 15.5 19h-7A4.5 4.5 0 0 1 4 14.5zM6 12V6.5a2.5 2.5 0 0 1 5 0M7 19l-1 2m11-2 1 2" />
  </svg>
);
export const IconVaga = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 16v-4.5L7 6h10l2 5.5V16M5 16h14M7 16v2.5m10-2.5v2.5M5 11.5h14M8 13.5h.01M16 13.5h.01" />
  </svg>
);
export const IconArea = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5m11-5v5h-5" />
  </svg>
);
export const IconSeta = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14m-5-5 5 5-5 5" />
  </svg>
);
export const IconWhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
  </svg>
);
export const IconMenu = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const IconFechar = (p: P) => (
  <svg {...base} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);
export const IconBusca = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.4-4.4" />
  </svg>
);
export const IconEstrela = ({ preenchimento = 1, ...p }: P & { preenchimento?: number }) => {
  const id = `est-${Math.round(preenchimento * 100)}`;
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...p}>
      <defs>
        <linearGradient id={id}>
          <stop offset={`${preenchimento * 100}%`} stopColor="currentColor" />
          <stop offset={`${preenchimento * 100}%`} stopColor="currentColor" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z"
      />
    </svg>
  );
};

/* Marcas das redes sociais (glifos oficiais, preenchidos com a cor do texto). */
export const IconInstagram = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...p}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.3" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);
export const IconFacebook = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
  </svg>
);
export const IconX = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);
