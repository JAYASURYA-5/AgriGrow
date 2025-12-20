import React, { useState } from 'react';
import { CommodityData } from '../types';
import PriceTable from './PriceTable';

interface LeftPanelProps {
  data: CommodityData;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'prices' | 'quantity'>('prices');

  const handleDownload = () => {
    const csvContent = [
      ['Month', 'Modal Price (₹)', 'Min Price (₹)', 'Max Price (₹)', 'Change (₹)', 'Change (%)'],
      ...data.priceData.map((row) => [
        row.month,
        row.modalPrice.toFixed(2),
        row.minPrice.toFixed(2),
        row.maxPrice.toFixed(2),
        row.change.toFixed(2),
        (row.changePercent * 100).toFixed(2),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name}_price_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold premium-gradient-text mb-4">{data.name}</h2>
        <div className="mb-6 space-y-1">
          <p className="text-sm text-slate-400 font-medium">Current Modal Price</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">₹ {data.currentPrice.toFixed(2)}</span>
            <span className="text-slate-400 text-lg">/quintal</span>
          </div>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider italic">Updated: {data.currentMonth}</p>
        </div>

        <div className={`inline-flex items-center px-4 py-2 rounded-xl backdrop-blur-md border ${data.priceChange >= 0
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
          <span className="text-lg font-semibold flex items-center gap-1">
            {data.priceChange >= 0 ? '↗' : '↘'}
            ₹ {Math.abs(data.priceChange).toFixed(2)}
            <span className="text-sm opacity-80 ml-1">
              ({data.priceChangePercent >= 0 ? '+' : ''}{(data.priceChangePercent * 100).toFixed(2)}%)
            </span>
          </span>
          <span className="text-xs ml-3 text-slate-400">vs Prev Month</span>
        </div>
      </div>

      <div className="mb-6 p-1 bg-white/5 rounded-2xl flex gap-1">
        <button
          onClick={() => setActiveTab('prices')}
          className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${activeTab === 'prices'
              ? 'bg-sky-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
        >
          Detailed Prices
        </button>
        <button
          onClick={() => setActiveTab('quantity')}
          className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${activeTab === 'quantity'
              ? 'bg-sky-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
        >
          Arrival Qty
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 custom-scrollbar">
        {activeTab === 'prices' ? (
          <PriceTable data={data.priceData} />
        ) : (
          <div className="text-center text-slate-500 py-12 glass-card bg-white/5 italic">
            Arrival volume analytics coming soon...
          </div>
        )}
      </div>

      <button
        onClick={handleDownload}
        className="glass-btn w-full py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 group"
      >
        <svg className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download CSV Report
      </button>
    </div>
  );
};

export default LeftPanel;

