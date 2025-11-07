import React, { useMemo } from 'react';
import type { GlossaryTerm } from '../types';
import { Package, Tag, Users } from 'lucide-react';
import type { Translations } from '../hooks/useTranslations';

interface StatCardsProps {
  data: GlossaryTerm[];
  t: Translations;
}

export const StatCards: React.FC<StatCardsProps> = ({ data, t }) => {
    const stats = useMemo(() => {
        const authorSet = new Set<string>();
        const allCategories = new Set<string>();

        data.forEach(term => {
            if (term.author?.trim()) {
                authorSet.add(term.author.trim());
            }
            term.categories.forEach(cat => allCategories.add(cat));
        });

        return [
            {
                icon: <Package size={20} className="text-cyan-600 dark:text-cyan-300" />,
                label: t.totalTerms,
                value: data.length,
            },
            {
                icon: <Tag size={20} className="text-green-600 dark:text-green-300" />,
                label: t.uniqueCategories,
                value: allCategories.size,
            },
            {
                icon: <Users size={20} className="text-purple-600 dark:text-purple-300" />,
                label: t.contributors,
                value: authorSet.size,
            }
        ];
    }, [data, t]);

    return (
        <div className="bg-white dark:bg-black/30 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-cyan-400/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.summaryStatistics}</h3>
            <table className="w-full text-left">
                <tbody>
                    {stats.map((stat) => (
                        <tr key={stat.label} className="border-b border-gray-100 dark:border-cyan-400/10 last:border-b-0">
                            <td className="py-3 pr-3 flex items-center gap-3">
                                {stat.icon}
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{stat.label}</span>
                            </td>
                            <td className="py-3 pl-3 text-xl font-bold text-gray-900 dark:text-white text-right">
                                {stat.value}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};