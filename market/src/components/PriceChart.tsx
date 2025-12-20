import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PriceData } from '../types';

interface PriceChartProps {
  data: PriceData[];
  commodityName: string;
  location: string;
  calculationType: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, commodityName, location, calculationType }) => {
  const [visibleLines, setVisibleLines] = useState({
    modal: true,
    min: true,
    max: true,
  });

  const chartData = useMemo(() => {
    return data.map((item) => ({
      month: item.month,
      'Modal Price': item.modalPrice,
      'Min Price': item.minPrice,
      'Max Price': item.maxPrice,
    }));
  }, [data]);

  const toggleLine = (line: 'modal' | 'min' | 'max') => {
    setVisibleLines((prev) => ({ ...prev, [line]: !prev[line] }));
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold premium-gradient-text">
            {commodityName} Trends
          </h3>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">
            {location} • {calculationType} Analysis
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'modal', label: 'Modal', color: '#ef4444', active: visibleLines.modal },
            { id: 'min', label: 'Min', color: '#3b82f6', active: visibleLines.min },
            { id: 'max', label: 'Max', color: '#10b981', active: visibleLines.max },
          ].map((line) => (
            <button
              key={line.id}
              onClick={() => toggleLine(line.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${line.active
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-transparent border-white/5 text-slate-500'
                }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: line.color, boxShadow: line.active ? `0 0 10px ${line.color}` : 'none' }}></span>
              <span className="text-xs font-bold uppercase tracking-wider">{line.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={10}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `₹${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                padding: '12px',
              }}
              labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Line
              type="monotone"
              dataKey="Modal Price"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
              hide={!visibleLines.modal}
            />
            <Line
              type="monotone"
              dataKey="Min Price"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }}
              hide={!visibleLines.min}
            />
            <Line
              type="monotone"
              dataKey="Max Price"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#10b981' }}
              hide={!visibleLines.max}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
