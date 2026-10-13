import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

/* Tipografia primária oficial (brand book p. 21). Licença: SIL OFL via Google Fonts. */
const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RUNZ | Da comunidade à receita recorrente",
  description:
    "Apresentação executiva interativa e painel operacional da RUNZ. Plano de execução, validação e crescimento, outubro de 2026 a março de 2027.",
  applicationName: "RUNZ Executive",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/brand/favicon.png",
    apple: "/brand/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RUNZ",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${beVietnam.variable} h-full`}>
      <head>
        {/* Tipografia secundária oficial (brand book p. 22). Gambetta, Indian Type Foundry,
            distribuída pelo Fontshare sob ITF Free Font License (uso web permitido). */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=gambetta@400,500,600,700,401,501&display=swap"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
