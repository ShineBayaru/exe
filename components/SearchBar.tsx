import React from 'react';
import { Search, X } from 'lucide-react';
import type { Translations } from '../hooks/useTranslations';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  t: Translations;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, t }) => {
  return (
    <div className="relative w-full group">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors duration-200">
        <Search size={18} />
      </span>
      <input
        type="text"
        placeholder={t.searchTerms}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-slate-100 border-2 border-transparent rounded-lg py-2.5 pl-10 pr-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 transition-all duration-200"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};