import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono, Just_Me_Again_Down_Here } from "next/font/google";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const handwriting = Just_Me_Again_Down_Here({
  variable: "--font-handwriting",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alisson de Almeida de Oliveira — Full-Stack Developer",
  description:
    "Portfólio de desenvolvedor web com animações imersivas em Canvas e experiências interativas.",
};

const themeScript = `
  (function() {
    try {
      var t = localStorage.getItem('portfolio-theme');
      document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${geistMono.variable} ${handwriting.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-theme-bg font-sans text-theme-text antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
