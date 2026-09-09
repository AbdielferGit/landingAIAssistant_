import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'AiAssistant — Adopción de IA para empresas',
  description: 'Acompañamos a tu empresa en la adopción práctica y responsable de inteligencia artificial.',
  keywords: ['adopción de IA', 'inteligencia artificial para empresas', 'consultoría IA', 'automatización de procesos'],
  alternates: {
    canonical: '/',
    languages: { es: '/', en: '/en/', fr: '/fr/' },
  },
  openGraph: {
    title: 'IA que trabaja con tu equipo.',
    description: 'Adopción práctica. Resultados medibles.',
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['en_US', 'fr_CA'],
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'AiAssistant — IA que trabaja con tu equipo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IA que trabaja con tu equipo.',
    description: 'Adopción práctica. Resultados medibles.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
