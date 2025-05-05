
import { Language, TranslationsCollection } from './types';
import { commonTranslations } from './translations/common';
import { landingTranslations } from './translations/landing';
import { journeyTranslations } from './translations/journey';
import { pricingTranslations } from './translations/pricing';
import { appTranslations } from './translations/app';

// Merge all translation collections into one
const mergeTranslations = (): TranslationsCollection => {
  const result: TranslationsCollection = { 'en-UK': {}, 'pt-MZ': {} };
  
  // Helper function to merge translations from a collection into the result
  const mergeCollection = (collection: TranslationsCollection) => {
    ['en-UK', 'pt-MZ'].forEach(lang => {
      // Map legacy keys to new language codes
      const sourceKey = lang === 'en-UK' ? 'en' : 'pt';
      result[lang] = { ...result[lang], ...collection[sourceKey] };
    });
  };
  
  // Merge all translation collections
  [
    commonTranslations,
    landingTranslations,
    journeyTranslations,
    pricingTranslations,
    appTranslations,
  ].forEach(mergeCollection);
  
  return result;
};

export const translations = mergeTranslations();
export type { Language };
export type { TranslationsCollection, TranslationObject } from './types';
