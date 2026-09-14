import type { Metadata } from 'next';
import LandingPage from '../../LandingPage';

export const metadata: Metadata = {
  title: 'AI-ready websites — Rive Intelligente by Innova Montreal',
  description: 'A scalable website with CRM, chatbot, online commerce, payments and sales funnels based on your needs.',
  alternates: {
    canonical: '/en/ai-ready-websites/',
    languages: { es: '/es/sitios-web-ia/', en: '/en/ai-ready-websites/', fr: '/sites-ia/', 'x-default': '/sites-ia/' },
  },
  openGraph: {
    title: 'Your website can become your growth system.',
    description: 'Website, CRM, chatbot, commerce and sales funnels in one scalable architecture.',
    type: 'website',
    locale: 'en_CA',
    images: [{ url: '/og.png', width: 1730, height: 909, alt: 'Rive Intelligente — AI-ready websites' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your website can become your growth system.',
    description: 'Website, CRM, chatbot, commerce and sales funnels in one scalable architecture.',
    images: ['/og.png'],
  },
};

export default function AiReadyWebsiteEnglishPage() {
  return <LandingPage locale="en" offer="websites" />;
}
