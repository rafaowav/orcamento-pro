import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// AQUI ESTÁ O OURO DO SEO PARA O GOOGLE
export const metadata: Metadata = {
  title: "OrçamentoPRO - Gerador de Orçamento PDF Grátis",
  description: "Crie orçamentos profissionais em PDF gratuitamente em segundos. Ferramenta grátis para freelancers, prestadores de serviço e pequenas empresas.",
  keywords: ["gerar orçamento", "orçamento pdf", "fazer orçamento online", "modelo de orçamento", "orçamento para prestador de serviço", "recibo pdf", "grátis", "orcamentopro"],
  openGraph: {
    title: "OrçamentoPRO - Gerador de Orçamento PDF Grátis",
    description: "Crie orçamentos profissionais em PDF pelo celular ou PC em segundos.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}