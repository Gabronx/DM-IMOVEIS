import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Fotos dos imóveis hospedadas pela EEmovel (enquanto forem a fonte dos dados).
    remotePatterns: [{ protocol: "https", hostname: "brokers.eemovel.com.br", pathname: "/media/**" }],
  },
  // O conteúdo editável (/content) é lido do disco em tempo de execução: garante que ele
  // vá junto para as funções do servidor na hospedagem (Netlify).
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  // Atalho fácil de lembrar para o painel de conteúdo
  async redirects() {
    return [{ source: "/admin", destination: "/keystatic", permanent: false }];
  },
  // Cabeçalhos básicos de segurança
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
