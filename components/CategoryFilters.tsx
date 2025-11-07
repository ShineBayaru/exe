import React from 'react';
import { Check, X, Tag } from 'lucide-react';
import type { Translations } from '../hooks/useTranslations';

interface CategoryFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onSelectCategory: (category: string) => void;
  onClear: () => void;
  t: Translations;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  selectedCategories,
  onSelectCategory,
  onClear,
  t,
}) => {
  return (
    <div className="flex flex-col flex-grow min-h-0">
      <div className="flex justify-between items-center px-2 mb-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t.filterByCategory}</h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <X size={14}/> {t.clear}
          </button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto pr-1 space-y-1">
        {categories.map(category => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`w-full px-3 py-2 text-sm rounded-md transition-colors duration-200 flex items-center justify-between text-left ${
                isSelected
                  ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag size={16} />
                <span>{category}</span>
              </div>
              {isSelected && <Check size={16} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};