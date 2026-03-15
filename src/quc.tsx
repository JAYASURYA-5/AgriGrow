import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock types and data (fallback if imports fail)
interface PricePoint {
  month: string;
  modalPrice: number;
}

interface CommodityData {
  commodity: string;
  priceData: PricePoint[];
}

interface FilterState {
  category: string;
  commodity: string;
  state: string;
  districts: string;
  startDate: string;
  toDate: string;
  calculationType: string;
}

// Mock data for display
const mockWheatData: CommodityData = {
  commodity: 'Wheat',
  priceData: [
    { month: '12/2024', modalPrice: 2100 },
    { month: '01/2025', modalPrice: 2150 },
    { month: '02/2025', modalPrice: 2180 },
    { month: '03/2025', modalPrice: 2200 },
    { month: '04/2025', modalPrice: 2250 },
    { month: '05/2025', modalPrice: 2300 },
    { month: '06/2025', modalPrice: 2280 },
    { month: '07/2025', modalPrice: 2220 },
    { month: '08/2025', modalPrice: 2180 },
    { month: '09/2025', modalPrice: 2150 },
    { month: '10/2025', modalPrice: 2120 },
  ],
};

const mockJasmineData: CommodityData = {
  commodity: 'Jasmine',
  priceData: [
    { month: '12/2024', modalPrice: 8500 },
    { month: '01/2025', modalPrice: 8600 },
    { month: '02/2025', modalPrice: 8700 },
    { month: '03/2025', modalPrice: 8800 },
    { month: '04/2025', modalPrice: 8900 },
    { month: '05/2025', modalPrice: 9000 },
    { month: '06/2025', modalPrice: 8950 },
    { month: '07/2025', modalPrice: 8850 },
    { month: '08/2025', modalPrice: 8750 },
    { month: '09/2025', modalPrice: 8650 },
    { month: '10/2025', modalPrice: 8550 },
  ],
};

const mockTomatoData: CommodityData = {
  commodity: 'Tomato',
  priceData: [
    { month: '12/2024', modalPrice: 1200 },
    { month: '01/2025', modalPrice: 1350 },
    { month: '02/2025', modalPrice: 1500 },
    { month: '03/2025', modalPrice: 1450 },
    { month: '04/2025', modalPrice: 1300 },
    { month: '05/2025', modalPrice: 1100 },
    { month: '06/2025', modalPrice: 900 },
    { month: '07/2025', modalPrice: 1000 },
    { month: '08/2025', modalPrice: 1150 },
    { month: '09/2025', modalPrice: 1300 },
    { month: '10/2025', modalPrice: 1350 },
  ],
};

const mockPotatoData: CommodityData = {
  commodity: 'Potato',
  priceData: [
    { month: '12/2024', modalPrice: 800 },
    { month: '01/2025', modalPrice: 850 },
    { month: '02/2025', modalPrice: 900 },
    { month: '03/2025', modalPrice: 950 },
    { month: '04/2025', modalPrice: 1000 },
    { month: '05/2025', modalPrice: 1050 },
    { month: '06/2025', modalPrice: 1000 },
    { month: '07/2025', modalPrice: 900 },
    { month: '08/2025', modalPrice: 850 },
    { month: '09/2025', modalPrice: 800 },
    { month: '10/2025', modalPrice: 750 },
  ],
};

const categories = ['Cereals', 'Spices', 'Vegetables'];
const commodities = ['Wheat', 'Jasmine', 'Tomato', 'Potato'];
const states = ['All India', 'Punjab', 'Haryana', 'Uttar Pradesh'];
const districts = ['All districts', 'District 1', 'District 2'];
const calculationTypes = ['Monthly', 'Weekly', 'Daily'];

function QucDashboard() {
  const [filters, setFilters] = useState<FilterState>({
    category: 'Cereals',
    commodity: 'Wheat',
    state: 'All India',
    districts: 'All districts',
    startDate: '2024-12-01',
    toDate: '2025-10-01',
    calculationType: 'Monthly',
  });

  const [currentData, setCurrentData] = useState<CommodityData>(mockWheatData);

  useEffect(() => {
    let baseData: CommodityData;
    if (filters.commodity === 'Wheat') baseData = mockWheatData;
    else if (filters.commodity === 'Jasmine') baseData = mockJasmineData;
    else if (filters.commodity === 'Tomato') baseData = mockTomatoData;
    else if (filters.commodity === 'Potato') baseData = mockPotatoData;
    else baseData = mockWheatData;

    if (filters.calculationType === 'Weekly') {
      const weeklyData = baseData.priceData.flatMap(item => {
        const [month, year] = item.month.split('/');
        return [
          { ...item, month: `W1 ${month}/${year}`, modalPrice: item.modalPrice * (1 + (Math.random() * 0.02 - 0.01)) },
          { ...item, month: `W2 ${month}/${year}`, modalPrice: item.modalPrice * (1 + (Math.random() * 0.02 - 0.01)) },
          { ...item, month: `W3 ${month}/${year}`, modalPrice: item.modalPrice * (1 + (Math.random() * 0.02 - 0.01)) },
          { ...item, month: `W4 ${month}/${year}`, modalPrice: item.modalPrice * (1 + (Math.random() * 0.02 - 0.01)) },
        ];
      }).slice(0, 16);
      setCurrentData({ ...baseData, priceData: weeklyData });
    } else if (filters.calculationType === 'Daily') {
      const dailyData = baseData.priceData.slice(0, 2).flatMap(item => {
        const [month, year] = item.month.split('/');
        return Array.from({ length: 7 }, (_, i) => ({
          ...item,
          month: `${i + 1}/${month}/${year.slice(-2)}`,
          modalPrice: item.modalPrice * (1 + (Math.random() * 0.04 - 0.02))
        }));
      });
      setCurrentData({ ...baseData, priceData: dailyData });
    } else {
      setCurrentData(baseData);
    }
  }, [filters.commodity, filters.calculationType]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const avgPrice = currentData.priceData.length > 0
    ? (currentData.priceData.reduce((sum, p) => sum + p.modalPrice, 0) / currentData.priceData.length).toFixed(0)
    : '0';

  const maxPrice = currentData.priceData.length > 0
    ? Math.max(...currentData.priceData.map(p => p.modalPrice)).toFixed(0)
    : '0';

  const minPrice = currentData.priceData.length > 0
    ? Math.min(...currentData.priceData.map(p => p.modalPrice)).toFixed(0)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Agricultural Market Dashboard</h1>
        <p className="text-emerald-400 text-lg">Real-time Commodity Price Analysis</p>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 mb-8 shadow-lg">
        <h2 className="text-white text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 hover:border-emerald-400 transition"
            >
              {categories.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Commodity</label>
            <select
              value={filters.commodity}
              onChange={(e) => handleFilterChange('commodity', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 hover:border-emerald-400 transition"
            >
              {commodities.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">State</label>
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 hover:border-emerald-400 transition"
            >
              {states.map(s => <option key={s} value={s} className="text-black">{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Calculation Type</label>
            <select
              value={filters.calculationType}
              onChange={(e) => handleFilterChange('calculationType', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 hover:border-emerald-400 transition"
            >
              {calculationTypes.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/10 border border-emerald-500/30 rounded-lg p-4 shadow-lg">
          <p className="text-emerald-300 text-sm font-medium">Average Price</p>
          <p className="text-white text-3xl font-bold mt-1">₹{avgPrice}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-500/30 rounded-lg p-4 shadow-lg">
          <p className="text-blue-300 text-sm font-medium">Maximum Price</p>
          <p className="text-white text-3xl font-bold mt-1">₹{maxPrice}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-600/20 to-orange-700/10 border border-orange-500/30 rounded-lg p-4 shadow-lg">
          <p className="text-orange-300 text-sm font-medium">Minimum Price</p>
          <p className="text-white text-3xl font-bold mt-1">₹{minPrice}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 shadow-lg">
          <h2 className="text-white text-xl font-semibold mb-4">Price Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData.priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: any) => [`₹${value.toFixed(0)}`, 'Price']}
              />
              <Legend wrapperStyle={{ color: '#D1D5DB' }} />
              <Line
                type="monotone"
                dataKey="modalPrice"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 5 }}
                activeDot={{ r: 7 }}
                name="Modal Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 shadow-lg">
          <h2 className="text-white text-xl font-semibold mb-4">Price Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData.priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: any) => [`₹${value.toFixed(0)}`, 'Price']}
              />
              <Legend wrapperStyle={{ color: '#D1D5DB' }} />
              <Bar dataKey="modalPrice" fill="#3B82F6" name="Modal Price" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 shadow-lg">
        <h2 className="text-white text-xl font-semibold mb-4">Market Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Selected Commodity</p>
            <p className="text-white text-lg font-semibold">{currentData.commodity}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Data Points</p>
            <p className="text-white text-lg font-semibold">{currentData.priceData.length}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Calculation Type</p>
            <p className="text-white text-lg font-semibold">{filters.calculationType}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QucDashboard;

