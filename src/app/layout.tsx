import type { Metadata, Viewport } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import "./global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alisson de Almeida — Full Stack Developer",
  description:
    "Full Stack Developer with over 3 years of experience building scalable backends, modern interfaces, and high-performance software.",
  keywords: [
    "Full Stack Developer",
    "Laravel",
    "Flask",
    "React",
    "Next.js",
    "Vue.js",
    "NestJS",
    "Portfolio",
    "Alisson de Almeida",
  ],
  authors: [{ name: "Alisson de Almeida" }],
  openGraph: {
    title: "Alisson de Almeida — Full Stack Developer",
    description:
      "Full Stack Developer passionate about building reliable, maintainable, and high-performance software.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="min-h-full bg-[var(--background)] antialiased">
        {children}
      </body>
    </html>
  );
}
