"use client";

import { usePathname } from "next/navigation";
import { IconWhatsApp } from "@/components/ui/Icons";
import { linkWhatsApp } from "@/content/site";

export default function WhatsAppFlutuante() {
  // Na página do imóvel, no celular, a barra fixa inferior já tem o WhatsApp.
  const naPaginaDoImovel = usePathname().startsWith("/imovel/");

  return (
    <a
      href={linkWhatsApp("Olá! Vim pelo site da DM Consultoria e gostaria de mais informações.")}
      target="_blank"
      rel="noopener noreferrer"
      className={`group fixed bottom-5 right-5 z-40 items-center rounded-full bg-ink p-3.5 text-white shadow-[0_12px_30px_-10px_rgba(3,3,26,0.6)] transition-all duration-500 ease-[var(--ease-soft)] hover:bg-gold md:bottom-8 md:right-8 md:hover:pr-5 ${
        naPaginaDoImovel ? "hidden lg:flex" : "flex"
      }`}
    >
      <IconWhatsApp className="size-6" />
      <span className="sr-only md:not-sr-only md:max-w-0 md:overflow-hidden md:whitespace-nowrap md:text-[0.875rem] md:transition-[max-width,margin] md:duration-500 md:group-hover:ml-2 md:group-hover:max-w-40">
        Fale no WhatsApp
      </span>
    </a>
  );
}
