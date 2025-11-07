import React from 'react';
import type { GlossaryTerm } from '../types';
import { Pencil, ImageIcon } from 'lucide-react';
import { TermCard } from './TermCard';
import type { Translations } from '../hooks/useTranslations';

interface TermListProps {
  terms: GlossaryTerm[];
  onSelectTerm: (term: GlossaryTerm) => void;
  onOpenEdit: (term: GlossaryTerm) => void;
  viewMode: 'table' | 'card';
  t: Translations;
}

export const TermList: React.FC<TermListProps> = ({ terms, onSelectTerm, onOpenEdit, viewMode, t }) => {
  if (terms.length === 0) {
    return <p className="text-center p-8 text-gray-500">{t.noTermsFound}</p>;
  }

  if (viewMode === 'card') {
    return (
      <div className="h-full overflow-auto p-4 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {terms.map(term => (
            <TermCard
              key={term.id}
              term={term}
              onSelectTerm={onSelectTerm}
              onEdit={onOpenEdit}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-sm text-slate-600 font-semibold bg-slate-100 sticky top-0 z-10 border-b-2 border-slate-200">
          <tr>
            <th scope="col" className="px-6 py-4 min-w-[150px]">{t.term}</th>
            <th scope="col" className="px-6 py-4">{t.image}</th>
            <th scope="col" className="px-6 py-4 min-w-[150px]">{t.english}</th>
            <th scope="col" className="px-6 py-4 min-w-[300px]">{t.meaning}</th>
            <th scope="col" className="px-6 py-4 min-w-[200px]">{t.categories}</th>
            <th scope="col" className="px-6 py-4 text-center">{t.actions}</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {terms.map((term, index) => (
              <tr 
                key={term.id} 
                className={`transition-colors duration-150 group hover:bg-cyan-50 cursor-pointer ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                }`}
                onClick={() => onSelectTerm(term)}
              >
                <td className="px-6 py-4 align-middle font-medium text-gray-900">
                    <ruby className="leading-tight">
                      <span className="inline-block pb-0.5 text-lg">{term.term}</span>
                      <rt className="select-none text-xs text-cyan-600">{term.reading}</rt>
                    </ruby>
                </td>
                <td className="px-6 py-4 align-middle">
                  {term.imageUrl ? (
                    <img src={term.imageUrl} alt={term.term} className="h-10 w-16 object-cover rounded-md shadow-sm" />
                  ) : (
                    <div className="h-10 w-16 rounded-md flex items-center justify-center bg-slate-100 border border-dashed border-slate-200">
                      <ImageIcon size={18} className="text-slate-400" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 align-middle text-slate-600">
                  {term.english}
                </td>
                <td className="px-6 py-4 align-middle text-slate-600">
                  <div className="whitespace-pre-wrap line-clamp-3">{term.meaning}</div>
                </td>
                <td className="px-6 py-4 align-middle">
                   <div className="flex flex-wrap gap-1.5">
                    {term.categories.map(cat => (
                      <span key={cat} className="px-2.5 py-1 bg-cyan-100 text-cyan-800 text-xs font-medium rounded-full whitespace-nowrap">{cat}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 align-middle text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center">
                    <button 
                      onClick={() => onOpenEdit(term)} 
                      className="p-2 rounded-full text-slate-600 transition-all duration-200 hover:bg-cyan-100 hover:text-cyan-600" 
                      aria-label="Edit term"
                    >
                        <Pencil size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};