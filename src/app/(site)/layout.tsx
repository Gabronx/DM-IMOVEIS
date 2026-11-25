import SmoothScroll from "@/components/motion/SmoothScroll";
import WhatsAppFlutuante from "@/components/layout/WhatsAppFlutuante";
import AvisoCookies from "@/components/layout/AvisoCookies";
import Analytics from "@/components/layout/Analytics";

/** Elementos globais do site público (não aparecem no painel /keystatic). */
export default function LayoutSite({ children }: LayoutProps<"/">) {
  return (
    <>
      {children}
      <WhatsAppFlutuante />
      <AvisoCookies />
      <Analytics />
      <SmoothScroll />
    </>
  );
}
