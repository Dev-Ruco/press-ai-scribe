
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types/language';
import { Flag } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function LanguageSelector({ 
  variant = 'default',
  className
}: LanguageSelectorProps) {
  const { language, setLanguage, isLanguageLoading } = useLanguage();
  
  // Language options with their display info
  const languages: { 
    value: Language; 
    label: string; 
    flag: string;
    name: string;
  }[] = [
    { value: 'pt-MZ', label: '🇲🇿 PT-MZ', flag: '🇲🇿', name: 'Português (Moçambique)' },
    { value: 'en-UK', label: '🇬🇧 EN-UK', flag: '🇬🇧', name: 'English (UK)' }
  ];
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language);
  };
  
  const selectedLanguage = languages.find(lang => lang.value === language);
  
  if (isLanguageLoading) {
    return <div className="h-9 w-24 animate-pulse bg-slate-100 rounded"></div>;
  }
  
  return (
    <Select 
      value={language} 
      onValueChange={handleLanguageChange}
    >
      <SelectTrigger 
        className={cn(
          "border-slate-200 bg-white",
          variant === 'compact' ? "w-14 px-1" : "w-28",
          className
        )}
      >
        <SelectValue>
          <div className="flex items-center gap-1 truncate">
            {variant === 'compact' ? (
              <span>{selectedLanguage?.flag}</span>
            ) : (
              <>
                <span>{selectedLanguage?.flag}</span>
                <span className="ml-1 text-xs font-medium">{selectedLanguage?.value}</span>
              </>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem 
            key={lang.value} 
            value={lang.value}
            className="flex items-center"
          >
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
