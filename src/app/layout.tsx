import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alisson de Almeida de Oliveira — Full Stack Developer",
  description:
    "Portfólio de Alisson de Almeida de Oliveira, desenvolvedor Full Stack com experiência em Laravel, Flask, React, Next.js, Vue.js e NestJS.",
  keywords: [
    "Full Stack Developer",
    "Laravel",
    "Flask",
    "React",
    "Next.js",
    "Vue.js",
    "NestJS",
    "Portfólio",
    "Alisson de Almeida de Oliveira",
  ],
  authors: [{ name: "Alisson de Almeida de Oliveira" }],
  openGraph: {
    title: "Alisson de Almeida de Oliveira — Full Stack Developer",
    description:
      "Desenvolvedor Full Stack apaixonado por criar experiências digitais premium.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-[var(--background)] antialiased">
        {children}
      </body>
    </html>
  );
}
