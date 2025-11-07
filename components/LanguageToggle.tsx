import React from 'react';
import type { Language } from '../hooks/useTranslations';

interface LanguageToggleProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const JapanFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" className="w-6 h-auto rounded-sm shadow">
    <rect fill="#fff" width="9" height="6" stroke="#ccc" strokeWidth="0.5" />
    <circle fill="#BC002D" cx="4.5" cy="3" r="1.8"/>
  </svg>
);

const UKFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-6 h-auto rounded-sm shadow">
    <clipPath id="t">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <rect width="60" height="30" fill="#00247d" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#cf142b" strokeWidth="4"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6"/>
  </svg>
);


export const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, setLanguage }) => {
  return (
    <div className="lang-toggle" data-lang={language}>
      <div className="lang-toggle-indicator"></div>
      <button
        onClick={() => setLanguage('jp')}
        className={`lang-toggle-btn ${language === 'jp' ? 'active' : ''}`}
        aria-pressed={language === 'jp'}
        title="日本語"
      >
        <JapanFlag />
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`lang-toggle-btn ${language === 'en' ? 'active' : ''}`}
        aria-pressed={language === 'en'}
        title="English"
      >
        <UKFlag />
      </button>
    </div>
  );
};