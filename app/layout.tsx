import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieConsentBanner from "@/components/CookieConsentBanner";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://orcafacil.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Orçafácil - Gerador de Orçamento PDF Grátis",
  description:
    "Crie orçamentos profissionais em PDF gratuitamente em segundos. Ferramenta grátis para freelancers, prestadores de serviço e pequenas empresas.",
  keywords: [
    "gerar orçamento",
    "orçamento pdf",
    "fazer orçamento online",
    "modelo de orçamento",
    "orçamento para prestador de serviço",
    "recibo pdf",
    "grátis",
    "orcafacil",
  ],
  openGraph: {
    title: "Orçafácil - Gerador de Orçamento PDF Grátis",
    description:
      "Crie orçamentos profissionais em PDF pelo celular ou PC em segundos.",
    url: BASE_URL,
    siteName: "Orçafácil",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orçafácil - Gerador de Orçamento PDF Grátis",
    description:
      "Crie orçamentos profissionais em PDF gratuitamente. Rápido, fácil e sem cadastro.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}