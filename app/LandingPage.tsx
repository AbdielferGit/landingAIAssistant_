'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';

export type Locale = 'es' | 'en' | 'fr';

type CampaignData = { source: string; medium: string; campaign: string };

const localePaths: Record<Locale, string> = { es: '/es/', en: '/en/', fr: '/' };

const content = {
  es: {
    navLabel: 'Navegación principal', homeLabel: 'AiAssistant, inicio', languageLabel: 'Idioma',
    navMethod: 'Método', navApplications: 'Aplicaciones', navQuestions: 'Preguntas', call: 'Agenda una llamada',
    eyebrow: 'Adopción responsable · Resultados medibles', heroFirst: 'Haz que la IA trabaje', heroSecond: 'como parte de tu equipo.',
    heroLead: 'Acompañamos a tu empresa desde la curiosidad hasta la adopción real: estrategia, procesos y equipos preparados para avanzar con confianza.',
    request: 'Solicita tu diagnóstico', how: 'Ver cómo funciona', proofLabel: 'Características del servicio',
    proof: [['4–6 sem.', 'para el sprint inicial'], ['100%', 'adaptado a tu negocio'], ['Humano + IA', 'adopción que permanece']],
    visualLabel: 'Vista previa de un plan de adopción de IA', roadmap: 'Hoja de ruta', planTitle: 'Plan de adopción IA', ongoing: 'En marcha', teamProgress: 'Progreso del equipo',
    planSteps: [
      ['Diagnóstico', 'Oportunidades priorizadas', 'Listo'],
      ['Implementación', '3 flujos en desarrollo', 'Ahora'],
      ['Adopción', 'Formación y acompañamiento', 'Próximo'],
    ],
    pilotGoal: 'Meta del piloto', hours: '+12 h/semana', freed: 'liberadas por equipo', opportunities: '3 oportunidades', ready: 'listas para activar', supported: 'Equipo acompañado', operations: 'sin frenar la operación',
    signalLabel: 'Enfoque del servicio', intent: 'De la intención a la adopción', strategy: 'Estrategia', processes: 'Procesos', people: 'Personas', purpose: 'IA con propósito',
    challengeKicker: 'El reto real', challengeTitle: 'La tecnología no es la parte difícil.',
    challengeIntro: 'La mayoría de las iniciativas de IA se quedan entre una demo interesante y un equipo que no sabe cómo incorporarla a su día a día.',
    frictions: [
      ['Demasiadas opciones', 'Herramientas nuevas cada semana, sin un criterio claro para elegir.'],
      ['Pilotos sin continuidad', 'Pruebas prometedoras que no llegan a conectarse con la operación.'],
      ['Adopción desigual', 'Unos pocos avanzan mientras el resto del equipo observa con dudas.'],
    ],
    bridgeStrong: 'Nuestro trabajo es cerrar esa brecha.', bridgeRest: 'Priorizamos el valor, construimos contigo y dejamos capacidad instalada dentro de la empresa.',
    methodKicker: 'El método', methodTitleOne: 'Avanzar con claridad.', methodTitleTwo: 'Aprender haciendo.', methodIntro: 'Tres etapas para convertir una posibilidad amplia en una mejora concreta y sostenible.',
    methods: [
      { stage: 'Explorar', title: 'Diagnóstico de oportunidad', copy: 'Entendemos tus procesos, identificamos fricciones y elegimos dónde la IA puede crear valor primero.', bullets: ['Mapa de oportunidades', 'Riesgo y viabilidad', 'Hoja de ruta priorizada'] },
      { stage: 'Activar', title: 'Piloto aplicado', copy: 'Construimos un caso real en tu entorno y medimos su impacto con tu equipo desde el primer día.', bullets: ['Flujo funcional', 'Indicadores de impacto', 'Prueba en operación'] },
      { stage: 'Escalar', title: 'Adopción acompañada', copy: 'Formamos al equipo, documentamos la práctica y extendemos lo que funciona sin perder control.', bullets: ['Formación por roles', 'Gobernanza práctica', 'Plan de expansión'] },
    ],
    applicationsKicker: 'Aplicaciones', applicationsTitle: 'Empieza donde el trabajo pesa más.', applicationsIntro: 'No buscamos “poner IA” en toda la empresa. Encontramos tareas concretas donde ahorrar tiempo, mejorar la calidad y aprender rápido.',
    useCases: [
      { number: '01', area: 'Ventas', title: 'Más tiempo frente al cliente.', copy: 'Prepara reuniones, resume conversaciones y convierte notas dispersas en próximos pasos claros.', tags: ['Investigación', 'Seguimiento', 'CRM'] },
      { number: '02', area: 'Operaciones', title: 'Procesos que avanzan solos.', copy: 'Reduce tareas repetitivas y conecta la información para que cada persona se enfoque en decidir.', tags: ['Documentos', 'Reportes', 'Flujos'] },
      { number: '03', area: 'Gestión', title: 'Decisiones con mejor contexto.', copy: 'Transforma datos, reuniones y documentos en señales ejecutivas fáciles de entender y accionar.', tags: ['Análisis', 'Briefs', 'KPIs'] },
    ],
    outcomesKicker: 'Lo que cambia', outcomesOne: 'No medimos entusiasmo.', outcomesTwo: 'Medimos avance.', outcomesCopy: 'Cada iniciativa nace con una línea base y una definición concreta de éxito. Así puedes decidir qué escalar, qué ajustar y qué detener.', outcomesCta: 'Conversemos sobre tu caso',
    metrics: { recovered: 'Tiempo recuperado', hours: 'Horas', perWeek: 'por persona / semana', speed: 'Velocidad', cycle: 'ciclo de proceso', quality: 'Calidad', consistency: 'consistencia de entrega', adoption: 'Adopción', activeUse: 'uso activo del equipo', trust: 'Confianza', safeUse: 'uso seguro y responsable' },
    diagnosisKicker: 'Primer paso', diagnosisTitle: 'Descubre por dónde empezar.', diagnosisCopy: 'Cuéntanos qué está frenando a tu equipo. En una conversación breve identificaremos una primera oportunidad y el siguiente paso más útil.',
    promises: [['30 minutos', 'de conversación enfocada'], ['Una oportunidad', 'aterrizada a tu operación'], ['Sin compromiso', 'y sin discurso técnico']], sourceDetected: 'Fuente de campaña detectada:',
    successLabel: 'Solicitud registrada', successTitle: 'Gracias. Ya tenemos el contexto inicial.', successCopy: 'En la versión publicada, este paso enviará el lead a tu correo o CRM.', sendAnother: 'Enviar otra respuesta',
    formLabel: 'Diagnóstico inicial', formTitle: 'Completa tus datos', name: 'Nombre', namePlaceholder: 'Tu nombre', company: 'Empresa', companyPlaceholder: 'Nombre de la empresa', email: 'Email corporativo', emailPlaceholder: 'nombre@empresa.com', teamSize: 'Tamaño del equipo', select: 'Selecciona una opción', sizes: ['1–10 personas', '11–50 personas', '51–200 personas', 'Más de 200 personas'], challenge: '¿Qué te gustaría mejorar primero?', challengePlaceholder: 'Por ejemplo: reducir el tiempo que dedicamos a reportes semanales...', formSubmit: 'Solicitar diagnóstico', demoNote: 'Versión de prueba: el envío se simula y todavía no comparte tus datos.',
    faqKicker: 'Preguntas frecuentes', faqTitle: 'Antes de dar el primer paso.', faqs: [
      ['¿Necesitamos tener experiencia previa con IA?', 'No. Partimos del nivel real de tu equipo y diseñamos una adopción gradual, con lenguaje claro y casos aplicados a su trabajo diario.'],
      ['¿Esto implica cambiar todas nuestras herramientas?', 'No necesariamente. Primero buscamos valor en los procesos y sistemas que ya utilizas. Solo recomendamos nuevas herramientas cuando aportan una mejora concreta.'],
      ['¿Cómo cuidan la información de la empresa?', 'Definimos desde el inicio qué información puede usarse, con qué herramientas y bajo qué controles. La seguridad y la gobernanza forman parte del plan, no son un añadido.'],
      ['¿Cuándo podemos ver resultados?', 'El sprint inicial está pensado para descubrir oportunidades y activar un primer piloto en 4 a 6 semanas, según la complejidad y disponibilidad del equipo.'],
    ],
    footerLineOne: 'La transición a la IA,', footerLineTwo: 'con claridad y propósito.', footerCta: 'Hablemos', footerDescriptor: 'Adopción de IA para empresas', backTop: 'Volver arriba ↑',
  },
  en: {
    navLabel: 'Main navigation', homeLabel: 'AiAssistant, home', languageLabel: 'Language',
    navMethod: 'Method', navApplications: 'Applications', navQuestions: 'Questions', call: 'Book a call',
    eyebrow: 'Responsible adoption · Measurable results', heroFirst: 'Make AI work', heroSecond: 'as part of your team.',
    heroLead: 'We guide your company from curiosity to real adoption—with the right strategy, processes and team support to move forward confidently.',
    request: 'Request your assessment', how: 'See how it works', proofLabel: 'Service highlights',
    proof: [['4–6 weeks', 'for the initial sprint'], ['100%', 'tailored to your business'], ['Human + AI', 'adoption that lasts']],
    visualLabel: 'AI adoption plan preview', roadmap: 'Roadmap', planTitle: 'AI adoption plan', ongoing: 'In progress', teamProgress: 'Team progress',
    planSteps: [
      ['Assessment', 'Opportunities prioritized', 'Done'],
      ['Implementation', '3 workflows in development', 'Now'],
      ['Adoption', 'Training and support', 'Next'],
    ],
    pilotGoal: 'Pilot goal', hours: '+12 hrs/week', freed: 'freed up per team', opportunities: '3 opportunities', ready: 'ready to activate', supported: 'Team supported', operations: 'without slowing operations',
    signalLabel: 'Service approach', intent: 'From intent to adoption', strategy: 'Strategy', processes: 'Processes', people: 'People', purpose: 'AI with purpose',
    challengeKicker: 'The real challenge', challengeTitle: 'Technology is not the hard part.',
    challengeIntro: 'Most AI initiatives stall somewhere between an interesting demo and a team that does not know how to make it part of everyday work.',
    frictions: [
      ['Too many options', 'New tools appear every week, with no clear criteria for choosing the right ones.'],
      ['Pilots with no follow-through', 'Promising experiments never become part of day-to-day operations.'],
      ['Uneven adoption', 'A few people move ahead while the rest of the team watches with uncertainty.'],
    ],
    bridgeStrong: 'Our job is to close that gap.', bridgeRest: 'We prioritize value, build alongside you and leave lasting capability inside your company.',
    methodKicker: 'The method', methodTitleOne: 'Move forward with clarity.', methodTitleTwo: 'Learn by doing.', methodIntro: 'Three stages that turn a broad possibility into a concrete, sustainable improvement.',
    methods: [
      { stage: 'Explore', title: 'Opportunity assessment', copy: 'We understand your processes, uncover friction and decide where AI can create value first.', bullets: ['Opportunity map', 'Risk and feasibility', 'Prioritized roadmap'] },
      { stage: 'Activate', title: 'Applied pilot', copy: 'We build a real use case in your environment and measure its impact with your team from day one.', bullets: ['Working workflow', 'Impact indicators', 'Live operations test'] },
      { stage: 'Scale', title: 'Supported adoption', copy: 'We train the team, document the practice and expand what works without losing control.', bullets: ['Role-based training', 'Practical governance', 'Expansion plan'] },
    ],
    applicationsKicker: 'Applications', applicationsTitle: 'Start where work feels heaviest.', applicationsIntro: 'We do not try to “add AI” everywhere. We find specific tasks where your team can save time, improve quality and learn quickly.',
    useCases: [
      { number: '01', area: 'Sales', title: 'More time with customers.', copy: 'Prepare meetings, summarize conversations and turn scattered notes into clear next steps.', tags: ['Research', 'Follow-up', 'CRM'] },
      { number: '02', area: 'Operations', title: 'Processes that keep moving.', copy: 'Reduce repetitive tasks and connect information so people can focus on making decisions.', tags: ['Documents', 'Reports', 'Workflows'] },
      { number: '03', area: 'Management', title: 'Decisions with better context.', copy: 'Turn data, meetings and documents into executive signals that are easy to understand and act on.', tags: ['Analysis', 'Briefs', 'KPIs'] },
    ],
    outcomesKicker: 'What changes', outcomesOne: 'We do not measure excitement.', outcomesTwo: 'We measure progress.', outcomesCopy: 'Every initiative starts with a baseline and a clear definition of success. That lets you decide what to scale, adjust or stop.', outcomesCta: 'Let’s discuss your case',
    metrics: { recovered: 'Time recovered', hours: 'Hours', perWeek: 'per person / week', speed: 'Speed', cycle: 'process cycle time', quality: 'Quality', consistency: 'delivery consistency', adoption: 'Adoption', activeUse: 'active team usage', trust: 'Confidence', safeUse: 'safe, responsible use' },
    diagnosisKicker: 'First step', diagnosisTitle: 'Discover where to begin.', diagnosisCopy: 'Tell us what is slowing your team down. In one focused conversation, we will identify an initial opportunity and the most useful next step.',
    promises: [['30 minutes', 'of focused conversation'], ['One opportunity', 'grounded in your operations'], ['No obligation', 'and no technical pitch']], sourceDetected: 'Campaign source detected:',
    successLabel: 'Request recorded', successTitle: 'Thank you. We have the initial context.', successCopy: 'In the published version, this step will send the lead to your email or CRM.', sendAnother: 'Send another response',
    formLabel: 'Initial assessment', formTitle: 'Tell us about yourself', name: 'Name', namePlaceholder: 'Your name', company: 'Company', companyPlaceholder: 'Company name', email: 'Work email', emailPlaceholder: 'name@company.com', teamSize: 'Team size', select: 'Select an option', sizes: ['1–10 people', '11–50 people', '51–200 people', 'More than 200 people'], challenge: 'What would you like to improve first?', challengePlaceholder: 'For example: reduce the time we spend on weekly reports...', formSubmit: 'Request an assessment', demoNote: 'Demo version: submission is simulated and your data is not shared yet.',
    faqKicker: 'Frequently asked questions', faqTitle: 'Before taking the first step.', faqs: [
      ['Do we need previous AI experience?', 'No. We start from your team’s actual level and design a gradual adoption path using clear language and cases drawn from everyday work.'],
      ['Will we need to replace all our tools?', 'Not necessarily. We first look for value in the processes and systems you already use. We only recommend new tools when they deliver a clear improvement.'],
      ['How do you protect company information?', 'From the start, we define what information can be used, with which tools and under what controls. Security and governance are part of the plan, not an afterthought.'],
      ['When can we expect results?', 'The initial sprint is designed to uncover opportunities and activate a first pilot in 4 to 6 weeks, depending on complexity and team availability.'],
    ],
    footerLineOne: 'Your transition to AI,', footerLineTwo: 'with clarity and purpose.', footerCta: 'Let’s talk', footerDescriptor: 'AI adoption for companies', backTop: 'Back to top ↑',
  },
  fr: {
    navLabel: 'Navigation principale', homeLabel: 'AiAssistant, accueil', languageLabel: 'Langue',
    navMethod: 'Méthode', navApplications: 'Applications', navQuestions: 'Questions', call: 'Réserver un appel',
    eyebrow: 'Adoption responsable · Résultats mesurables', heroFirst: 'Faites travailler l’IA', heroSecond: 'aux côtés de votre équipe.',
    heroLead: 'Nous accompagnons votre entreprise, de la curiosité à l’adoption concrète : une stratégie, des processus et des équipes prêts à avancer avec confiance.',
    request: 'Demander votre diagnostic', how: 'Découvrir notre méthode', proofLabel: 'Points forts du service',
    proof: [['4–6 sem.', 'pour le sprint initial'], ['100 %', 'adapté à votre activité'], ['Humain + IA', 'une adoption durable']],
    visualLabel: 'Aperçu d’un plan d’adoption de l’IA', roadmap: 'Feuille de route', planTitle: 'Plan d’adoption de l’IA', ongoing: 'En cours', teamProgress: 'Progression de l’équipe',
    planSteps: [
      ['Diagnostic', 'Opportunités priorisées', 'Terminé'],
      ['Mise en œuvre', '3 flux en développement', 'Maintenant'],
      ['Adoption', 'Formation et accompagnement', 'Ensuite'],
    ],
    pilotGoal: 'Objectif du pilote', hours: '+12 h/semaine', freed: 'libérées par équipe', opportunities: '3 opportunités', ready: 'prêtes à être activées', supported: 'Équipe accompagnée', operations: 'sans ralentir l’activité',
    signalLabel: 'Approche du service', intent: 'De l’intention à l’adoption', strategy: 'Stratégie', processes: 'Processus', people: 'Équipes', purpose: 'Une IA utile',
    challengeKicker: 'Le véritable défi', challengeTitle: 'La technologie n’est pas la partie la plus difficile.',
    challengeIntro: 'La plupart des initiatives d’IA restent bloquées entre une démonstration intéressante et une équipe qui ne sait pas comment l’intégrer à son quotidien.',
    frictions: [
      ['Trop d’options', 'De nouveaux outils chaque semaine, sans critères clairs pour choisir les bons.'],
      ['Des pilotes sans suite', 'Des essais prometteurs qui ne s’intègrent jamais réellement aux opérations.'],
      ['Une adoption inégale', 'Quelques personnes avancent tandis que le reste de l’équipe observe avec hésitation.'],
    ],
    bridgeStrong: 'Notre rôle est de combler cet écart.', bridgeRest: 'Nous priorisons la valeur, construisons avec vous et développons des compétences durables au sein de l’entreprise.',
    methodKicker: 'La méthode', methodTitleOne: 'Avancer avec clarté.', methodTitleTwo: 'Apprendre en faisant.', methodIntro: 'Trois étapes pour transformer une vaste possibilité en amélioration concrète et durable.',
    methods: [
      { stage: 'Explorer', title: 'Diagnostic des opportunités', copy: 'Nous analysons vos processus, repérons les frictions et choisissons où l’IA peut créer de la valeur en premier.', bullets: ['Carte des opportunités', 'Risques et faisabilité', 'Feuille de route priorisée'] },
      { stage: 'Activer', title: 'Pilote appliqué', copy: 'Nous construisons un cas concret dans votre environnement et mesurons son impact avec votre équipe dès le premier jour.', bullets: ['Flux fonctionnel', 'Indicateurs d’impact', 'Test en conditions réelles'] },
      { stage: 'Déployer', title: 'Adoption accompagnée', copy: 'Nous formons l’équipe, documentons les pratiques et étendons ce qui fonctionne tout en gardant le contrôle.', bullets: ['Formation par rôle', 'Gouvernance pratique', 'Plan de déploiement'] },
    ],
    applicationsKicker: 'Applications', applicationsTitle: 'Commencez là où le travail pèse le plus.', applicationsIntro: 'Nous ne cherchons pas à « mettre de l’IA » partout. Nous ciblons les tâches où gagner du temps, améliorer la qualité et apprendre rapidement.',
    useCases: [
      { number: '01', area: 'Ventes', title: 'Plus de temps avec vos clients.', copy: 'Préparez les réunions, résumez les échanges et transformez des notes dispersées en prochaines étapes claires.', tags: ['Recherche', 'Suivi', 'CRM'] },
      { number: '02', area: 'Opérations', title: 'Des processus qui avancent.', copy: 'Réduisez les tâches répétitives et reliez l’information pour que chacun puisse se concentrer sur les décisions.', tags: ['Documents', 'Rapports', 'Flux'] },
      { number: '03', area: 'Direction', title: 'Des décisions mieux éclairées.', copy: 'Transformez données, réunions et documents en signaux de pilotage faciles à comprendre et à utiliser.', tags: ['Analyse', 'Synthèses', 'KPIs'] },
    ],
    outcomesKicker: 'Ce qui change', outcomesOne: 'Nous ne mesurons pas l’enthousiasme.', outcomesTwo: 'Nous mesurons les progrès.', outcomesCopy: 'Chaque initiative commence par une situation de référence et une définition claire du succès. Vous pouvez ainsi décider quoi déployer, ajuster ou arrêter.', outcomesCta: 'Parlons de votre situation',
    metrics: { recovered: 'Temps récupéré', hours: 'Heures', perWeek: 'par personne / semaine', speed: 'Rapidité', cycle: 'durée du processus', quality: 'Qualité', consistency: 'régularité des livrables', adoption: 'Adoption', activeUse: 'usage actif de l’équipe', trust: 'Confiance', safeUse: 'usage sûr et responsable' },
    diagnosisKicker: 'Première étape', diagnosisTitle: 'Découvrez par où commencer.', diagnosisCopy: 'Dites-nous ce qui ralentit votre équipe. En un échange ciblé, nous identifierons une première opportunité et la prochaine étape la plus utile.',
    promises: [['30 minutes', 'd’échange ciblé'], ['Une opportunité', 'ancrée dans vos opérations'], ['Sans engagement', 'et sans discours technique']], sourceDetected: 'Source de campagne détectée :',
    successLabel: 'Demande enregistrée', successTitle: 'Merci. Nous avons le contexte initial.', successCopy: 'Dans la version publiée, cette étape transmettra le contact à votre adresse courriel ou à votre CRM.', sendAnother: 'Envoyer une autre réponse',
    formLabel: 'Diagnostic initial', formTitle: 'Parlez-nous de vous', name: 'Nom', namePlaceholder: 'Votre nom', company: 'Entreprise', companyPlaceholder: 'Nom de l’entreprise', email: 'Courriel professionnel', emailPlaceholder: 'nom@entreprise.com', teamSize: 'Taille de l’équipe', select: 'Sélectionnez une option', sizes: ['1–10 personnes', '11–50 personnes', '51–200 personnes', 'Plus de 200 personnes'], challenge: 'Que souhaitez-vous améliorer en premier ?', challengePlaceholder: 'Par exemple : réduire le temps consacré aux rapports hebdomadaires…', formSubmit: 'Demander un diagnostic', demoNote: 'Version de démonstration : l’envoi est simulé et vos données ne sont pas encore partagées.',
    faqKicker: 'Questions fréquentes', faqTitle: 'Avant de faire le premier pas.', faqs: [
      ['Devons-nous déjà connaître l’IA ?', 'Non. Nous partons du niveau réel de votre équipe et concevons une adoption progressive, avec un langage clair et des cas issus du travail quotidien.'],
      ['Faut-il remplacer tous nos outils ?', 'Pas nécessairement. Nous cherchons d’abord de la valeur dans les processus et systèmes que vous utilisez déjà. Nous ne recommandons de nouveaux outils que s’ils apportent une amélioration concrète.'],
      ['Comment protégez-vous les informations de l’entreprise ?', 'Dès le départ, nous définissons quelles informations peuvent être utilisées, avec quels outils et sous quels contrôles. La sécurité et la gouvernance font partie du plan.'],
      ['Quand pouvons-nous attendre des résultats ?', 'Le sprint initial vise à repérer les opportunités et à lancer un premier pilote en 4 à 6 semaines, selon la complexité et la disponibilité de l’équipe.'],
    ],
    footerLineOne: 'Votre transition vers l’IA,', footerLineTwo: 'avec clarté et intention.', footerCta: 'Échangeons', footerDescriptor: 'Adoption de l’IA en entreprise', backTop: 'Retour en haut ↑',
  },
} as const;

export default function LandingPage({ locale }: { locale: Locale }) {
  const c = content[locale];
  const [sent, setSent] = useState(false);
  const [query, setQuery] = useState('');
  const [campaign, setCampaign] = useState<CampaignData>({ source: '', medium: '', campaign: '' });

  useEffect(() => {
    document.documentElement.lang = locale;

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      setQuery(window.location.search);
      setCampaign({ source: params.get('utm_source') ?? '', medium: params.get('utm_medium') ?? '', campaign: params.get('utm_campaign') ?? '' });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [locale]);

  function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main>
      <section className="hero" id="top">
        <nav className="nav shell" aria-label={c.navLabel}>
          <a className="brand" href="#top" aria-label={c.homeLabel}><span className="brand-mark" aria-hidden="true"><span /></span><span>AiAssistant</span></a>
          <div className="nav-links"><a href="#method">{c.navMethod}</a><a href="#applications">{c.navApplications}</a><a href="#questions">{c.navQuestions}</a></div>
          <div className="nav-actions">
            <div className="language-switcher" aria-label={c.languageLabel}>
              {(Object.keys(localePaths) as Locale[]).map((language) => <a key={language} className={locale === language ? 'active' : ''} href={`${localePaths[language]}${query}`}>{language.toUpperCase()}</a>)}
            </div>
            <a className="button button-small" href="#diagnosis">{c.call} <span aria-hidden="true">↗</span></a>
          </div>
        </nav>

        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />{c.eyebrow}</p>
            <h1>{c.heroFirst}<span>{c.heroSecond}</span></h1>
            <p className="hero-lead">{c.heroLead}</p>
            <div className="hero-actions"><a className="button button-primary" href="#diagnosis">{c.request} <span aria-hidden="true">→</span></a><a className="text-link" href="#method">{c.how} <span aria-hidden="true">↓</span></a></div>
            <div className="hero-proof" aria-label={c.proofLabel}>{c.proof.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
          </div>

          <div className="hero-visual" aria-label={c.visualLabel}>
            <div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" />
            <div className="plan-card">
              <div className="plan-card-header"><div><p>{c.roadmap}</p><h2>{c.planTitle}</h2></div><span className="status"><i /> {c.ongoing}</span></div>
              <div className="progress-row"><span>{c.teamProgress}</span><strong>68%</strong></div><div className="progress"><span /></div>
              <ol className="plan-list">{c.planSteps.map(([title, detail, state], index) => <li key={title} className={index === 0 ? 'done' : index === 1 ? 'active' : ''}><span className="step-icon">{index === 0 ? '✓' : `0${index + 1}`}</span><div><strong>{title}</strong><small>{detail}</small></div><b>{state}</b></li>)}</ol>
              <div className="impact-card"><div className="impact-icon" aria-hidden="true">↗</div><div><small>{c.pilotGoal}</small><strong>{c.hours}</strong></div><span>{c.freed}</span></div>
            </div>
            <div className="float-note float-note-top"><span aria-hidden="true">✦</span><div><strong>{c.opportunities}</strong><small>{c.ready}</small></div></div>
            <div className="float-note float-note-bottom"><span className="pulse" aria-hidden="true" /><div><strong>{c.supported}</strong><small>{c.operations}</small></div></div>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label={c.signalLabel}><div className="shell signal-inner"><p>{c.intent}</p><span /><p>{c.strategy}</p><i>+</i><p>{c.processes}</p><i>+</i><p>{c.people}</p><span /><p>{c.purpose}</p></div></section>

      <section className="friction section-pad"><div className="shell friction-grid">
        <div className="section-heading sticky-heading"><p className="kicker">{c.challengeKicker}</p><h2>{c.challengeTitle}</h2></div>
        <div className="friction-copy"><p className="big-copy">{c.challengeIntro}</p><div className="friction-list">{c.frictions.map(([title, description], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div><div className="insight-callout"><span aria-hidden="true">→</span><p><strong>{c.bridgeStrong}</strong> {c.bridgeRest}</p></div></div>
      </div></section>

      <section className="method section-pad" id="method"><div className="shell">
        <div className="section-heading method-heading"><p className="kicker kicker-light">{c.methodKicker}</p><h2>{c.methodTitleOne}<br />{c.methodTitleTwo}</h2><p>{c.methodIntro}</p></div>
        <div className="method-grid">{c.methods.map((method, index) => <article key={method.title} className={index === 1 ? 'featured-method' : ''}><div className="method-top"><span>0{index + 1}</span><i>{method.stage}</i></div><div className={`method-glyph ${index === 0 ? 'glyph-radar' : index === 1 ? 'glyph-flow' : 'glyph-people'}`} aria-hidden="true">{index === 0 ? <><span /><b /><i /></> : index === 1 ? <><span /><span /><span /><b /><b /></> : <><span /><span /><span /><b /></>}</div><h3>{method.title}</h3><p>{method.copy}</p><ul>{method.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></article>)}</div>
      </div></section>

      <section className="use-cases section-pad" id="applications"><div className="shell">
        <div className="section-heading split-heading"><div><p className="kicker">{c.applicationsKicker}</p><h2>{c.applicationsTitle}</h2></div><p>{c.applicationsIntro}</p></div>
        <div className="case-grid">{c.useCases.map((item) => <article className="case-card" key={item.area}><div className="case-meta"><span>{item.number}</span><strong>{item.area}</strong></div><div className={`case-art case-art-${item.number}`} aria-hidden="true"><span /><span /><i /></div><h3>{item.title}</h3><p>{item.copy}</p><div className="tag-row">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div>
      </div></section>

      <section className="outcomes section-pad" id="results"><div className="shell outcomes-grid">
        <div className="outcomes-copy"><p className="kicker kicker-light">{c.outcomesKicker}</p><h2>{c.outcomesOne}<br /><span>{c.outcomesTwo}</span></h2><p>{c.outcomesCopy}</p><a className="button button-lime" href="#diagnosis">{c.outcomesCta} <span>→</span></a></div>
        <div className="metric-board"><div className="metric-main"><span>{c.metrics.recovered}</span><strong>{c.metrics.hours}</strong><small>{c.metrics.perWeek}</small></div><div><span>{c.metrics.speed}</span><strong>↓</strong><small>{c.metrics.cycle}</small></div><div><span>{c.metrics.quality}</span><strong>↑</strong><small>{c.metrics.consistency}</small></div><div><span>{c.metrics.adoption}</span><strong>%</strong><small>{c.metrics.activeUse}</small></div><div><span>{c.metrics.trust}</span><strong>✓</strong><small>{c.metrics.safeUse}</small></div></div>
      </div></section>

      <section className="diagnostic section-pad" id="diagnosis"><div className="shell diagnostic-wrap">
        <div className="diagnostic-copy"><p className="kicker">{c.diagnosisKicker}</p><h2>{c.diagnosisTitle}</h2><p>{c.diagnosisCopy}</p><div className="promise-list">{c.promises.map(([value, detail], index) => <div key={value}><span>0{index + 1}</span><p><strong>{value}</strong> {detail}</p></div>)}</div>{campaign.source && <div className="source-detected"><i /> {c.sourceDetected} <strong>{campaign.source}</strong></div>}</div>
        <div className="form-card">{sent ? <div className="success-message" role="status" aria-live="polite"><span aria-hidden="true">✓</span><p>{c.successLabel}</p><h3>{c.successTitle}</h3><small>{c.successCopy}</small><button type="button" onClick={() => setSent(false)}>{c.sendAnother}</button></div> : <form onSubmit={submitLead}><div className="form-intro"><span>{c.formLabel}</span><strong>{c.formTitle}</strong></div><div className="field-row"><label>{c.name}<input name="name" type="text" placeholder={c.namePlaceholder} autoComplete="name" required /></label><label>{c.company}<input name="company" type="text" placeholder={c.companyPlaceholder} autoComplete="organization" required /></label></div><label>{c.email}<input name="email" type="email" placeholder={c.emailPlaceholder} autoComplete="email" required /></label><label>{c.teamSize}<select name="team_size" defaultValue="" required><option value="" disabled>{c.select}</option>{c.sizes.map((size) => <option key={size}>{size}</option>)}</select></label><label>{c.challenge}<textarea name="challenge" rows={4} placeholder={c.challengePlaceholder} required /></label><input type="hidden" name="utm_source" value={campaign.source} /><input type="hidden" name="utm_medium" value={campaign.medium} /><input type="hidden" name="utm_campaign" value={campaign.campaign} /><input type="hidden" name="language" value={locale} /><button className="button form-submit" type="submit">{c.formSubmit} <span>→</span></button><p className="form-note"><span aria-hidden="true">●</span> {c.demoNote}</p></form>}</div>
      </div></section>

      <section className="faq section-pad" id="questions"><div className="shell faq-grid"><div className="section-heading sticky-heading"><p className="kicker">{c.faqKicker}</p><h2>{c.faqTitle}</h2></div><div className="faq-list">{c.faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{question}</span><i aria-hidden="true">+</i></summary><p>{answer}</p></details>)}</div></div></section>

      <footer><div className="shell footer-main"><a className="brand brand-footer" href="#top"><span className="brand-mark" aria-hidden="true"><span /></span><span>AiAssistant</span></a><p>{c.footerLineOne}<br />{c.footerLineTwo}</p><a className="footer-cta" href="#diagnosis">{c.footerCta} <span>↗</span></a></div><div className="shell footer-bottom"><span>© 2026 AiAssistant</span><span>{c.footerDescriptor}</span><a href="#top">{c.backTop}</a></div></footer>
    </main>
  );
}
