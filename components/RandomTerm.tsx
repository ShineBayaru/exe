import React, { useState, useEffect } from 'react';
import type { GlossaryTerm } from '../types';
import type { Language } from '../hooks/useTranslations';
import { LanguageToggle } from './LanguageToggle';
import { List, LayoutGrid } from 'lucide-react';

type ViewMode = 'table' | 'card';
type Page = 'glossary' | 'stats' | 'training';

interface RandomTermProps {
  terms: GlossaryTerm[];
  onSelectTerm: (term: GlossaryTerm) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activePage: Page;
}

const ANIMATION_ITEM_COUNT = 4;
const ANIMATION_DURATION_S = 10;

export const RandomTerm: React.FC<RandomTermProps> = ({ 
  terms, 
  onSelectTerm, 
  language, 
  setLanguage,
  viewMode,
  setViewMode,
  activePage
}) => {
  const [animationTerms, setAnimationTerms] = useState<GlossaryTerm[]>([]);

  useEffect(() => {
    if (terms.length >= ANIMATION_ITEM_COUNT) {
      const shuffled = [...terms].sort(() => 0.5 - Math.random());
      setAnimationTerms(shuffled.slice(0, ANIMATION_ITEM_COUNT));
    }
  }, [terms]);

  if (animationTerms.length < ANIMATION_ITEM_COUNT) {
    return null;
  }

  const keyframes = `
    @keyframes change {
      0%, 12.66%, 100% {transform:translate3d(0,0,0);}
      16.66%, 29.32% {transform:translate3d(0,-25%,0);}
      33.32%,45.98% {transform:translate3d(0,-50%,0);}
      49.98%,62.64% {transform:translate3d(0,-75%,0);}
      66.64%,79.3% {transform:translate3d(0,-50%,0);}
      83.3%,95.96% {transform:translate3d(0,-25%,0);}
    }
  `;

  return (
    <div className="p-3 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-cyan-400/10 flex flex-col items-center gap-3">
      <style>{keyframes}</style>
      <div 
        className="w-full text-center"
        style={{
          height: '1.5rem', // Match line height to create a window effect
          overflow: 'hidden',
        }}
      >
        <ul 
          className="p-0 m-0 list-none"
          style={{
              animationName: 'change',
              animationDuration: `${ANIMATION_DURATION_S}s`,
              animationIterationCount: 'infinite',
          }}
        >
          {animationTerms.map(term => (
            <li 
              key={term.id} 
              className="text-base font-medium text-gray-900 dark:text-white cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              style={{
                  lineHeight: '1.5rem',
                  height: '1.5rem', // Fixed height for each item
                  margin: 0,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectTerm(term);
              }}
            >
              {term.term}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center gap-4">
        <LanguageToggle language={language} setLanguage={setLanguage} />
        {activePage === 'glossary' && (
          <div className="view-toggle" data-view-mode={viewMode}>
            <div className="view-toggle-indicator"></div>
            <button
                onClick={() => setViewMode('table')}
                className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                aria-pressed={viewMode === 'table'}
                title="Table View"
            >
                <List size={16} />
            </button>
            <button
                onClick={() => setViewMode('card')}
                className={`view-toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                aria-pressed={viewMode === 'card'}
                title="Card View"
            >
                <LayoutGrid size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};