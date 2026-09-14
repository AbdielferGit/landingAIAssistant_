import type { Metadata } from 'next';
import LandingPage from '../LandingPage';

export const metadata: Metadata = {
  title: 'Rive Intelligente by Innova Montreal — Adoption de l’IA en entreprise',
  description: 'Nous accompagnons votre entreprise dans l’adoption pratique et responsable de l’intelligence artificielle.',
  alternates: {
    canonical: '/',
    languages: { es: '/es/', en: '/en/', fr: '/', 'x-default': '/' },
  },
  openGraph: {
    title: 'Une IA qui travaille avec votre équipe.',
    description: 'Adoption concrète. Résultats mesurables.',
    type: 'website',
    locale: 'fr_CA',
    images: [{ url: '/og.png', width: 1730, height: 909, alt: 'Rive Intelligente — L’humain au cœur de l’adoption de l’IA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Une IA qui travaille avec votre équipe.',
    description: 'Adoption concrète. Résultats mesurables.',
    images: ['/og.png'],
  },
};

export default function FrenchPage() {
  return <LandingPage locale="fr" />;
}
