
export type Language = 'en' | 'pt';

export interface TranslationObject {
  [key: string]: string;
}

export interface TranslationsCollection {
  [language: string]: TranslationObject;
}
