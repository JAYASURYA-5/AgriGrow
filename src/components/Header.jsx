import React from 'react';
import { Leaf, TrendingUp, Droplet } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-green-600/90 to-emerald-700/90 text-white rounded-3xl shadow-2xl p-10 mb-10 backdrop-blur-xl border border-white/20 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-green-500/20 group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-white p-3 rounded-xl">
          <Leaf className="w-10 h-10 text-green-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Intercropping Advisor</h1>
          <p className="text-green-100 mt-1">Smart companion planting for maximum yield</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-6">
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm">Increase Yield</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
          <Droplet className="w-5 h-5" />
          <span className="text-sm">Save Water</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
          <Leaf className="w-5 h-5" />
          <span className="text-sm">Improve Soil</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
