import type { Metadata } from 'next';
import LandingPage from '../LandingPage';

export const metadata: Metadata = {
  title: 'Rive Intelligente by Innova Montreal — AI adoption for companies',
  description: 'We guide your company through the practical, responsible adoption of artificial intelligence.',
  alternates: {
    canonical: '/en/',
    languages: { es: '/es/', en: '/en/', fr: '/', 'x-default': '/' },
  },
  openGraph: {
    title: 'AI that works with your team.',
    description: 'Practical adoption. Measurable results.',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og.png', width: 1730, height: 909, alt: 'Rive Intelligente — AI adoption with people at the centre' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI that works with your team.',
    description: 'Practical adoption. Measurable results.',
    images: ['/og.png'],
  },
};

export default function EnglishPage() {
  return <LandingPage locale="en" />;
}
