import React, { useMemo } from 'react';
import type { GlossaryTerm } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import type { Translations } from '../hooks/useTranslations';

const getAxisColor = (isDark: boolean) => isDark ? '#A0AEC0' : '#4A5568';
const getGridColor = (isDark: boolean) => isDark ? 'rgba(0, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
const getBarColor = (isDark: boolean) => isDark ? '#22D3EE' : '#06B6D4';
const getTooltipStyle = (isDark: boolean) => isDark ? {
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
    backdropFilter: 'blur(5px)',
    borderColor: 'rgba(0, 255, 255, 0.2)',
    color: '#E2E8F0'
  } : {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(5px)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    color: '#1F2937'
  };


interface ChartProps {
  data: GlossaryTerm[];
  t: Translations;
}

export const TermDistributionChart: React.FC<ChartProps> = ({ data, t }) => {
  const categoryCounts = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};

    data.forEach(term => {
      term.categories.forEach(cat => {
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });
    });

    return Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const isDark = false;

  return (
    <div className="bg-white dark:bg-black/30 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-cyan-400/20">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.termDistribution}</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={categoryCounts} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={getGridColor(isDark)} />
                    <XAxis dataKey="name" stroke={getAxisColor(isDark)} fontSize={12} tickLine={false} axisLine={false} interval={0} angle={-35} textAnchor="end" height={80} />
                    <YAxis stroke={getAxisColor(isDark)} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                        contentStyle={getTooltipStyle(isDark)}
                        cursor={{ fill: isDark ? 'rgba(0, 255, 255, 0.1)' : 'rgba(0, 182, 212, 0.1)' }}
                    />
                    <Bar dataKey="count" name={t.terms} fill={getBarColor(isDark)} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};


export const ContributionTimelineChart: React.FC<ChartProps> = ({ data, t }) => {
  const contributionData = useMemo(() => {
    const yearCounts: { [key: string]: number } = {};
    data.forEach(term => {
      const year = new Date(term.dateAdded).getFullYear();
      if (!isNaN(year)) {
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }
    });

    return Object.entries(yearCounts)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [data]);

  const isDark = false;
  const lineColor = getBarColor(isDark);

  return (
    <div className="bg-white dark:bg-black/30 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-cyan-400/20">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.contributionTimeline}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={contributionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={getGridColor(isDark)} />
            <XAxis dataKey="year" stroke={getAxisColor(isDark)} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={getAxisColor(isDark)} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={getTooltipStyle(isDark)}
              cursor={{ stroke: isDark ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 182, 212, 0.3)', strokeWidth: 1 }}
            />
            <Legend wrapperStyle={{fontSize: "14px"}}/>
            <Line type="monotone" dataKey="count" name={t.termsAdded} stroke={lineColor} strokeWidth={2} dot={{ r: 4, fill: lineColor }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const TopContributorsChart: React.FC<ChartProps> = ({ data, t }) => {
  const contributorData = useMemo(() => {
    const authorCounts: { [key: string]: number } = {};
    data.forEach(term => {
      const author = term.author?.trim();
      if (author) {
        authorCounts[author] = (authorCounts[author] || 0) + 1;
      }
    });

    return Object.entries(authorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7) // Top 7
      .reverse(); // For horizontal bar chart, reverse to show top at top
  }, [data]);

  const isDark = false;

  return (
    <div className="bg-white dark:bg-black/30 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-cyan-400/20">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.topContributors}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={contributorData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={getGridColor(isDark)} horizontal={false} />
            <XAxis type="number" stroke={getAxisColor(isDark)} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis 
                dataKey="name" 
                type="category" 
                stroke={getAxisColor(isDark)} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                width={60}
                tick={{textAnchor: 'end'}}
            />
            <Tooltip
              contentStyle={getTooltipStyle(isDark)}
              cursor={{ fill: isDark ? 'rgba(0, 255, 255, 0.1)' : 'rgba(0, 182, 212, 0.1)' }}
            />
            <Bar dataKey="count" name={t.contributions} fill={getBarColor(isDark)} radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const UpdateVsAddChart: React.FC<ChartProps> = ({ data, t }) => {
  const chartData = useMemo(() => {
    const newTerms = data.filter(term => !term.updater || !term.dateUpdated).length;
    const updatedTerms = data.length - newTerms;
    return [
      { name: t.newTerms, value: newTerms },
      { name: t.updatedTerms, value: updatedTerms },
    ];
  }, [data, t]);

  const isDark = false;
  const COLORS = [isDark ? '#22D3EE' : '#06B6D4', isDark ? '#67E8F9' : '#0891B2'];

  return (
    <div className="bg-white dark:bg-black/30 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-cyan-400/20 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.newVsUpdated}</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={getTooltipStyle(isDark)} />
            <Legend iconSize={12} wrapperStyle={{ fontSize: "14px", color: getAxisColor(isDark) }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const TopUpdatersChart: React.FC<ChartProps> = ({ data, t }) => {
  const updaterData = useMemo(() => {
    const updaterCounts: { [key: string]: number } = {};
    data.forEach(term => {
      const updater = term.updater?.trim();
      if (updater) {
        updaterCounts[updater] = (updaterCounts[updater] || 0) + 1;
      }
    });

    return Object.entries(updaterCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7) // Top 7
      .reverse(); // For horizontal bar chart
  }, [data]);

  const isDark = false;

  return (
    <div className="bg-white dark:bg-black/30 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-cyan-400/20">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.topUpdaters}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={updaterData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={getGridColor(isDark)} horizontal={false} />
            <XAxis type="number" stroke={getAxisColor(isDark)} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis 
                dataKey="name" 
                type="category" 
                stroke={getAxisColor(isDark)} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                width={60}
                tick={{textAnchor: 'end'}}
            />
            <Tooltip
              contentStyle={getTooltipStyle(isDark)}
              cursor={{ fill: isDark ? 'rgba(0, 255, 255, 0.1)' : 'rgba(0, 182, 212, 0.1)' }}
            />
            <Bar dataKey="count" name={t.updates} fill={getBarColor(isDark)} radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ContributionActivityHeatmap: React.FC<ChartProps> = ({ data, t }) => {
    const isDark = false;
    
    const activityData = useMemo(() => {
        const today = new Date();
        const oneYearAgo = new Date(new Date().setDate(today.getDate() - 365));
        const counts: Map<string, number> = new Map();

        data.forEach(term => {
            if (term.dateAdded) {
                const addedDate = new Date(term.dateAdded);
                if (!isNaN(addedDate.getTime()) && addedDate >= oneYearAgo) {
                    const dateStr = addedDate.toISOString().split('T')[0];
                    counts.set(dateStr, (counts.get(dateStr) || 0) + 1);
                }
            }
            if (term.dateUpdated) {
                const updatedDate = new Date(term.dateUpdated);
                if (!isNaN(updatedDate.getTime()) && updatedDate >= oneYearAgo) {
                    const dateStr = updatedDate.toISOString().split('T')[0];
                    counts.set(dateStr, (counts.get(dateStr) || 0) + 1);
                }
            }
        });
        return counts;
    }, [data]);

    const getColor = (count: number) => {
        if (count === 0) return isDark ? 'bg-gray-800' : 'bg-gray-100';
        if (count <= 1) return isDark ? 'bg-cyan-900' : 'bg-cyan-200';
        if (count <= 3) return isDark ? 'bg-cyan-700' : 'bg-cyan-400';
        if (count <= 5) return isDark ? 'bg-cyan-500' : 'bg-cyan-600';
        return isDark ? 'bg-cyan-300' : 'bg-cyan-800';
    };

    const days = useMemo(() => {
      const today = new Date();
      const startDate = new Date(new Date().setDate(today.getDate() - 365));
      const startDay = startDate.getDay();
      const dayCells: React.ReactNode[] = [];
      
      for (let i = 0; i < startDay; i++) {
          dayCells.push(<div key={`empty-${i}`} className="w-4 h-4 rounded-sm" />);
      }

      for (let i = 0; i <= 365; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          const dateStr = currentDate.toISOString().split('T')[0];
          const count = activityData.get(dateStr) || 0;
          dayCells.push(
              <div 
                  key={dateStr}
                  className={`w-4 h-4 rounded-sm ${getColor(count)}`}
                  title={`${dateStr}: ${count} ${t.contributions}`}
              />
          );
      }
      return dayCells;
    }, [activityData, isDark, t.contributions]);

    return (
        <div className="bg-white dark:bg-black/30 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-cyan-400/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.contributionActivity}</h3>
            <div className="flex flex-col gap-2 items-center">
                <div className="grid grid-flow-col grid-rows-7 gap-1">
                    {days}
                </div>
                <div className="flex justify-end items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>{t.less}</span>
                    <div className={`w-3 h-3 rounded-sm ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
                    <div className={`w-3 h-3 rounded-sm ${isDark ? 'bg-cyan-900' : 'bg-cyan-200'}`}></div>
                    <div className={`w-3 h-3 rounded-sm ${isDark ? 'bg-cyan-700' : 'bg-cyan-400'}`}></div>
                    <div className={`w-3 h-3 rounded-sm ${isDark ? 'bg-cyan-500' : 'bg-cyan-600'}`}></div>
                    <div className={`w-3 h-3 rounded-sm ${isDark ? 'bg-cyan-300' : 'bg-cyan-800'}`}></div>
                    <span>{t.more}</span>
                </div>
            </div>
        </div>
    );
};