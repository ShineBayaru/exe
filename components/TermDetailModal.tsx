import React from 'react';
import type { GlossaryTerm } from '../types';
import { X, User, Calendar } from 'lucide-react';
import type { Translations } from '../hooks/useTranslations';

interface TermDetailModalProps {
  term: GlossaryTerm | null;
  onClose: () => void;
  t: Translations;
}

const DetailRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="py-3 border-b border-gray-200 dark:border-cyan-400/10">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-base text-gray-800 dark:text-white whitespace-pre-wrap">{value}</p>
        </div>
    )
};

export const TermDetailModal: React.FC<TermDetailModalProps> = ({ term, onClose, t }) => {
  if (!term) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-black/50 backdrop-blur-xl rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-cyan-400/30 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 dark:bg-black/30 backdrop-blur-md p-4 md:p-6 flex justify-between items-start border-b border-gray-200 dark:border-cyan-400/20 z-10">
          <div>
            <ruby>
              <span className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{term.term}</span>
              <rt className="text-gray-500 dark:text-gray-400 text-sm select-none">{term.reading}</rt>
            </ruby>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-800 dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6">
            {term.imageUrl && (
              <div className="mb-6 bg-gray-100 dark:bg-black/20 rounded-lg p-2">
                <img 
                  src={term.imageUrl} 
                  alt={term.term} 
                  className="rounded-md w-full max-h-72 object-contain" 
                />
              </div>
            )}

            <div className="mb-4 p-4 bg-gray-50 dark:bg-black/30 rounded-lg">
                <p className="text-lg text-gray-700 dark:text-gray-200">{term.meaning}</p>
            </div>
            
            <div className="space-y-2">
                <DetailRow label={t.alias} value={term.alias} />
                <DetailRow label={t.english} value={term.english} />
                <DetailRow label={t.categories} value={term.categories.join(', ')} />
                <DetailRow label={t.notes} value={term.notes} />
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-500">
                <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{t.addedBy}: <strong className="text-gray-700 dark:text-gray-300 font-medium">{term.author}</strong></span>
                </div>
                 <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{t.addedOn}: <strong className="text-gray-700 dark:text-gray-300 font-medium">{term.dateAdded}</strong></span>
                </div>
                {term.updater && (
                    <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{t.updatedBy}: <strong className="text-gray-700 dark:text-gray-300 font-medium">{term.updater}</strong></span>
                    </div>
                )}
                {term.dateUpdated && (
                     <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{t.updatedOn}: <strong className="text-gray-700 dark:text-gray-300 font-medium">{term.dateUpdated}</strong></span>
                    </div>
                )}
            </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        @keyframes slide-up {
            from { transform: translateY(20px) scale(0.98); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};