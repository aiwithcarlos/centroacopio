import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "CAV - Centro Acopio Venezuela | Ayuda Humanitaria",
  description:
    "Mapa de centros de acopio para ayuda humanitaria a Venezuela. Encuentra dónde llevar insumos médicos, alimentos y refugios tras los terremotos.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "CAV - Centro Acopio Venezuela",
    description:
      "Encuentra centros de acopio para ayuda humanitaria a Venezuela tras los terremotos.",
    type: "website",
    locale: "es_VE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
