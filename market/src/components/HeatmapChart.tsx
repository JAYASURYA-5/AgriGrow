import React from 'react';
import { PriceData } from '../types';

interface HeatmapChartProps {
    data: PriceData[];
    commodityName: string;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ data, commodityName }) => {
    // Find min/max for color scaling
    const prices = data.map(d => d.modalPrice);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;
    const range = maxPrice - minPrice || 1;

    const getColor = (price: number) => {
        const ratio = (price - minPrice) / range;
        const lightness = 20 + (ratio * 40); // 20% to 60%
        return `hsla(199, 89%, ${lightness}%, ${0.3 + ratio * 0.7})`;
    };

    return (
        <div className="relative h-full flex flex-col w-full">
            <div className="mb-6">
                <h3 className="text-xl font-bold premium-gradient-text">
                    {commodityName} Market Heatmap
                </h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Price Intensity Analysis</p>
            </div>

            <div className="flex-1 flex flex-wrap gap-3 content-start overflow-y-auto custom-scrollbar pr-2">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="group relative flex flex-col items-center justify-center w-[calc(25%-12px)] min-w-[80px] aspect-square rounded-2xl border border-white/5 transition-all duration-500 hover:scale-105 hover:z-20"
                        style={{ backgroundColor: getColor(item.modalPrice) }}
                    >
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{item.month}</span>
                        <span className="text-sm font-black text-white">₹{Math.round(item.modalPrice)}</span>

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block z-30 bg-slate-900 border border-white/10 p-2 rounded-xl text-[10px] shadow-2xl backdrop-blur-md w-32">
                            <div className="flex justify-between text-slate-400"><span>Min:</span> <span className="text-white">₹{item.minPrice}</span></div>
                            <div className="flex justify-between text-slate-400"><span>Max:</span> <span className="text-white">₹{item.maxPrice}</span></div>
                            <div className={`mt-1 font-bold ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {item.change >= 0 ? '+' : ''}{item.change.toFixed(0)} ({(item.changePercent * 100).toFixed(1)}%)
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
                <span>Lower Prices</span>
                <div className="flex-1 mx-4 h-1.5 rounded-full bg-gradient-to-r from-sky-900/40 via-sky-600/60 to-sky-400 opacity-50" />
                <span>Higher Prices</span>
            </div>
        </div>
    );
};

export default HeatmapChart;
