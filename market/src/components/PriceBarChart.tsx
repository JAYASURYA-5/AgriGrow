import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PriceData } from '../types';

interface PriceBarChartProps {
    data: PriceData[];
    commodityName: string;
}

const PriceBarChart: React.FC<PriceBarChartProps> = ({ data, commodityName }) => {
    return (
        <div className="relative h-full flex flex-col w-full">
            <div className="mb-6">
                <h3 className="text-xl font-bold premium-gradient-text">
                    {commodityName} Price Distribution
                </h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Monthly Modal Price Comparison</p>
            </div>

            <div className="flex-1 min-h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
                        <Bar dataKey="modalPrice" radius={[6, 6, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.change >= 0 ? '#10b981' : '#ef4444'}
                                    fillOpacity={0.8}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PriceBarChart;
