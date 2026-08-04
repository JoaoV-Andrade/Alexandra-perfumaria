import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite o next/image otimizar o SVG da nossa logo em public/ (arquivo
    // nosso e confiável, não é upload de usuário).
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
