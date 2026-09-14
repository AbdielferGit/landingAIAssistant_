import type { Metadata } from 'next';
import LandingPage from '../LandingPage';

export const metadata: Metadata = {
  title: 'Sites web prêts pour l’IA — Rive Intelligente by Innova Montreal',
  description: 'Un site web évolutif avec CRM, chatbot, commerce en ligne, paiements et tunnels de vente selon vos besoins.',
  alternates: {
    canonical: '/sites-ia/',
    languages: { es: '/es/sitios-web-ia/', en: '/en/ai-ready-websites/', fr: '/sites-ia/', 'x-default': '/sites-ia/' },
  },
  openGraph: {
    title: 'Votre site peut devenir le système de votre croissance.',
    description: 'Site, CRM, chatbot, commerce et tunnels de vente dans une architecture évolutive.',
    type: 'website',
    locale: 'fr_CA',
    images: [{ url: '/og.png', width: 1730, height: 909, alt: 'Rive Intelligente — Sites web prêts pour l’IA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Votre site peut devenir le système de votre croissance.',
    description: 'Site, CRM, chatbot, commerce et tunnels de vente dans une architecture évolutive.',
    images: ['/og.png'],
  },
};

export default function AiReadyWebsitePage() {
  return <LandingPage locale="fr" offer="websites" />;
}
