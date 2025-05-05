
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, translations } from '@/types/language';

// Define the language context type
interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
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
  const [language, setLanguage] = useState<Language>('en');

  // Function to translate keys based on the current language
  const t = (key: string) => {
    // Use the translations from the imported file
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
