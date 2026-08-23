import type { Metadata } from "next";
import Script from "next/script";
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
    "Web developer portfolio with immersive Canvas animations and interactive experiences.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
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
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} ${handwriting.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="bg-theme-bg font-sans text-theme-text antialiased">
        <Script
          id="portfolio-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
