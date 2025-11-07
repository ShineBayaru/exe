import React from 'react';
import type { GlossaryTerm } from '../types';
import { Pencil, ImageIcon } from 'lucide-react';

interface TermCardProps {
  term: GlossaryTerm;
  onSelectTerm: (term: GlossaryTerm) => void;
  onEdit: (term: GlossaryTerm) => void;
}

export const TermCard: React.FC<TermCardProps> = ({
  term,
  onSelectTerm,
  onEdit,
}) => {
  return (
    <div 
      className="bg-white dark:bg-black/20 border border-gray-200 dark:border-cyan-400/10 rounded-lg flex flex-col shadow-md hover:shadow-lg dark:hover:shadow-cyan-400/10 hover:border-gray-300 dark:hover:border-cyan-400/30 transition-all duration-300 group cursor-pointer overflow-hidden"
      onClick={() => onSelectTerm(term)}
    >
      {term.imageUrl ? (
        <div className="h-40 bg-gray-100 dark:bg-black/30">
          <img src={term.imageUrl} alt={term.term} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-40 bg-gray-50 dark:bg-black/10 flex items-center justify-center">
          <ImageIcon size={32} className="text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <ruby className="leading-tight">
            <span className="inline-block pb-0.5 text-xl text-gray-900 dark:text-white">{term.term}</span>
            <rt className="select-none text-xs text-cyan-600 dark:text-cyan-400/80">{term.reading}</rt>
          </ruby>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{term.english}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-3">{term.meaning}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-cyan-400/10">
          <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5 items-center overflow-hidden">
                  {term.categories.slice(0, 3).map(cat => (
                      <span key={cat} className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-400/10 text-cyan-800 dark:text-cyan-300 text-xs rounded-full whitespace-nowrap">{cat}</span>
                  ))}
              </div>
              <div className="flex items-center gap-1 transition-opacity flex-shrink-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(term);
                    }} 
                    className="p-2 rounded-full text-gray-600 hover:bg-cyan-100 dark:hover:bg-cyan-400/10 hover:text-cyan-600 dark:hover:text-cyan-300" 
                    aria-label="Edit term"
                  >
                    <Pencil size={18} />
                  </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};