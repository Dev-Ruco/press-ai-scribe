
import { Language, TranslationsCollection } from './types';
import { commonTranslations } from './translations/common';
import { landingTranslations } from './translations/landing';
import { journeyTranslations } from './translations/journey';
import { pricingTranslations } from './translations/pricing';
import { appTranslations } from './translations/app';

// Merge all translation collections into one
const mergeTranslations = (): TranslationsCollection => {
  const result: TranslationsCollection = { en: {}, pt: {} };
  
  // Helper function to merge translations from a collection into the result
  const mergeCollection = (collection: TranslationsCollection) => {
    ['en', 'pt'].forEach(lang => {
      result[lang] = { ...result[lang], ...collection[lang] };
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
