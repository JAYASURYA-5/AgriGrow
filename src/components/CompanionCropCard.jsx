import React from 'react';
import { Leaf, Info, TrendingUp, CheckCircle } from 'lucide-react';

const CompanionCropCard = ({ companion }) => {
  return (
    <div className="border-2 border-white/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-md transform hover:-translate-y-2 group">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-600 text-white p-3 rounded-lg">
          <Leaf className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{companion.name}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
          <p className="text-sm text-gray-600">{companion.benefit}</p>
        </div>

        <div className="flex items-center gap-2 bg-green-100 p-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-green-700">Yield Increase: {companion.yield}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mt-4">
          <div className="bg-blue-50 p-2 rounded">
            <div className="font-semibold text-blue-700">Spacing</div>
            <div className="text-gray-600">{companion.spacing}</div>
          </div>
          <div className="bg-amber-50 p-2 rounded">
            <div className="font-semibold text-amber-700">Season</div>
            <div className="text-gray-600">{companion.season}</div>
          </div>
          <div className="bg-cyan-50 p-2 rounded">
            <div className="font-semibold text-cyan-700">Water Need</div>
            <div className="text-gray-600">{companion.water}</div>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <div className="font-semibold text-purple-700">Nutrients</div>
            <div className="text-gray-600 text-xs">{companion.nutrients}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />Select This Companion
        </button>
      </div>
    </div>
  );
};

export default CompanionCropCard;
