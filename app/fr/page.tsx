import type { Metadata } from 'next';
import LandingPage from '../LandingPage';

export const metadata: Metadata = {
  title: 'AiAssistant — Adoption de l’IA en entreprise',
  description: 'Nous accompagnons votre entreprise dans l’adoption pratique et responsable de l’intelligence artificielle.',
  alternates: {
    canonical: '/fr/',
    languages: { es: '/', en: '/en/', fr: '/fr/' },
  },
  openGraph: {
    title: 'Une IA qui travaille avec votre équipe.',
    description: 'Adoption concrète. Résultats mesurables.',
    type: 'website',
    locale: 'fr_CA',
    images: [],
  },
  twitter: {
    card: 'summary',
    title: 'Une IA qui travaille avec votre équipe.',
    description: 'Adoption concrète. Résultats mesurables.',
    images: [],
  },
};

export default function FrenchPage() {
  return <LandingPage locale="fr" />;
}
