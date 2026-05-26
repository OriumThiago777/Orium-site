import { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

export const metadata: Metadata = {
  metadataBase: new URL("https://oriumagencia.com.br"),

  title: {
    default: "ORIUM | Estruturação Digital para Negócios Locais",
    template: "%s | ORIUM",
  },

  description:
    "A ORIUM estrutura a presença digital de negócios locais com branding, sites, conteúdo, posicionamento e automação.",

  keywords: [
    "ORIUM",
    "agência digital",
    "estruturação digital",
    "negócios locais",
    "branding",
    "sites",
    "conteúdo",
    "automação",
    "marketing digital",
    "presença digital",
    "Belo Horizonte",
  ],

  authors: [{ name: "ORIUM" }],
  creator: "ORIUM",
  publisher: "ORIUM",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "ORIUM | Estrutura Digital para Negócios Locais",
    description:
      "Branding, sites, conteúdo e automação para negócios locais que querem crescer com mais estrutura, percepção e presença profissional.",
    url: "https://oriumagencia.com.br",
    siteName: "ORIUM",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ORIUM - Estrutura digital para negócios locais",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ORIUM | Estrutura Digital para Negócios Locais",
    description:
      "Branding, sites, conteúdo e automação para negócios locais que querem crescer com mais estrutura e presença profissional.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Suspense fallback={null}>
  <FloatingWhatsApp />
</Suspense>
      </body>
    </html>
  );
}