import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: "/portfolio-alimenticio",
        destination: "https://orium-portfolio-alimenticio.vercel.app",
      },
      {
        source: "/portfolio-alimenticio/:path*",
        destination: "https://orium-portfolio-alimenticio.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;
