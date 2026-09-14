import type { Metadata } from 'next';
import LandingPage from '../LandingPage';

export const metadata: Metadata = {
  title: 'Sites web prêts pour l’IA — AiAssistant by InnovaMontreal',
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
    images: [],
  },
  twitter: {
    card: 'summary',
    title: 'Votre site peut devenir le système de votre croissance.',
    description: 'Site, CRM, chatbot, commerce et tunnels de vente dans une architecture évolutive.',
    images: [],
  },
};

export default function AiReadyWebsitePage() {
  return <LandingPage locale="fr" offer="websites" />;
}
