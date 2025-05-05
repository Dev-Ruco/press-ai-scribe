
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Language, translations } from '@/types/language';

// Define the language context type
interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isLanguageLoading: boolean;
}

// Create the language context with a default value
const LanguageContext = createContext<LanguageContextProps>({
  language: 'en-UK', // Default language is British English
  setLanguage: () => {}, // Placeholder function
  t: (key: string) => key, // Placeholder function
  isLanguageLoading: false,
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en-UK');
  const [isLanguageLoading, setIsLanguageLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load user's language preference on login
  useEffect(() => {
    const loadUserLanguage = async () => {
      if (user) {
        try {
          setIsLanguageLoading(true);
          
          // Try to get the user's language preference from the database
          const { data, error } = await supabase
            .from('profiles')
            .select('language_preference')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error loading language preference:', error);
          } else if (data && data.language_preference) {
            // Validate the language preference is one of our supported options
            const savedLang = data.language_preference as Language;
            if (savedLang === 'en-UK' || savedLang === 'pt-MZ') {
              setLanguageState(savedLang);
            }
          }
        } catch (err) {
          console.error('Failed to load language setting:', err);
        } finally {
          setIsLanguageLoading(false);
        }
      } else {
        // If no user is logged in, try to load from localStorage
        const savedLang = localStorage.getItem('app_language');
        if (savedLang && (savedLang === 'en-UK' || savedLang === 'pt-MZ')) {
          setLanguageState(savedLang as Language);
        }
        setIsLanguageLoading(false);
      }
    };

    loadUserLanguage();
  }, [user]);

  // Function to set the language and save it
  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    
    // Save to localStorage for non-authenticated users
    localStorage.setItem('app_language', newLanguage);
    
    // Update in database for authenticated users
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ language_preference: newLanguage })
          .eq('id', user.id);
        
        if (error) {
          console.error('Error saving language preference:', error);
          toast({
            title: newLanguage === 'pt-MZ' ? 'Erro ao salvar preferência de idioma' : 'Error saving language preference',
            description: newLanguage === 'pt-MZ' ? 'Por favor, tente novamente mais tarde' : 'Please try again later',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error('Failed to save language setting:', err);
      }
    }
  };

  // Function to translate keys based on the current language
  const t = (key: string): string => {
    // Use the translations from the imported file
    return translations[language]?.[key] || key;
  };

  const value: LanguageContextProps = {
    language,
    setLanguage,
    t,
    isLanguageLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
