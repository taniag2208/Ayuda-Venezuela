import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import disasterConfig from "@/lib/disaster-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${disasterConfig.name} — Plataforma de Respuesta Humanitaria`,
    template: `%s | ${disasterConfig.name}`,
  },
  description: disasterConfig.description,
  keywords: [
    "ayuda humanitaria",
    "emergencia",
    disasterConfig.country,
    "terremoto",
    "voluntarios",
    "donaciones",
    "centros de ayuda",
  ],
  openGraph: {
    title: disasterConfig.name,
    description: disasterConfig.description,
    type: "website",
    locale: "es_VE",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#CF2233" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
