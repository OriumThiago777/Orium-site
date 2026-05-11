import type { Metadata } from "next";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORIUM | Estruturação Digital para Negócios Locais",
  description:
    "Branding, posicionamento, sites, conteúdo, automação e estrutura digital para negócios locais que querem crescer com presença profissional.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  keywords: [
    "ORIUM",
    "estruturação digital",
    "branding",
    "sites",
    "social media",
    "automação",
    "negócios locais",
    "posicionamento digital",
    "Belo Horizonte",
  ],
  authors: [{ name: "ORIUM" }],
  creator: "ORIUM",
  publisher: "ORIUM",
  metadataBase: new URL("https://oriumagencia.com.br"),
  openGraph: {
    title: "ORIUM | Estruturação Digital para Negócios Locais",
    description:
      "Branding, posicionamento, sites, conteúdo, automação e estrutura digital para negócios locais que querem crescer com presença profissional.",
    url: "https://oriumagencia.com.br",
    siteName: "ORIUM",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ORIUM | Estruturação Digital para Negócios Locais",
    description:
      "Branding, posicionamento, sites, conteúdo, automação e estrutura digital para negócios locais que querem crescer com presença profissional.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full bg-black text-white">
        {children}

        <FloatingWhatsApp />
      </body>
    </html>
  );
}
