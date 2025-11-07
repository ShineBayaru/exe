import React from 'react';
import type { GlossaryTerm } from '../types';
import { StatCards } from '../components/StatCards';
import { 
    TermDistributionChart, 
    ContributionTimelineChart, 
    TopContributorsChart,
    UpdateVsAddChart,
    TopUpdatersChart,
    ContributionActivityHeatmap
} from '../components/Dashboard';
import type { Translations } from '../hooks/useTranslations';

interface StatsPageProps {
  data: GlossaryTerm[];
  t: Translations;
}

export const StatsPage: React.FC<StatsPageProps> = ({ data, t }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">{t.glossaryDashboard}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t.dashboardSubtitle}</p>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <StatCards data={data} t={t} />
        </div>
        <div className="lg:col-span-2">
            <UpdateVsAddChart data={data} t={t} />
        </div>
        <div className="lg:col-span-4">
            <ContributionActivityHeatmap data={data} t={t} />
        </div>
        <div className="lg:col-span-2">
          <TermDistributionChart data={data} t={t} />
        </div>
         <div className="lg:col-span-2">
          <ContributionTimelineChart data={data} t={t} />
        </div>
        <div className="lg:col-span-2">
          <TopContributorsChart data={data} t={t} />
        </div>
        <div className="lg:col-span-2">
          <TopUpdatersChart data={data} t={t} />
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};