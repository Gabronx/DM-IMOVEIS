import type { MetadataRoute } from "next";
import { empresa } from "@/content/site";
import { getImoveis, urlImovel } from "@/lib/imoveis";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = empresa.siteUrl;
  const imoveis = await getImoveis();
  const paginas: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/comprar`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/alugar`, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/anuncie`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/sobre`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contato`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/termos`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${base}/privacidade`, changeFrequency: "yearly", priority: 0.1 },
  ];
  return [
    ...paginas,
    ...imoveis.map((i) => ({
      url: `${base}${urlImovel(i)}`,
      lastModified: i.atualizadoEm,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: i.fotos.slice(0, 5),
    })),
  ];
}
