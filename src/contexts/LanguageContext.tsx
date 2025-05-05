import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the language context type
interface LanguageContextProps {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

// Create the language context with a default value
const LanguageContext = createContext<LanguageContextProps>({
  language: 'en', // Default language is English
  setLanguage: () => {}, // Placeholder function
  t: (key: string) => key, // Placeholder function
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');

  // Function to translate keys based on the current language
  const t = (key: string) => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  const value: LanguageContextProps = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Our translations
const translations = {
  en: {
    // Header
    login: 'Log in',
    registerButton: 'Start Now',
    dashboard: 'Dashboard',
    
    // Hero
    heroRevolutionizing: 'Revolutionizing Journalism Workflows',
    heroTitle: 'Transform Your Journalism Workflow',
    heroDescription: 'Upload any content - audio, video, text, and images - and receive a perfectly written journalistic article within minutes.',
    tryItNow: 'Try It Now',
    startTransforming: 'Start Transforming Your Workflow',
    journalistsCount: 'Trusted by 5,000+ journalists',
    saveTime: 'Save up to',
    modernHeroTitle1: 'Turn Interviews into',
    modernHeroTitle2: 'Articles in Minutes',
    modernHeroDescription: 'PRESS AI empowers journalists to reduce transcription time by 70% and increase productivity by 300%. Focus on quality reporting, not tedious tasks.',
    timeSaved: 'Time Saved',
    productivity: 'Productivity',
    aiPowered: 'AI Powered',
    exploreFeatures: 'Explore Features',
    
    // Before & After Section
    beforeAfterTitle: 'The Transformative Impact on Editorial Workflows',
    beforeAfterDescription: 'See how PRESS AI revolutionizes the traditional process of turning raw material into polished journalistic content.',
    beforeTitle: 'Traditional Workflow',
    beforePoint1: 'Manual transcription of interviews and recordings',
    beforePoint2: 'Content structuring and story angle development',
    beforePoint3: 'Grammar checking and editorial review',
    afterTitle: 'PRESS AI Workflow',
    afterPoint1: 'Automatic transcription with AI accuracy',
    afterPoint2: 'AI-assisted structure and narrative suggestions',
    afterPoint3: 'Built-in grammar and style enhancement',
    totalTimeSpent: 'Total Time Investment',
    perArticle: 'per article',
    hour: 'hour',
    hours: 'hours',
    timeRecoveryTitle: 'Reclaim 5+ Hours on Every Article',
    timeRecoveryDescription: 'What would you do with the extra time? More in-depth reporting? Additional stories? Better work-life balance?',
    
    // Features Section
    featuresSectionTitle: 'From Raw Content to Polished Article',
    featuresSectionDescription: 'A streamlined workflow that transforms your content into publication-ready articles, maintaining your unique editorial voice while saving hours of your time.',
    featureIntelligentIngestion: 'Smart Content Upload',
    featureIntelligentIngestionDesc: 'Upload any type of media - audio interviews, video recordings, images with text, or documents.',
    featureTranscription: 'Automatic Transcription',
    featureTranscriptionDesc: 'State-of-the-art AI converts speech to accurate text with speaker identification and punctuation.',
    featureProcessing: 'Content Processing',
    featureProcessingDesc: 'AI analyzes content, identifies key topics, facts, quotes, and maintains the narrative context.',
    featureArticleCreation: 'Article Generation',
    featureArticleCreationDesc: 'Receive multiple headline options and a complete article structure with proper journalistic style.',
    featureEditing: 'AI-Assisted Editing',
    featureEditingDesc: 'Refine the generated content with intelligent suggestions that match your publication\'s style guide.',
    featureExport: 'Multi-Format Export',
    featureExportDesc: 'Export to WordPress, Google Docs, or custom CMS with formatting preserved.',
    startNow: 'Start Creating Now',
    
    // User Journey
    userJourneyTitle: 'The Journalist\'s Journey with PRESS AI',
    userJourneyDescription: 'Follow the path from raw material to published article and see how PRESS AI transforms each step.',
    journeyStep1Title: 'Content Import',
    journeyStep1Desc: 'Upload interviews, recordings, notes, or documents in any format.',
    journeyStep2Title: 'Automatic Processing',
    journeyStep2Desc: 'AI transcribes, analyzes, and structures your raw content.',
    journeyStep3Title: 'Article Generation',
    journeyStep3Desc: 'Multiple headline options and full article draft created in your style.',
    journeyStep4Title: 'Review & Edit',
    journeyStep4Desc: 'Quickly refine the AI-generated content with smart assistance.',
    journeyStep5Title: 'Export & Publish',
    journeyStep5Desc: 'Send directly to your CMS or export in your preferred format.',
    totalTimeSaved: 'Your Time Savings',
    traditional: 'Traditional Process',
    withPressAi: 'With PRESS AI',
    timeIsMoney: 'That\'s over 80% of your time back for what really matters.',
    
    // Detailed Features
    exploreDetailedFeatures: 'Explore in Detail',
    
    // Testimonials
    testimonialTitle: 'Hear from Transformed Newsrooms',
    
    // Pricing
    perMonth: 'per month',
    planEnterprise: 'Enterprise',
    custom: 'Custom',
    contactUs: 'Contact Us',
    chooseThis: 'Choose',
    
    // Team
    meetOurTeam: 'Meet Our Team',
    
    // Footer
    transformingJournalism: 'Revolutionizing journalism workflows through the power of AI.',
    product: 'Product',
    pricing: 'Pricing',
    features: 'Features',
    company: 'Company',
    about: 'About',
    contact: 'Contact',
    blog: 'Blog',
    legal: 'Legal',
    privacy: 'Privacy',
    terms: 'Terms',
    allRightsReserved: 'All rights reserved.',

    // Dashboard welcome
    intelligentMonitoring: 'Intelligent Monitoring',
    monitoringDescription: 'Automatically track news sources and get alerts on emerging stories relevant to your beat.',
    automaticTranscription: 'Automatic Transcription',
    transcriptionDescription: 'Upload audio or video interviews and receive accurate transcripts with speaker identification.',
    acceleratedProduction: 'Accelerated Production',
    productionDescription: 'Transform raw materials into structured, SEO-optimized articles in minutes instead of hours.'
  },
  pt: {
    // Header
    login: 'Entrar',
    registerButton: 'Começar',
    dashboard: 'Painel',
    
    // Hero
    heroRevolutionizing: 'Revolucionando o Fluxo de Trabalho Jornalístico',
    heroTitle: 'Transforme o Seu Fluxo de Trabalho Jornalístico',
    heroDescription: 'Envie qualquer conteúdo - áudio, vídeo, texto e imagens - e receba um artigo jornalístico perfeitamente escrito em minutos.',
    tryItNow: 'Experimente Agora',
    startTransforming: 'Transforme seu Trabalho',
    journalistsCount: 'Confiado por mais de 5.000 jornalistas',
    saveTime: 'Economize até',
    modernHeroTitle1: 'Transforme Entrevistas em',
    modernHeroTitle2: 'Artigos em Minutos',
    modernHeroDescription: 'PRESS AI permite que jornalistas reduzam o tempo de transcrição em 70% e aumentem a produtividade em 300%. Concentre-se em reportagens de qualidade, não em tarefas tediosas.',
    timeSaved: 'Tempo Economizado',
    productivity: 'Produtividade',
    aiPowered: 'Potenciado por IA',
    exploreFeatures: 'Explorar Recursos',
    
    // Before & After Section
    beforeAfterTitle: 'O Impacto Transformador nos Fluxos Editoriais',
    beforeAfterDescription: 'Veja como o PRESS AI revoluciona o processo tradicional de transformar material bruto em conteúdo jornalístico polido.',
    beforeTitle: 'Fluxo Tradicional',
    beforePoint1: 'Transcrição manual de entrevistas e gravações',
    beforePoint2: 'Estruturação de conteúdo e desenvolvimento do ângulo da história',
    beforePoint3: 'Verificação gramatical e revisão editorial',
    afterTitle: 'Fluxo PRESS AI',
    afterPoint1: 'Transcrição automática com precisão de IA',
    afterPoint2: 'Estrutura assistida por IA e sugestões narrativas',
    afterPoint3: 'Gramática integrada e aprimoramento de estilo',
    totalTimeSpent: 'Investimento Total de Tempo',
    perArticle: 'por artigo',
    hour: 'hora',
    hours: 'horas',
    timeRecoveryTitle: 'Recupere mais de 5 Horas em Cada Artigo',
    timeRecoveryDescription: 'O que você faria com o tempo extra? Mais reportagens aprofundadas? Histórias adicionais? Melhor equilíbrio entre trabalho e vida pessoal?',
    
    // Features Section
    featuresSectionTitle: 'De Conteúdo Bruto a Artigo Polido',
    featuresSectionDescription: 'Um fluxo de trabalho simplificado que transforma seu conteúdo em artigos prontos para publicação, mantendo seu tom editorial único enquanto economiza horas do seu tempo.',
    featureIntelligentIngestion: 'Upload Inteligente',
    featureIntelligentIngestionDesc: 'Envie qualquer tipo de mídia - entrevistas em áudio, gravações em vídeo, imagens com texto ou documentos.',
    featureTranscription: 'Transcrição Automática',
    featureTranscriptionDesc: 'IA de última geração converte fala em texto preciso com identificação de locutor e pontuação.',
    featureProcessing: 'Processamento de Conteúdo',
    featureProcessingDesc: 'A IA analisa o conteúdo, identifica tópicos-chave, fatos, citações e mantém o contexto narrativo.',
    featureArticleCreation: 'Geração de Artigos',
    featureArticleCreationDesc: 'Receba múltiplas opções de títulos e uma estrutura completa de artigo com estilo jornalístico adequado.',
    featureEditing: 'Edição Assistida por IA',
    featureEditingDesc: 'Refine o conteúdo gerado com sugestões inteligentes que correspondem ao guia de estilo da sua publicação.',
    featureExport: 'Exportação Multi-formato',
    featureExportDesc: 'Exporte para WordPress, Google Docs ou CMS personalizado com formatação preservada.',
    startNow: 'Comece a Criar Agora',
    
    // User Journey
    userJourneyTitle: 'A Jornada do Jornalista com o PRESS AI',
    userJourneyDescription: 'Siga o caminho do material bruto ao artigo publicado e veja como o PRESS AI transforma cada etapa.',
    journeyStep1Title: 'Importação de Conteúdo',
    journeyStep1Desc: 'Envie entrevistas, gravações, anotações ou documentos em qualquer formato.',
    journeyStep2Title: 'Processamento Automático',
    journeyStep2Desc: 'A IA transcreve, analisa e estrutura seu conteúdo bruto.',
    journeyStep3Title: 'Geração de Artigo',
    journeyStep3Desc: 'Múltiplas opções de títulos e rascunho completo do artigo criados no seu estilo.',
    journeyStep4Title: 'Revisão e Edição',
    journeyStep4Desc: 'Refine rapidamente o conteúdo gerado pela IA com assistência inteligente.',
    journeyStep5Title: 'Exportar e Publicar',
    journeyStep5Desc: 'Envie diretamente para seu CMS ou exporte no formato preferido.',
    totalTimeSaved: 'Sua Economia de Tempo',
    traditional: 'Processo Tradicional',
    withPressAi: 'Com PRESS AI',
    timeIsMoney: 'Isso é mais de 80% do seu tempo de volta para o que realmente importa.',
    
    // Detailed Features
    exploreDetailedFeatures: 'Explorar em Detalhes',
    
    // Testimonials
    testimonialTitle: 'Ouça de Redações Transformadas',
    
    // Pricing
    perMonth: 'por mês',
    planEnterprise: 'Empresarial',
    custom: 'Personalizado',
    contactUs: 'Contacte-nos',
    chooseThis: 'Escolher',
    
    // Team
    meetOurTeam: 'Conheça Nossa Equipe',
    
    // Footer
    transformingJournalism: 'Revolucionando fluxos de trabalho jornalísticos através do poder da IA.',
    product: 'Produto',
    pricing: 'Preços',
    features: 'Recursos',
    company: 'Empresa',
    about: 'Sobre',
    contact: 'Contato',
    blog: 'Blog',
    legal: 'Legal',
    privacy: 'Privacidade',
    terms: 'Termos',
    allRightsReserved: 'Todos os direitos reservados.',

    // Dashboard welcome  
    intelligentMonitoring: 'Monitoramento Inteligente',
    monitoringDescription: 'Acompanhe automaticamente fontes de notícias e receba alertas sobre histórias emergentes relevantes para sua área.',
    automaticTranscription: 'Transcrição Automática',
    transcriptionDescription: 'Envie entrevistas em áudio ou vídeo e receba transcrições precisas com identificação do locutor.',
    acceleratedProduction: 'Produção Acelerada',
    productionDescription: 'Transforme materiais brutos em artigos estruturados e otimizados para SEO em minutos, em vez de horas.'
  }
};
