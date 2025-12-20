import React from 'react';
import { PriceData } from '../types';

interface PriceTableProps {
  data: PriceData[];
}

const PriceTable: React.FC<PriceTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar rounded-xl border border-white/5">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-white/5 sticky top-0 backdrop-blur-md">
          <tr>
            <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Month</th>
            <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Modal (₹)</th>
            <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Min (₹)</th>
            <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Max (₹)</th>
            <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Growth</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-white/5 transition-colors group">
              <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-200 font-medium">{row.month}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-white font-bold">{row.modalPrice.toFixed(2)}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400">{row.minPrice.toFixed(2)}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400">{row.maxPrice.toFixed(2)}</td>
              <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold ${row.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                <div className="flex items-center gap-1">
                  {row.change >= 0 ? '▲' : '▼'}
                  <span>{(row.changePercent * 100).toFixed(1)}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceTable;

