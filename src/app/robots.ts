import type { MetadataRoute } from "next";
import { empresa, indexar } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  // Versão de apresentação: bloqueia tudo até NEXT_PUBLIC_INDEXAR=true.
  if (!indexar) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/keystatic", "/admin", "/api/"] },
    sitemap: `${empresa.siteUrl}/sitemap.xml`,
  };
}
