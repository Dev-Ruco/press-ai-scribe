
export type Language = 'pt' | 'en';

export interface Translation {
  login: string;
  signup: string;
  welcomeBack: string;
  createAccount: string;
  enterToContinue: string;
  registerToStart: string;
  continueWith: string;
  dashboard: string;
  registerButton: string;
  orContinueWith: string;
  // Dashboard and header translations
  search: string;
  newButton: string;
  settings: string;
  logout: string;
  // Team section translations
  ourTeam: string;
  executiveDirector: string;
  marketingDirector: string;
  operationsDirector: string;
  // Footer translations
  transformingJournalism: string;
  product: string;
  pricing: string;
  features: string;
  company: string;
  about: string;
  contact: string;
  blog: string;
  legal: string;
  privacy: string;
  terms: string;
  allRightsReserved: string;
  // Dashboard translations
  welcomeMessage: string;
  intelligentMonitoring: string;
  monitoringDescription: string;
  automaticTranscription: string;
  transcriptionDescription: string;
  acceleratedProduction: string;
  productionDescription: string;
}

export const translations: Record<Language, Translation> = {
  pt: {
    login: 'Entrar',
    signup: 'Registar',
    welcomeBack: 'Bem-vindo de volta',
    createAccount: 'Criar uma conta',
    enterToContinue: 'Entre com sua conta para continuar',
    registerToStart: 'Cadastre-se para começar a usar',
    continueWith: 'Ou continue com',
    dashboard: 'Painel',
    registerButton: 'Regista-te',
    orContinueWith: 'Ou continue com',
    // Dashboard and header translations
    search: 'Pesquisar...',
    newButton: 'Novo',
    settings: 'Configurações',
    logout: 'Sair',
    // Team section translations
    ourTeam: 'Nossa Equipa',
    executiveDirector: 'Director Executivo',
    marketingDirector: 'Directora de Marketing',
    operationsDirector: 'Director Operacional',
    // Footer translations
    transformingJournalism: 'Transformando o jornalismo com inteligência artificial.',
    product: 'Produto',
    pricing: 'Preços',
    features: 'Funcionalidades',
    company: 'Empresa',
    about: 'Sobre',
    contact: 'Contacto',
    blog: 'Blog',
    legal: 'Legal',
    privacy: 'Privacidade',
    terms: 'Termos',
    allRightsReserved: 'Todos os direitos reservados.',
    // Dashboard translations
    welcomeMessage: 'Bem-vindo ao PRESS AI',
    intelligentMonitoring: 'Monitoramento Inteligente',
    monitoringDescription: 'Acompanhe suas fontes de notícias em tempo real e receba atualizações instantâneas.',
    automaticTranscription: 'Transcrição Automática',
    transcriptionDescription: 'Converta áudio em texto com precisão e rapidez usando nossa tecnologia avançada.',
    acceleratedProduction: 'Produção Acelerada',
    productionDescription: 'Aumente sua produtividade com ferramentas de IA que agilizam seu fluxo de trabalho.'
  },
  en: {
    login: 'Login',
    signup: 'Sign Up',
    welcomeBack: 'Welcome Back',
    createAccount: 'Create Account',
    enterToContinue: 'Sign in to continue',
    registerToStart: 'Sign up to get started',
    continueWith: 'Or continue with',
    dashboard: 'Dashboard',
    registerButton: 'Register',
    orContinueWith: 'Or continue with',
    // Dashboard and header translations
    search: 'Search...',
    newButton: 'New',
    settings: 'Settings',
    logout: 'Logout',
    // Team section translations
    ourTeam: 'Our Team',
    executiveDirector: 'Executive Director',
    marketingDirector: 'Marketing Director',
    operationsDirector: 'Operations Director',
    // Footer translations
    transformingJournalism: 'Transforming journalism with artificial intelligence.',
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
    // Dashboard translations
    welcomeMessage: 'Welcome to PRESS AI',
    intelligentMonitoring: 'Intelligent Monitoring',
    monitoringDescription: 'Track your news sources in real time and receive instant updates.',
    automaticTranscription: 'Automatic Transcription',
    transcriptionDescription: 'Convert audio to text with precision and speed using our advanced technology.',
    acceleratedProduction: 'Accelerated Production',
    productionDescription: 'Increase your productivity with AI tools that streamline your workflow.'
  }
};
