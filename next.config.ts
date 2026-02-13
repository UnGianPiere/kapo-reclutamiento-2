import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Configuración para Turbopack (Next.js 16)
  turbopack: {},

  headers: async () => [
    {
      source: '/manifest.json',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600',
        },
      ],
    },
  ],
};

export default nextConfig;
