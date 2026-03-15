import React from 'react';
import { FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  categories: string[];
  commodities: string[];
  states: string[];
  districts: string[];
  calculationTypes: string[];
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  categories,
  commodities,
  states,
  districts,
  calculationTypes,
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
        {[
          { label: 'Category', key: 'category', options: categories },
          { label: 'Commodity', key: 'commodity', options: commodities },
          { label: 'State', key: 'state', options: states },
          { label: 'Districts', key: 'districts', options: districts },
          { label: 'Calculation', key: 'calculationType', options: calculationTypes },
        ].map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">{field.label}</label>
            <div className="relative group">
              <select
                value={filters[field.key as keyof FilterState]}
                onChange={(e) => onFilterChange(field.key as keyof FilterState, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-white appearance-none focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all cursor-pointer group-hover:border-white/20"
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1e293b] text-white">{opt}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">From</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all [color-scheme:dark]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">To</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => onFilterChange('toDate', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all [color-scheme:dark]"
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;

