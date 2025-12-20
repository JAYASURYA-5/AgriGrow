import React, { useState } from 'react';
import { CommodityData } from '../types';
import PriceChart from './PriceChart';
import PriceBarChart from './PriceBarChart';
import HeatmapChart from './HeatmapChart';

interface RightPanelProps {
  data: CommodityData;
  location: string;
  calculationType: string;
}

const RightPanel: React.FC<RightPanelProps> = ({ data, location, calculationType }) => {
  const [dataTypeTab, setDataTypeTab] = useState<'price' | 'quantity'>('price');
  const [chartTypeTab, setChartTypeTab] = useState<'timeseries' | 'heatmap' | 'barchart'>('timeseries');

  const renderChart = () => {
    if (dataTypeTab === 'quantity') {
      return (
        <div className="text-center text-slate-500 italic">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Arrivals data is being integrated...
        </div>
      );
    }

    switch (chartTypeTab) {
      case 'timeseries':
        return <PriceChart data={data.priceData} commodityName={data.name} location={location} calculationType={calculationType} />;
      case 'barchart':
        return <PriceBarChart data={data.priceData} commodityName={data.name} />;
      case 'heatmap':
        return <HeatmapChart data={data.priceData} commodityName={data.name} />;
      default:
        return null;
    }
  };

  const handleDownloadChart = () => {
    alert('Chart download functionality would be implemented here');
  };

  const handleShareChart = () => {
    alert('Share chart functionality would be implemented here');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex p-1 bg-white/5 rounded-2xl gap-1">
          <button
            onClick={() => setDataTypeTab('price')}
            className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${dataTypeTab === 'price'
              ? 'bg-sky-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            Price
          </button>
          <button
            onClick={() => setDataTypeTab('quantity')}
            className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${dataTypeTab === 'quantity'
              ? 'bg-sky-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            Arrivals
          </button>
        </div>
        <button className="glass-btn px-6 py-2 rounded-xl text-sm font-bold text-sky-400 border-sky-400/30 hover:bg-sky-400/10 transition-all">
          + Compare Market
        </button>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {['timeseries', 'heatmap', 'barchart'].map((type) => (
          <button
            key={type}
            onClick={() => setChartTypeTab(type as any)}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all border ${chartTypeTab === type
              ? 'bg-white/10 border-white/20 text-white'
              : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex-1 mb-8 glass-card bg-white/5 p-4 rounded-3xl min-h-[400px] flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          {renderChart()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleDownloadChart}
          className="glass-btn py-3 px-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 text-slate-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export PNG
        </button>
        <button
          onClick={handleShareChart}
          className="glass-btn py-3 px-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 text-slate-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
};

export default RightPanel;

