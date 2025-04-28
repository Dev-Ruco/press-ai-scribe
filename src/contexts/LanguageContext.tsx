
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '@/types/language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Store the selected language in localStorage to persist between sessions
const getStoredLanguage = (): Language => {
  const storedLanguage = localStorage.getItem('preferredLanguage');
  return (storedLanguage as Language) || 'pt';
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(getStoredLanguage);

  // Update the language in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
    // Force update on documents to ensure all components re-render
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
