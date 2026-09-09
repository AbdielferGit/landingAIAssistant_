import type { Metadata } from 'next';
import LandingPage from '../LandingPage';

export const metadata: Metadata = {
  title: 'AiAssistant — AI adoption for companies',
  description: 'We guide your company through the practical, responsible adoption of artificial intelligence.',
  alternates: {
    canonical: '/en/',
    languages: { es: '/', en: '/en/', fr: '/fr/' },
  },
  openGraph: {
    title: 'AI that works with your team.',
    description: 'Practical adoption. Measurable results.',
    type: 'website',
    locale: 'en_US',
    images: [],
  },
  twitter: {
    card: 'summary',
    title: 'AI that works with your team.',
    description: 'Practical adoption. Measurable results.',
    images: [],
  },
};

export default function EnglishPage() {
  return <LandingPage locale="en" />;
}
