import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },

  async headers() {
    const isProd = process.env.NODE_ENV === 'production';

    const securityHeaders: { key: string; value: string }[] = [];

    // CSP solo en producción (React usa eval() en desarrollo)
    if (isProd) {
      securityHeaders.push({
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' https: data: blob:",
          "connect-src 'self' https://*.supabase.co https://*.tile.openstreetmap.org https://unpkg.com",
          "font-src 'self'",
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
      });
    }

    securityHeaders.push(
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(self)" }
    );

    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
