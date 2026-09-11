import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getaiassistant.app';

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
  title: 'AiAssistant by InnovaMontreal — Adoption de l’IA en entreprise',
  description: 'Nous accompagnons votre entreprise dans l’adoption pratique et responsable de l’intelligence artificielle.',
  keywords: ['adoption de l’IA', 'intelligence artificielle en entreprise', 'conseil en IA', 'automatisation des processus'],
  alternates: {
    canonical: '/',
    languages: { es: '/es/', en: '/en/', fr: '/', 'x-default': '/' },
  },
  openGraph: {
    title: 'Une IA qui travaille avec votre équipe.',
    description: 'Adoption concrète. Résultats mesurables.',
    type: 'website',
    locale: 'fr_CA',
    alternateLocale: ['en_US', 'es_ES'],
    images: [{ url: '/og.png', width: 1730, height: 909, alt: 'AiAssistant — Une IA qui travaille avec votre équipe' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Une IA qui travaille avec votre équipe.',
    description: 'Adoption concrète. Résultats mesurables.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
