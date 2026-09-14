'use client';

import type { FormEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { websiteContent } from './websiteContent';

export type Locale = 'es' | 'en' | 'fr';
export type Offer = 'adoption' | 'websites';

type CampaignData = { source: string; medium: string; campaign: string; content: string };
type FormState = 'idle' | 'sending' | 'sent' | 'error';

const localePaths: Record<Locale, string> = { es: '/es/', en: '/en/', fr: '/' };
const websiteLocalePaths: Record<Locale, string> = { es: '/es/sitios-web-ia/', en: '/en/ai-ready-websites/', fr: '/sites-ia/' };
const offerLinks: Record<Offer, Record<Locale, { href: string; label: string }>> = {
  adoption: {
    es: { href: '/es/sitios-web-ia/', label: 'Sitios web IA' },
    en: { href: '/en/ai-ready-websites/', label: 'AI-ready websites' },
    fr: { href: '/sites-ia/', label: 'Sites web IA' },
  },
  websites: {
    es: { href: '/es/', label: 'Adopción de IA' },
    en: { href: '/en/', label: 'AI adoption' },
    fr: { href: '/', label: 'Adoption de l’IA' },
  },
};
const teamSizeValues = ['1–10', '11–50', '51–200', '200+'] as const;
const adoptionCrmEndpoint = process.env.NEXT_PUBLIC_CRM_ENDPOINT?.trim() ?? '';
const websiteCrmEndpoint = process.env.NEXT_PUBLIC_WEBSITE_CRM_ENDPOINT?.trim() ?? '';
const taskDoctorBanners: Record<Locale, { intro: string; badge: string; message: string; privacy: string; href: string | null }> = {
  en: {
    intro: 'Make the first step yourself',
    badge: '100% FREE',
    message: 'Find repetitive browser work, see where time goes and uncover what to automate — privately.',
    privacy: 'No screenshots, page content or employee monitoring.',
    href: 'https://taskdoctor.ai/',
  },
  fr: {
    intro: 'Faites vous-même le premier pas',
    badge: '100 % GRATUIT',
    message: 'Installez TaskDoctor pour repérer les tâches répétitives et le temps perdu — en toute confidentialité.',
    privacy: 'Aucune capture d’écran, aucun contenu de page, aucune surveillance.',
    href: 'https://taskdoctor.ai/',
  },
  es: {
    intro: 'Da tú mismo el primer paso',
    badge: '100% GRATIS',
    message: 'Instala TaskDoctor para detectar tareas repetitivas, tiempo perdido y oportunidades de automatización.',
    privacy: 'Sin capturas, contenido de páginas ni vigilancia de empleados.',
    href: 'https://taskdoctor.ai/',
  },
};

const content = {
  es: {
    navLabel: 'Navegación principal', homeLabel: 'Rive Intelligente by Innova Montreal', languageLabel: 'Idioma',
    navMethod: 'Método', navApplications: 'Aplicaciones', navQuestions: 'Preguntas', call: 'Agenda una llamada',
    eyebrow: 'Personas primero · Valor comprobable', heroFirst: 'Adopta la IA.', heroSecond: 'Nunca a solas.',
    heroLead: 'Trabajamos junto a tu equipo para entender cada necesidad, elegir las herramientas adecuadas y demostrar el valor creado antes y después de implementarlas.',
    request: 'Solicita tu diagnóstico', how: 'Ver cómo funciona', proofLabel: 'Características del servicio',
    proof: [['Acompañamiento humano', 'de principio a fin'], ['Herramientas precisas', 'para cada rol y necesidad'], ['Antes y después', 'valor medido con una línea base']],
    visualLabel: 'Vista previa de un plan de adopción de IA', roadmap: 'Hoja de ruta', planTitle: 'Plan de adopción IA', ongoing: 'En marcha', teamProgress: 'Progreso del equipo',
    planSteps: [
      ['Diagnóstico', 'Oportunidades priorizadas', 'Listo'],
      ['Implementación', '3 flujos en desarrollo', 'Ahora'],
      ['Adopción', 'Formación y acompañamiento', 'Próximo'],
    ],
    pilotGoal: 'Valor del piloto', hours: 'Antes / Después', freed: 'medido con el equipo', opportunities: '3 oportunidades', ready: 'listas para evaluar', supported: 'Equipo acompañado', operations: 'en cada decisión',
    signalLabel: 'Enfoque del servicio', intent: 'Acompañamiento continuo', strategy: 'Necesidad', processes: 'Herramienta', people: 'Personas', purpose: 'Valor medido',
    challengeKicker: 'Nuestra diferencia', challengeTitle: 'La IA correcta empieza por entender a las personas.',
    challengeIntro: 'No llegamos con un catálogo de herramientas. Observamos cómo trabaja cada persona y diseñamos una adopción útil, comprensible y medible.',
    frictions: [
      ['Nunca trabajas solo', 'Un especialista acompaña al equipo desde el diagnóstico hasta el uso cotidiano.'],
      ['Primero la necesidad', 'Cada herramienta se elige por el trabajo de una persona, no por la tendencia del momento.'],
      ['Evidencia, no promesas', 'Definimos una línea base y comprobamos el cambio después de la implementación.'],
    ],
    bridgeStrong: 'La seguridad forma parte del proceso.', bridgeRest: 'Definimos datos, permisos y reglas de uso antes de integrar cualquier solución.',
    methodKicker: 'Cómo trabajamos', methodTitleOne: 'Un proceso claro.', methodTitleTwo: 'Un experto a tu lado.', methodIntro: 'Cuatro pasos concretos para avanzar sin improvisar ni dejar al equipo solo.',
    methods: [
      { stage: 'Escuchar', title: 'Trabajo y línea base', copy: 'Entendemos las tareas, fricciones y objetivos de cada rol antes de hablar de tecnología.', bullets: ['Necesidades por usuario', 'Tiempo y calidad actuales', 'Criterios de éxito'] },
      { stage: 'Elegir', title: 'Herramienta adecuada', copy: 'Evaluamos qué solución encaja con la necesidad, el entorno y el nivel real del equipo.', bullets: ['Ajuste al flujo actual', 'Privacidad e integración', 'Costo frente a utilidad'] },
      { stage: 'Acompañar', title: 'Piloto con las personas', copy: 'Configuramos, probamos y mejoramos la solución junto a quienes la usarán cada día.', bullets: ['Construcción conjunta', 'Formación por roles', 'Soporte cercano'] },
      { stage: 'Medir', title: 'Valor antes y después', copy: 'Comparamos la línea base con los resultados para decidir con evidencia qué conviene escalar.', bullets: ['Tiempo recuperado', 'Calidad y adopción', 'Escalar, ajustar o detener'] },
    ],
    applicationsKicker: 'Aplicaciones', applicationsTitle: 'Empieza donde el trabajo pesa más.', applicationsIntro: 'No buscamos “poner IA” en toda la empresa. Encontramos tareas concretas donde ahorrar tiempo, mejorar la calidad y aprender rápido.',
    useCases: [
      { number: '01', area: 'Ventas', title: 'Más tiempo frente al cliente.', copy: 'Prepara reuniones, resume conversaciones y convierte notas dispersas en próximos pasos claros.', tags: ['Investigación', 'Seguimiento', 'CRM'] },
      { number: '02', area: 'Operaciones', title: 'Procesos que avanzan solos.', copy: 'Reduce tareas repetitivas y conecta la información para que cada persona se enfoque en decidir.', tags: ['Documentos', 'Reportes', 'Flujos'] },
      { number: '03', area: 'Gestión', title: 'Decisiones con mejor contexto.', copy: 'Transforma datos, reuniones y documentos en señales ejecutivas fáciles de entender y accionar.', tags: ['Análisis', 'Briefs', 'KPIs'] },
    ],
    outcomesKicker: 'Prueba de valor', outcomesOne: 'Antes y después.', outcomesTwo: 'El impacto se demuestra.', outcomesCopy: 'Comparamos la misma tarea, con el mismo equipo, antes y después del piloto. Medimos tiempo, calidad, uso real y confianza para decidir el siguiente paso.', outcomesCta: 'Definamos tu línea base',
    metrics: { recovered: 'Comparación del piloto', hours: 'Antes → Después', perWeek: 'misma tarea · mismo equipo', speed: 'Tiempo', cycle: 'duración por tarea', quality: 'Calidad', consistency: 'errores y consistencia', adoption: 'Uso real', activeUse: 'personas que lo integran', trust: 'Decisión', safeUse: 'escalar, ajustar o detener' },
    diagnosisKicker: 'Primer paso', diagnosisTitle: 'Descubre por dónde empezar.', diagnosisCopy: 'Cuéntanos qué está frenando a tu equipo. En una conversación breve identificaremos una primera oportunidad y el siguiente paso más útil.',
    promises: [['30 minutos', 'de conversación enfocada'], ['Una oportunidad', 'aterrizada a tu operación'], ['Sin compromiso', 'y sin discurso técnico']], sourceDetected: 'Fuente de campaña detectada:',
    successLabel: 'Cita solicitada', successTitle: 'Gracias. Hemos reservado tu preferencia.', successCopy: 'Te enviaremos un correo para confirmar la fecha y la hora de la conversación.', sendAnother: 'Enviar otra respuesta',
    formLabel: 'Diagnóstico inicial', formTitle: 'Completa tus datos', name: 'Nombre', namePlaceholder: 'Tu nombre', company: 'Empresa', companyPlaceholder: 'Nombre de la empresa', email: 'Email corporativo', emailPlaceholder: 'nombre@empresa.com', teamSize: 'Tamaño del equipo', select: 'Selecciona una opción', sizes: ['1–10 personas', '11–50 personas', '51–200 personas', 'Más de 200 personas'], challenge: '¿Qué te gustaría mejorar primero?', challengePlaceholder: 'Por ejemplo: reducir el tiempo que dedicamos a reportes semanales...', appointmentKicker: 'Elige tu preferencia', appointmentDate: 'Fecha preferida', appointmentTime: 'Hora preferida', appointmentTimezone: 'Hora de Montreal · La cita se confirma por correo', formSubmit: 'Reservar mi diagnóstico', demoNote: 'Los datos se guardan en nuestro CRM únicamente para gestionar tu solicitud y confirmar la cita.',
    sending: 'Enviando…', consent: 'Acepto que Rive Intelligente almacene estos datos para responder a mi solicitud.', formError: 'No pudimos registrar la solicitud. Revisa tu conexión e inténtalo de nuevo.', formUnavailable: 'El formulario se está terminando de configurar. Inténtalo de nuevo más tarde.',
    faqKicker: 'Preguntas frecuentes', faqTitle: 'Antes de dar el primer paso.', faqs: [
      ['¿Necesitamos tener experiencia previa con IA?', 'No. Partimos del nivel real de tu equipo y diseñamos una adopción gradual, con lenguaje claro y casos aplicados a su trabajo diario.'],
      ['¿Esto implica cambiar todas nuestras herramientas?', 'No necesariamente. Primero buscamos valor en los procesos y sistemas que ya utilizas. Solo recomendamos nuevas herramientas cuando aportan una mejora concreta.'],
      ['¿Cómo cuidan la información de la empresa?', 'Definimos desde el inicio qué información puede usarse, con qué herramientas y bajo qué controles. La seguridad y la gobernanza forman parte del plan, no son un añadido.'],
      ['¿Cuándo podemos ver resultados?', 'El sprint inicial está pensado para descubrir oportunidades y activar un primer piloto en 4 a 6 semanas, según la complejidad y disponibilidad del equipo.'],
    ],
    footerLineOne: 'La transición a la IA,', footerLineTwo: 'con claridad y propósito.', footerCta: 'Hablemos', footerDescriptor: 'Adopción de IA para empresas', backTop: 'Volver arriba ↑',
  },
  en: {
    navLabel: 'Main navigation', homeLabel: 'Rive Intelligente by Innova Montreal', languageLabel: 'Language',
    navMethod: 'Method', navApplications: 'Applications', navQuestions: 'Questions', call: 'Book a call',
    eyebrow: 'People first · Provable value', heroFirst: 'Adopt AI.', heroSecond: 'Never on your own.',
    heroLead: 'We work alongside your team to understand each need, select the right tools and prove the value created before and after implementation.',
    request: 'Request your assessment', how: 'See how it works', proofLabel: 'Service highlights',
    proof: [['Human guidance', 'from start to finish'], ['The right tools', 'for each role and need'], ['Before and after', 'value measured from a baseline']],
    visualLabel: 'AI adoption plan preview', roadmap: 'Roadmap', planTitle: 'AI adoption plan', ongoing: 'In progress', teamProgress: 'Team progress',
    planSteps: [
      ['Assessment', 'Opportunities prioritized', 'Done'],
      ['Implementation', '3 workflows in development', 'Now'],
      ['Adoption', 'Training and support', 'Next'],
    ],
    pilotGoal: 'Pilot value', hours: 'Before / After', freed: 'measured with the team', opportunities: '3 opportunities', ready: 'ready to evaluate', supported: 'Team supported', operations: 'at every decision',
    signalLabel: 'Service approach', intent: 'Continuous guidance', strategy: 'Need', processes: 'Tool', people: 'People', purpose: 'Measured value',
    challengeKicker: 'Our difference', challengeTitle: 'The right AI starts with understanding people.',
    challengeIntro: 'We do not arrive with a catalogue of tools. We observe how each person works and design adoption that is useful, understandable and measurable.',
    frictions: [
      ['You never work alone', 'A specialist supports the team from assessment through everyday use.'],
      ['Needs come first', 'Every tool is selected for a person’s work—not for the trend of the moment.'],
      ['Evidence, not promises', 'We set a baseline and verify the change after implementation.'],
    ],
    bridgeStrong: 'Security is built into the process.', bridgeRest: 'We define data, permissions and usage rules before integrating any solution.',
    methodKicker: 'How we work', methodTitleOne: 'A clear process.', methodTitleTwo: 'An expert by your side.', methodIntro: 'Four concrete steps to move forward without guesswork or leaving the team on its own.',
    methods: [
      { stage: 'Listen', title: 'Work and baseline', copy: 'We understand the tasks, friction and goals of each role before discussing technology.', bullets: ['Needs by user', 'Current time and quality', 'Success criteria'] },
      { stage: 'Select', title: 'The right tool', copy: 'We assess which solution fits the need, environment and actual readiness of the team.', bullets: ['Fit with current workflow', 'Privacy and integration', 'Cost versus usefulness'] },
      { stage: 'Support', title: 'A people-led pilot', copy: 'We configure, test and improve the solution with the people who will use it every day.', bullets: ['Built together', 'Role-based training', 'Hands-on support'] },
      { stage: 'Measure', title: 'Value before and after', copy: 'We compare the baseline with results to decide, with evidence, what is worth scaling.', bullets: ['Time recovered', 'Quality and adoption', 'Scale, adjust or stop'] },
    ],
    applicationsKicker: 'Applications', applicationsTitle: 'Start where work feels heaviest.', applicationsIntro: 'We do not try to “add AI” everywhere. We find specific tasks where your team can save time, improve quality and learn quickly.',
    useCases: [
      { number: '01', area: 'Sales', title: 'More time with customers.', copy: 'Prepare meetings, summarize conversations and turn scattered notes into clear next steps.', tags: ['Research', 'Follow-up', 'CRM'] },
      { number: '02', area: 'Operations', title: 'Processes that keep moving.', copy: 'Reduce repetitive tasks and connect information so people can focus on making decisions.', tags: ['Documents', 'Reports', 'Workflows'] },
      { number: '03', area: 'Management', title: 'Decisions with better context.', copy: 'Turn data, meetings and documents into executive signals that are easy to understand and act on.', tags: ['Analysis', 'Briefs', 'KPIs'] },
    ],
    outcomesKicker: 'Proof of value', outcomesOne: 'Before and after.', outcomesTwo: 'Impact must be visible.', outcomesCopy: 'We compare the same task, with the same team, before and after the pilot. We measure time, quality, real usage and confidence to decide the next step.', outcomesCta: 'Define your baseline',
    metrics: { recovered: 'Pilot comparison', hours: 'Before → After', perWeek: 'same task · same team', speed: 'Time', cycle: 'duration per task', quality: 'Quality', consistency: 'errors and consistency', adoption: 'Real usage', activeUse: 'people who integrate it', trust: 'Decision', safeUse: 'scale, adjust or stop' },
    diagnosisKicker: 'First step', diagnosisTitle: 'Discover where to begin.', diagnosisCopy: 'Tell us what is slowing your team down. In one focused conversation, we will identify an initial opportunity and the most useful next step.',
    promises: [['30 minutes', 'of focused conversation'], ['One opportunity', 'grounded in your operations'], ['No obligation', 'and no technical pitch']], sourceDetected: 'Campaign source detected:',
    successLabel: 'Appointment requested', successTitle: 'Thank you. We saved your preferred time.', successCopy: 'We will email you to confirm the date and time of the conversation.', sendAnother: 'Send another response',
    formLabel: 'Initial assessment', formTitle: 'Tell us about yourself', name: 'Name', namePlaceholder: 'Your name', company: 'Company', companyPlaceholder: 'Company name', email: 'Work email', emailPlaceholder: 'name@company.com', teamSize: 'Team size', select: 'Select an option', sizes: ['1–10 people', '11–50 people', '51–200 people', 'More than 200 people'], challenge: 'What would you like to improve first?', challengePlaceholder: 'For example: reduce the time we spend on weekly reports...', appointmentKicker: 'Choose your preference', appointmentDate: 'Preferred date', appointmentTime: 'Preferred time', appointmentTimezone: 'Montreal time · Appointment confirmed by email', formSubmit: 'Book my assessment', demoNote: 'Your data is stored in our CRM only to manage your request and confirm the appointment.',
    sending: 'Sending…', consent: 'I agree that Rive Intelligente may store this information to respond to my request.', formError: 'We could not record your request. Check your connection and try again.', formUnavailable: 'The form is still being configured. Please try again later.',
    faqKicker: 'Frequently asked questions', faqTitle: 'Before taking the first step.', faqs: [
      ['Do we need previous AI experience?', 'No. We start from your team’s actual level and design a gradual adoption path using clear language and cases drawn from everyday work.'],
      ['Will we need to replace all our tools?', 'Not necessarily. We first look for value in the processes and systems you already use. We only recommend new tools when they deliver a clear improvement.'],
      ['How do you protect company information?', 'From the start, we define what information can be used, with which tools and under what controls. Security and governance are part of the plan, not an afterthought.'],
      ['When can we expect results?', 'The initial sprint is designed to uncover opportunities and activate a first pilot in 4 to 6 weeks, depending on complexity and team availability.'],
    ],
    footerLineOne: 'Your transition to AI,', footerLineTwo: 'with clarity and purpose.', footerCta: 'Let’s talk', footerDescriptor: 'AI adoption for companies', backTop: 'Back to top ↑',
  },
  fr: {
    navLabel: 'Navigation principale', homeLabel: 'Rive Intelligente by Innova Montreal', languageLabel: 'Langue',
    navMethod: 'Méthode', navApplications: 'Applications', navQuestions: 'Questions', call: 'Réserver un appel',
    eyebrow: 'L’humain d’abord · Une valeur démontrable', heroFirst: 'Adoptez l’IA.', heroSecond: 'Jamais sans accompagnement.',
    heroLead: 'Nous travaillons aux côtés de votre équipe pour comprendre chaque besoin, choisir les bons outils et démontrer la valeur créée avant et après leur mise en place.',
    request: 'Demander votre diagnostic', how: 'Découvrir notre méthode', proofLabel: 'Points forts du service',
    proof: [['Accompagnement humain', 'du diagnostic à l’adoption'], ['Outils bien choisis', 'pour chaque rôle et besoin'], ['Avant / après', 'une valeur mesurée sur une référence']],
    visualLabel: 'Aperçu d’un plan d’adoption de l’IA', roadmap: 'Feuille de route', planTitle: 'Plan d’adoption de l’IA', ongoing: 'En cours', teamProgress: 'Progression de l’équipe',
    planSteps: [
      ['Diagnostic', 'Opportunités priorisées', 'Terminé'],
      ['Mise en œuvre', '3 flux en développement', 'Maintenant'],
      ['Adoption', 'Formation et accompagnement', 'Ensuite'],
    ],
    pilotGoal: 'Valeur du pilote', hours: 'Avant / Après', freed: 'mesurée avec l’équipe', opportunities: '3 opportunités', ready: 'prêtes à être évaluées', supported: 'Équipe accompagnée', operations: 'à chaque décision',
    signalLabel: 'Approche du service', intent: 'Accompagnement continu', strategy: 'Besoin', processes: 'Outil', people: 'Personnes', purpose: 'Valeur mesurée',
    challengeKicker: 'Notre différence', challengeTitle: 'La bonne IA commence par comprendre les personnes.',
    challengeIntro: 'Nous n’arrivons pas avec un catalogue d’outils. Nous observons le travail de chacun et concevons une adoption utile, compréhensible et mesurable.',
    frictions: [
      ['Vous n’avancez jamais seul', 'Un spécialiste accompagne l’équipe du diagnostic jusqu’à l’usage quotidien.'],
      ['Le besoin avant l’outil', 'Chaque solution est choisie pour le travail d’une personne, et non pour suivre une tendance.'],
      ['Des preuves, pas des promesses', 'Nous définissons une référence et vérifions le changement après la mise en place.'],
    ],
    bridgeStrong: 'La sécurité fait partie du processus.', bridgeRest: 'Nous définissons les données, les accès et les règles d’usage avant d’intégrer toute solution.',
    methodKicker: 'Notre façon de travailler', methodTitleOne: 'Un processus clair.', methodTitleTwo: 'Un expert à vos côtés.', methodIntro: 'Quatre étapes concrètes pour avancer sans improviser et sans laisser l’équipe seule.',
    methods: [
      { stage: 'Écouter', title: 'Travail et référence', copy: 'Nous comprenons les tâches, les frictions et les objectifs de chaque rôle avant de parler de technologie.', bullets: ['Besoins par utilisateur', 'Temps et qualité actuels', 'Critères de réussite'] },
      { stage: 'Choisir', title: 'Le bon outil', copy: 'Nous évaluons la solution adaptée au besoin, à l’environnement et au niveau réel de l’équipe.', bullets: ['Compatibilité avec le flux', 'Confidentialité et intégration', 'Coût face à l’utilité'] },
      { stage: 'Accompagner', title: 'Un pilote avec les personnes', copy: 'Nous configurons, testons et améliorons la solution avec celles et ceux qui l’utiliseront chaque jour.', bullets: ['Construction commune', 'Formation par rôle', 'Soutien de proximité'] },
      { stage: 'Mesurer', title: 'Valeur avant et après', copy: 'Nous comparons la référence aux résultats pour décider, preuves à l’appui, ce qui mérite d’être déployé.', bullets: ['Temps récupéré', 'Qualité et adoption', 'Déployer, ajuster ou arrêter'] },
    ],
    applicationsKicker: 'Applications', applicationsTitle: 'Commencez là où le travail pèse le plus.', applicationsIntro: 'Nous ne cherchons pas à « mettre de l’IA » partout. Nous ciblons les tâches où gagner du temps, améliorer la qualité et apprendre rapidement.',
    useCases: [
      { number: '01', area: 'Ventes', title: 'Plus de temps avec vos clients.', copy: 'Préparez les réunions, résumez les échanges et transformez des notes dispersées en prochaines étapes claires.', tags: ['Recherche', 'Suivi', 'CRM'] },
      { number: '02', area: 'Opérations', title: 'Des processus qui avancent.', copy: 'Réduisez les tâches répétitives et reliez l’information pour que chacun puisse se concentrer sur les décisions.', tags: ['Documents', 'Rapports', 'Flux'] },
      { number: '03', area: 'Direction', title: 'Des décisions mieux éclairées.', copy: 'Transformez données, réunions et documents en signaux de pilotage faciles à comprendre et à utiliser.', tags: ['Analyse', 'Synthèses', 'KPIs'] },
    ],
    outcomesKicker: 'Preuve de valeur', outcomesOne: 'Avant et après.', outcomesTwo: 'L’impact doit se voir.', outcomesCopy: 'Nous comparons la même tâche, avec la même équipe, avant et après le pilote. Temps, qualité, usage réel et confiance guident la prochaine décision.', outcomesCta: 'Définissons votre référence',
    metrics: { recovered: 'Comparaison du pilote', hours: 'Avant → Après', perWeek: 'même tâche · même équipe', speed: 'Temps', cycle: 'durée par tâche', quality: 'Qualité', consistency: 'erreurs et régularité', adoption: 'Usage réel', activeUse: 'personnes qui l’intègrent', trust: 'Décision', safeUse: 'déployer, ajuster ou arrêter' },
    diagnosisKicker: 'Première étape', diagnosisTitle: 'Découvrez par où commencer.', diagnosisCopy: 'Dites-nous ce qui ralentit votre équipe. En un échange ciblé, nous identifierons une première opportunité et la prochaine étape la plus utile.',
    promises: [['30 minutes', 'd’échange ciblé'], ['Une opportunité', 'ancrée dans vos opérations'], ['Sans engagement', 'et sans discours technique']], sourceDetected: 'Source de campagne détectée :',
    successLabel: 'Rendez-vous demandé', successTitle: 'Merci. Votre préférence est enregistrée.', successCopy: 'Nous vous écrirons pour confirmer la date et l’heure de l’échange.', sendAnother: 'Envoyer une autre réponse',
    formLabel: 'Diagnostic initial', formTitle: 'Parlez-nous de vous', name: 'Nom', namePlaceholder: 'Votre nom', company: 'Entreprise', companyPlaceholder: 'Nom de l’entreprise', email: 'Courriel professionnel', emailPlaceholder: 'nom@entreprise.com', teamSize: 'Taille de l’équipe', select: 'Sélectionnez une option', sizes: ['1–10 personnes', '11–50 personnes', '51–200 personnes', 'Plus de 200 personnes'], challenge: 'Que souhaitez-vous améliorer en premier ?', challengePlaceholder: 'Par exemple : réduire le temps consacré aux rapports hebdomadaires…', appointmentKicker: 'Choisissez votre préférence', appointmentDate: 'Date souhaitée', appointmentTime: 'Heure souhaitée', appointmentTimezone: 'Heure de Montréal · Rendez-vous confirmé par courriel', formSubmit: 'Réserver mon diagnostic', demoNote: 'Vos données sont conservées dans notre CRM uniquement pour gérer votre demande et confirmer le rendez-vous.',
    sending: 'Envoi…', consent: 'J’accepte que Rive Intelligente conserve ces renseignements afin de répondre à ma demande.', formError: 'Nous n’avons pas pu enregistrer votre demande. Vérifiez votre connexion et réessayez.', formUnavailable: 'Le formulaire est en cours de configuration. Veuillez réessayer plus tard.',
    faqKicker: 'Questions fréquentes', faqTitle: 'Avant de faire le premier pas.', faqs: [
      ['Devons-nous déjà connaître l’IA ?', 'Non. Nous partons du niveau réel de votre équipe et concevons une adoption progressive, avec un langage clair et des cas issus du travail quotidien.'],
      ['Faut-il remplacer tous nos outils ?', 'Pas nécessairement. Nous cherchons d’abord de la valeur dans les processus et systèmes que vous utilisez déjà. Nous ne recommandons de nouveaux outils que s’ils apportent une amélioration concrète.'],
      ['Comment protégez-vous les informations de l’entreprise ?', 'Dès le départ, nous définissons quelles informations peuvent être utilisées, avec quels outils et sous quels contrôles. La sécurité et la gouvernance font partie du plan.'],
      ['Quand pouvons-nous attendre des résultats ?', 'Le sprint initial vise à repérer les opportunités et à lancer un premier pilote en 4 à 6 semaines, selon la complexité et la disponibilité de l’équipe.'],
    ],
    footerLineOne: 'Votre transition vers l’IA,', footerLineTwo: 'avec clarté et intention.', footerCta: 'Échangeons', footerDescriptor: 'Adoption de l’IA en entreprise', backTop: 'Retour en haut ↑',
  },
} as const;

export default function LandingPage({ locale, offer = 'adoption' }: { locale: Locale; offer?: Offer }) {
  const isWebsiteOffer = offer === 'websites';
  const c = isWebsiteOffer ? websiteContent[locale] : content[locale];
  const languagePaths = isWebsiteOffer ? websiteLocalePaths : localePaths;
  const alternateOffer = offerLinks[offer][locale];
  const crmEndpoint = isWebsiteOffer ? websiteCrmEndpoint : adoptionCrmEndpoint;
  const taskDoctor = taskDoctorBanners[locale];
  const [formState, setFormState] = useState<FormState>('idle');
  const [formError, setFormError] = useState('');
  const [quickFormOpen, setQuickFormOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [minimumDate, setMinimumDate] = useState('');
  const [maximumDate, setMaximumDate] = useState('');
  const [campaign, setCampaign] = useState<CampaignData>({ source: '', medium: '', campaign: '', content: '' });

  useEffect(() => {
    document.documentElement.lang = locale;

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const latest = new Date(tomorrow);
      latest.setDate(latest.getDate() + 89);
      setQuery(window.location.search);
      setMinimumDate(tomorrow.toLocaleDateString('en-CA'));
      setMaximumDate(latest.toLocaleDateString('en-CA'));
      setCampaign({ source: params.get('utm_source') ?? '', medium: params.get('utm_medium') ?? '', campaign: params.get('utm_campaign') ?? '', content: params.get('utm_content') ?? '' });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [locale]);

  useEffect(() => {
    if (!quickFormOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setQuickFormOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [quickFormOpen]);

  function openQuickForm(event: ReactMouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setQuickFormOpen(true);
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setFormError('');

    if (!crmEndpoint) {
      setFormState('error');
      setFormError(c.formUnavailable);
      return;
    }

    setFormState('sending');
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    payload.utm_source = campaign.source;
    payload.utm_medium = campaign.medium;
    payload.utm_campaign = campaign.campaign;
    payload.utm_content = campaign.content;
    payload.language = locale;
    payload.offer = isWebsiteOffer ? 'ai-ready-website' : 'ai-adoption';
    payload.landing_url = window.location.href;
    payload.submitted_at = new Date().toISOString();

    try {
      await fetch(crmEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        credentials: 'omit',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
      form.reset();
      setFormState('sent');
    } catch {
      setFormState('error');
      setFormError(c.formError);
    }
  }

  function renderLeadForm(inModal = false) {
    return (
      <div className={`form-card${inModal ? ' form-card-modal' : ''}`}>
        {formState === 'sent' ? (
          <div className="success-message" role="status" aria-live="polite">
            <span aria-hidden="true">✓</span><p>{c.successLabel}</p><h3>{c.successTitle}</h3><small>{c.successCopy}</small>
            <button type="button" onClick={() => setFormState('idle')}>{c.sendAnother}</button>
          </div>
        ) : (
          <form onSubmit={submitLead}>
            <div className="form-intro"><span>{c.formLabel}</span><strong id={inModal ? 'quick-form-title' : undefined}>{c.formTitle}</strong></div>
            <div className="field-row">
              <label>{c.name}<input name="name" type="text" placeholder={c.namePlaceholder} autoComplete="name" autoFocus={inModal} required /></label>
              <label>{c.company}<input name="company" type="text" placeholder={c.companyPlaceholder} autoComplete="organization" required /></label>
            </div>
            <label>{c.email}<input name="email" type="email" placeholder={c.emailPlaceholder} autoComplete="email" required /></label>
            <label>{c.teamSize}<select name="team_size" defaultValue="" required><option value="" disabled>{c.select}</option>{c.sizes.map((size, index) => <option key={size} value={teamSizeValues[index]}>{size}</option>)}</select></label>
            <label>{c.challenge}<textarea name="challenge" rows={4} placeholder={c.challengePlaceholder} required /></label>
            <div className="appointment-block"><p>{c.appointmentKicker}</p><div className="field-row">
              <label>{c.appointmentDate}<input name="appointment_date" type="date" min={minimumDate} max={maximumDate} required /></label>
              <label>{c.appointmentTime}<select name="appointment_time" defaultValue="" required><option value="" disabled>{c.select}</option>{['09:00', '10:30', '13:30', '15:00', '16:30'].map((time) => <option key={time} value={time}>{time}</option>)}</select></label>
            </div><small>{c.appointmentTimezone}</small></div>
            <label className="consent-row"><input name="consent" type="checkbox" value="yes" required /><span>{c.consent}</span></label>
            <label className="honeypot" aria-hidden="true">Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
            <input type="hidden" name="utm_source" value={campaign.source} /><input type="hidden" name="utm_medium" value={campaign.medium} /><input type="hidden" name="utm_campaign" value={campaign.campaign} /><input type="hidden" name="utm_content" value={campaign.content} /><input type="hidden" name="language" value={locale} /><input type="hidden" name="offer" value={isWebsiteOffer ? 'ai-ready-website' : 'ai-adoption'} />
            <button className="button form-submit" type="submit" disabled={formState === 'sending'}>{formState === 'sending' ? c.sending : c.formSubmit} <span>→</span></button>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <p className="form-note"><span aria-hidden="true">●</span> {c.demoNote}</p>
          </form>
        )}
      </div>
    );
  }

  const taskDoctorBannerContent = (
    <div className="product-banner-inner shell">
      <span className="product-banner-brand"><i aria-hidden="true">✦</i> TaskDoctor.ai <em>{taskDoctor.badge}</em></span>
      <span className="product-banner-copy">
        <span className="product-banner-intro">{taskDoctor.intro}</span>
        <span className="product-banner-message">{taskDoctor.message}</span>
      </span>
      <span className="product-banner-privacy">{taskDoctor.privacy}</span>
    </div>
  );

  return (
    <main className="site-theme">
      <section className="hero" id="top">
        <nav className="nav shell" aria-label={c.navLabel}>
          <a className="brand brand-header" href="https://www.innovamontreal.com/" target="_blank" rel="noopener noreferrer" aria-label={c.homeLabel}><span className="brand-logo" aria-hidden="true"><img src="/rive-intelligente-logo.png" alt="" /></span><span className="brand-name">Rive Intelligente <small>by Innova Montreal</small></span></a>
          <div className="nav-links"><a className="nav-offer-link" href={alternateOffer.href}>{alternateOffer.label}</a><a href="#method">{c.navMethod}</a><a href="#applications">{c.navApplications}</a><a href="#questions">{c.navQuestions}</a></div>
          <div className="nav-actions">
            <div className="language-switcher" aria-label={c.languageLabel}>
              {(Object.keys(languagePaths) as Locale[]).map((language) => <a key={language} className={locale === language ? 'active' : ''} href={`${languagePaths[language]}${query}`}>{language.toUpperCase()}</a>)}
            </div>
            <a className="button button-small" href="#diagnosis" onClick={openQuickForm}>{c.call} <span aria-hidden="true">↗</span></a>
          </div>
        </nav>

        {taskDoctor.href ? (
          <a className="product-banner product-banner-link" href={taskDoctor.href} target="_blank" rel="noopener noreferrer" aria-label={`${taskDoctor.intro}. ${taskDoctor.message}`}>
            {taskDoctorBannerContent}
          </a>
        ) : (
          <div className="product-banner product-banner-static" aria-label="TaskDoctor.ai">
            {taskDoctorBannerContent}
          </div>
        )}

        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />{c.eyebrow}</p>
            <h1>{c.heroFirst}<span>{c.heroSecond}</span></h1>
            <p className="hero-lead">{c.heroLead}</p>
            <div className="hero-actions"><a className="button button-primary" href="#diagnosis" onClick={openQuickForm}>{c.request} <span aria-hidden="true">→</span></a><a className="text-link" href="#method">{c.how} <span aria-hidden="true">↓</span></a></div>
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

      <section className="diagnostic diagnostic-priority section-pad" id="diagnosis"><div className="shell diagnostic-wrap">
        <div className="diagnostic-copy"><p className="kicker">{c.diagnosisKicker}</p><h2>{c.diagnosisTitle}</h2><p>{c.diagnosisCopy}</p><div className="promise-list">{c.promises.map(([value, detail], index) => <div key={value}><span>0{index + 1}</span><p><strong>{value}</strong> {detail}</p></div>)}</div>{campaign.source && <div className="source-detected"><i /> {c.sourceDetected} <strong>{campaign.source}</strong></div>}</div>
        {renderLeadForm()}
      </div></section>

      <section className="method section-pad" id="method"><div className="shell">
        <div className="section-heading method-heading"><p className="kicker kicker-light">{c.methodKicker}</p><h2>{c.methodTitleOne}<br />{c.methodTitleTwo}</h2><p>{c.methodIntro}</p></div>
        <div className="method-grid">{c.methods.map((method, index) => <article key={method.title} className={index === 2 ? 'featured-method' : ''}><div className="method-top"><span>0{index + 1}</span><i>{method.stage}</i></div><div className={`method-glyph ${index === 0 ? 'glyph-radar' : index === 1 ? 'glyph-flow' : index === 2 ? 'glyph-people' : 'glyph-measure'}`} aria-hidden="true">{index === 0 ? <><span /><b /><i /></> : index === 1 ? <><span /><span /><span /><b /><b /></> : <><span /><span /><span /><b /></>}</div><h3>{method.title}</h3><p>{method.copy}</p></article>)}</div>
      </div></section>

      <section className="use-cases section-pad" id="applications"><div className="shell">
        <div className="section-heading split-heading"><div><p className="kicker">{c.applicationsKicker}</p><h2>{c.applicationsTitle}</h2></div><p>{c.applicationsIntro}</p></div>
        <div className="case-grid">{c.useCases.map((item) => <article className="case-card" key={item.area}><div className="case-meta"><span>{item.number}</span><strong>{item.area}</strong></div><div className={`case-art case-art-${item.number}`} aria-hidden="true"><span /><span /><i /></div><h3>{item.title}</h3><p>{item.copy}</p><div className="tag-row">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div>
        <aside className="value-proof" id="results">
          <div className="value-proof-copy"><p className="kicker">{c.outcomesKicker}</p><h3>{c.outcomesOne} <span>{c.outcomesTwo}</span></h3><p>{c.outcomesCopy}</p></div>
          <div className="value-proof-metrics" aria-label={c.metrics.recovered}>
            {[
              [c.metrics.speed, '↓', c.metrics.cycle],
              [c.metrics.quality, '↑', c.metrics.consistency],
              [c.metrics.adoption, '%', c.metrics.activeUse],
              [c.metrics.trust, '✓', c.metrics.safeUse],
            ].map(([label, value, detail]) => <div key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>)}
          </div>
          <a className="value-proof-link" href="#diagnosis" onClick={openQuickForm}>{c.outcomesCta} <span aria-hidden="true">→</span></a>
        </aside>
      </div></section>

      <section className="faq section-pad" id="questions"><div className="shell faq-grid"><div className="section-heading sticky-heading"><p className="kicker">{c.faqKicker}</p><h2>{c.faqTitle}</h2></div><div className="faq-list">{c.faqs.slice(0, 3).map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{question}</span><i aria-hidden="true">+</i></summary><p>{answer}</p></details>)}</div></div></section>

      <footer><div className="shell footer-main"><a className="brand brand-footer" href="#top"><span className="brand-logo" aria-hidden="true"><img src="/rive-intelligente-logo.png" alt="" /></span><span>Rive Intelligente</span></a><p>{c.footerLineOne}<br />{c.footerLineTwo}</p><a className="footer-cta" href="#diagnosis" onClick={openQuickForm}>{c.footerCta} <span>↗</span></a></div><div className="shell footer-bottom"><span>© 2026 Rive Intelligente</span><span>{c.footerDescriptor}</span><a href="#top">{c.backTop}</a></div></footer>

      <a className="quick-access-cta" href="#diagnosis" onClick={openQuickForm} aria-label={c.request}>
        <strong>{c.request}</strong><i aria-hidden="true">↗</i>
      </a>

      {quickFormOpen && (
        <div className="quick-form-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setQuickFormOpen(false); }}>
          <div className="quick-form-dialog" role="dialog" aria-modal="true" aria-labelledby="quick-form-title">
            <button className="quick-form-close" type="button" onClick={() => setQuickFormOpen(false)} aria-label={locale === 'fr' ? 'Fermer le formulaire' : locale === 'en' ? 'Close form' : 'Cerrar formulario'}>×</button>
            {renderLeadForm(true)}
          </div>
        </div>
      )}
    </main>
  );
}
