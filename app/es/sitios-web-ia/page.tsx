import type { Metadata } from 'next';
import LandingPage from '../../LandingPage';

export const metadata: Metadata = {
  title: 'Sitios web preparados para IA — AiAssistant by InnovaMontreal',
  description: 'Un sitio web evolutivo con CRM, chatbot, tienda online, pagos y túneles de venta según tus necesidades.',
  alternates: {
    canonical: '/es/sitios-web-ia/',
    languages: { es: '/es/sitios-web-ia/', en: '/en/ai-ready-websites/', fr: '/sites-ia/', 'x-default': '/sites-ia/' },
  },
  openGraph: {
    title: 'Tu web puede convertirse en el sistema de tu crecimiento.',
    description: 'Web, CRM, chatbot, comercio y túneles de venta en una arquitectura evolutiva.',
    type: 'website',
    locale: 'es_ES',
    images: [],
  },
  twitter: {
    card: 'summary',
    title: 'Tu web puede convertirse en el sistema de tu crecimiento.',
    description: 'Web, CRM, chatbot, comercio y túneles de venta en una arquitectura evolutiva.',
    images: [],
  },
};

export default function AiReadyWebsiteSpanishPage() {
  return <LandingPage locale="es" offer="websites" />;
}
