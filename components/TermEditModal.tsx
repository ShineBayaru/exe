import React, { useState, useEffect } from 'react';
import type { GlossaryTerm } from '../types';
import { X, Save, UploadCloud, Link, Trash2 } from 'lucide-react';
import type { Translations } from '../hooks/useTranslations';

interface TermEditModalProps {
  term: GlossaryTerm | null;
  onClose: () => void;
  onSave: (updatedTerm: GlossaryTerm) => void;
  allCategories: string[];
  t: Translations;
}

export const TermEditModal: React.FC<TermEditModalProps> = ({ term, onClose, onSave, allCategories, t }) => {
  const [formData, setFormData] = useState<GlossaryTerm | null>(null);
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('url');

  useEffect(() => {
    if (term) {
      setFormData(term);
    }
  }, [term]);

  if (!term || !formData) return null;

  const handleInputChange = (field: keyof Omit<GlossaryTerm, 'id' | 'categories' | 'dateAdded' | 'author'>, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleCategoryCheckboxChange = (category: string) => {
    setFormData(prev => {
      if (!prev) return null;
      const currentCategories = prev.categories;
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter(c => c !== category)
        : [...currentCategories, category];
      return { ...prev, categories: newCategories.sort() };
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = () => {
    if (formData) {
      onSave(formData);
    }
  };
  
  const inputClass = "w-full bg-white dark:bg-black/30 border border-gray-300 dark:border-cyan-400/20 rounded-lg py-2 px-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 transition duration-200";
  const labelClass = "block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1";

  return (
    <div
      className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-black/50 backdrop-blur-xl rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-cyan-400/30 animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 bg-white/80 dark:bg-black/30 backdrop-blur-md p-4 flex justify-between items-center border-b border-gray-200 dark:border-cyan-400/20 z-10 flex-shrink-0">
          <h2 className="text-xl font-bold text-cyan-700 dark:text-cyan-300 truncate pr-4">{term.term ? `${t.editTerm}: ${term.term}` : t.addNewTerm}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-800 dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </header>
        
        <main className="p-6 space-y-4 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="term-edit" className={labelClass}>{t.term}</label>
              <input id="term-edit" type="text" value={formData.term} onChange={(e) => handleInputChange('term', e.target.value)} className={inputClass} autoFocus />
            </div>
            <div>
              <label htmlFor="reading-edit" className={labelClass}>{t.reading}</label>
              <input id="reading-edit" type="text" value={formData.reading} onChange={(e) => handleInputChange('reading', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="english-edit" className={labelClass}>{t.english}</label>
            <input id="english-edit" type="text" value={formData.english} onChange={(e) => handleInputChange('english', e.target.value)} className={inputClass} />
          </div>
           <div>
            <label htmlFor="alias-edit" className={labelClass}>{t.alias}</label>
            <input id="alias-edit" type="text" value={formData.alias} onChange={(e) => handleInputChange('alias', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="meaning-edit" className={labelClass}>{t.meaning}</label>
            <textarea id="meaning-edit" value={formData.meaning} onChange={(e) => handleInputChange('meaning', e.target.value)} className={`${inputClass} min-h-[100px]`} rows={4} />
          </div>
          <div>
            <label className={labelClass}>{t.categories}</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3 p-3 bg-gray-50 dark:bg-black/20 rounded-lg max-h-48 overflow-y-auto border border-gray-200 dark:border-cyan-400/10">
              {allCategories.map(category => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() => handleCategoryCheckboxChange(category)}
                    className="h-4 w-4 rounded border-gray-300 dark:border-cyan-400/30 text-cyan-600 focus:ring-cyan-500 dark:focus:ring-cyan-400 bg-gray-100 dark:bg-black/30"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="border-t border-gray-200 dark:border-cyan-400/10 pt-4">
            <label className={labelClass}>{t.image}</label>
            <div className="flex rounded-lg bg-gray-100 dark:bg-black/20 p-1 mb-3 max-w-min">
                <button onClick={() => setImageTab('url')} className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2 transition-colors whitespace-nowrap ${imageTab === 'url' ? 'bg-white dark:bg-cyan-400/20 text-cyan-700 dark:text-cyan-300 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}>
                    <Link size={16} /> {t.url}
                </button>
                <button onClick={() => setImageTab('upload')} className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2 transition-colors whitespace-nowrap ${imageTab === 'upload' ? 'bg-white dark:bg-cyan-400/20 text-cyan-700 dark:text-cyan-300 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}>
                    <UploadCloud size={16} /> {t.upload}
                </button>
            </div>

            {imageTab === 'url' && (
                <input type="text" placeholder="https://example.com/image.png" value={formData.imageUrl || ''} onChange={(e) => handleInputChange('imageUrl', e.target.value)} className={inputClass} />
            )}

            {imageTab === 'upload' && (
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 dark:file:bg-cyan-400/10 file:text-cyan-700 dark:file:text-cyan-300 hover:file:bg-cyan-100 dark:hover:file:bg-cyan-400/20" />
            )}
            
            {formData.imageUrl && (
                <div className="mt-3 relative">
                    <img src={formData.imageUrl} alt="Preview" className="rounded-lg max-h-48 w-auto object-contain border border-gray-200 dark:border-cyan-400/20" />
                    <button 
                      onClick={() => handleInputChange('imageUrl', '')}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                      aria-label="Remove image"
                    >
                      <Trash2 size={16} />
                    </button>
                </div>
            )}
          </div>
        </main>

        <footer className="sticky bottom-0 bg-white/80 dark:bg-black/30 backdrop-blur-md p-4 flex justify-end items-center gap-3 border-t border-gray-200 dark:border-cyan-400/20 z-10 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-700 transition-colors flex items-center gap-2"
          >
            <Save size={16} /> {t.saveChanges}
          </button>
        </footer>
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