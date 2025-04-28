
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
    orContinueWith: 'Ou continue com'
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
    orContinueWith: 'Or continue with'
  }
};
