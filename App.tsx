import React, { useState, useMemo, useEffect } from 'react';
import { glossaryData } from './data/glossaryData';
import type { GlossaryTerm } from './types';
import { SearchBar } from './components/SearchBar';
import { CategoryFilters } from './components/CategoryFilters';
import { TermList } from './components/TermList';
import { TermDetailModal } from './components/TermDetailModal';
import { StatsPage } from './pages/StatsPage';
import { Book, BarChart2, List, LayoutGrid, PlusCircle, GraduationCap } from 'lucide-react';
import { TermEditModal } from './components/TermEditModal';
import { TrainingPage } from './pages/TrainingPage';
import { RandomTerm } from './components/RandomTerm';
import { LanguageToggle } from './components/LanguageToggle';
import { useTranslations, Language } from './hooks/useTranslations';

type Page = 'glossary' | 'stats' | 'training';
type ViewMode = 'table' | 'card';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [activePage, setActivePage] = useState<Page>('glossary');
  const [terms, setTerms] = useState<GlossaryTerm[]>(glossaryData);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | null>(null);
  const [language, setLanguage] = useState<Language>('jp');

  const t = useTranslations(language);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    terms.forEach(term => {
      term.categories.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, [terms]);

  const handleAddNewTerm = () => {
    const newId = Math.max(...terms.map(t => t.id), 0) + 1;
    const newTerm: GlossaryTerm = {
        id: newId,
        term: '',
        reading: '',
        alias: '',
        english: '',
        meaning: '',
        categories: [],
        notes: '',
        author: 'User', // Placeholder for new terms
        dateAdded: new Date().toLocaleDateString('en-CA').replace(/-/g, '/'), // YYYY/MM/DD format
        updater: undefined,
        dateUpdated: undefined,
        imageUrl: undefined,
    };
    setEditingTerm(newTerm);
  };

  const handleSaveTerm = (updatedTerm: GlossaryTerm) => {
    const termIndex = terms.findIndex(term => term.id === updatedTerm.id);

    if (termIndex !== -1) {
        // Update existing term
        setTerms(currentTerms => {
            const newTerms = [...currentTerms];
            newTerms[termIndex] = updatedTerm;
            return newTerms;
        });
    } else {
        // Add new term
        setTerms(currentTerms => [...currentTerms, updatedTerm]);
    }
    setEditingTerm(null);
  };
  
  const filteredTerms = useMemo(() => {
    return terms.filter(term => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        term.term.toLowerCase().includes(lowerCaseSearchTerm) ||
        term.reading.toLowerCase().includes(lowerCaseSearchTerm) ||
        term.alias.toLowerCase().includes(lowerCaseSearchTerm) ||
        term.english.toLowerCase().includes(lowerCaseSearchTerm) ||
        term.meaning.toLowerCase().includes(lowerCaseSearchTerm);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.every(cat => term.categories.includes(cat));

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategories, terms]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const handleClearCategories = () => {
    setSelectedCategories([]);
  };

  return (
    <div className="h-screen w-full flex overflow-hidden">
      <aside className="w-72 flex-shrink-0 bg-white dark:bg-black/20 flex flex-col border-r border-gray-200 dark:border-cyan-400/20">
        <div className="h-20 flex-shrink-0 flex items-center justify-center px-4 border-b border-gray-200 dark:border-cyan-400/20">
            <img src="https://www.crascad.co.jp/shared/img/logo.gif" alt="CRASCAD Logo" className="h-12 object-contain" />
        </div>
        
        {activePage === 'glossary' && (
          <>
            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-cyan-400/20">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} t={t} />
            </div>
            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-cyan-400/20">
                <RandomTerm
                    terms={terms}
                    onSelectTerm={setSelectedTerm}
                    language={language}
                    setLanguage={setLanguage}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    activePage={activePage}
                />
            </div>
          </>
        )}

        <div className="flex-grow p-4 flex flex-col gap-6 overflow-y-auto">
            <nav className="space-y-2">
                 <NavItem icon={<Book size={20}/>} label={t.glossary} active={activePage === 'glossary'} onClick={() => setActivePage('glossary')} />
                 <NavItem icon={<BarChart2 size={20}/>} label={t.statistics} active={activePage === 'stats'} onClick={() => setActivePage('stats')} />
                 <NavItem icon={<GraduationCap size={20}/>} label={t.training} active={activePage === 'training'} onClick={() => setActivePage('training')} />
            </nav>
            {activePage === 'glossary' && (
                <div className="flex flex-col gap-4 flex-grow min-h-0">
                    <button
                        onClick={handleAddNewTerm}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-cyan-600 text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-gray-900"
                    >
                        <PlusCircle size={18} />
                        <span>{t.addNewTerm}</span>
                    </button>
                    <CategoryFilters
                        categories={allCategories}
                        selectedCategories={selectedCategories}
                        onSelectCategory={handleSelectCategory}
                        onClear={handleClearCategories}
                        t={t}
                    />
                </div>
            )}
        </div>
      </aside>
      
      <main className="flex-grow p-6 overflow-y-auto flex flex-col">
        {activePage === 'glossary' && (
          <>
            <div className="bg-white dark:bg-black/30 rounded-lg shadow-lg border border-gray-200 dark:border-cyan-400/20 overflow-hidden flex-grow">
              <TermList terms={filteredTerms} onSelectTerm={setSelectedTerm} onOpenEdit={setEditingTerm} viewMode={viewMode} t={t} />
            </div>
          </>
        )}
        {activePage === 'stats' && <StatsPage data={terms} t={t} />}
        {activePage === 'training' && <TrainingPage t={t} />}
      </main>
      
      <TermDetailModal term={selectedTerm} onClose={() => setSelectedTerm(null)} t={t} />
      <TermEditModal term={editingTerm} onClose={() => setEditingTerm(null)} onSave={handleSaveTerm} allCategories={allCategories} t={t} />
    </div>
  );
};

const NavItem: React.FC<{icon: React.ReactNode; label: string; active: boolean; onClick: () => void;}> = ({ icon, label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                active ? 'bg-cyan-400/10 text-cyan-600 dark:text-cyan-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
            <div className={`absolute left-0 top-0 h-full w-1 rounded-r-full transition-all duration-200 ${active ? 'bg-cyan-400' : 'bg-transparent group-hover:bg-cyan-400/50'}`}></div>
            {icon}
            <span>{label}</span>
        </button>
    )
}


export default App;