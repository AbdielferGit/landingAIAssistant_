import type { Metadata } from 'next';
import LandingPage from '../LandingPage';

export const metadata: Metadata = {
  title: 'AiAssistant by InnovaMontreal — Adopción de IA para empresas',
  description: 'Acompañamos a tu empresa en la adopción práctica y responsable de inteligencia artificial.',
  alternates: {
    canonical: '/es/',
    languages: { es: '/es/', en: '/en/', fr: '/', 'x-default': '/' },
  },
  openGraph: {
    title: 'IA que trabaja con tu equipo.',
    description: 'Adopción práctica. Resultados medibles.',
    type: 'website',
    locale: 'es_ES',
    images: [],
  },
  twitter: {
    card: 'summary',
    title: 'IA que trabaja con tu equipo.',
    description: 'Adopción práctica. Resultados medibles.',
    images: [],
  },
};

export default function SpanishPage() {
  return <LandingPage locale="es" />;
}
