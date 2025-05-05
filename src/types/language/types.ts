
export type Language = 'en-UK' | 'pt-MZ';

export interface TranslationObject {
  [key: string]: string;
}

export interface TranslationsCollection {
  [language: string]: TranslationObject;
}
