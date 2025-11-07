import { jp } from '../locales/jp';
import { en } from '../locales/en';

export type Language = 'jp' | 'en';
export type Translations = typeof jp;

const translations = { jp, en };

export const useTranslations = (lang: Language) => {
  return translations[lang];
};
