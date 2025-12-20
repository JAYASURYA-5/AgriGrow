import React from 'react';
import { cropDatabase } from '../data/cropDatabase';

const CropInfoPanel = ({ cropId }) => {
  const cropInfo = cropDatabase[cropId]?.info;
  if (!cropInfo) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Crop Information</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm font-semibold text-gray-600 mb-1">Best Soil Types</div>
          <div className="flex flex-wrap gap-1">
            {cropInfo.bestSoil.map((soil, i) => (
              <span key={i} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">{soil}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-600 mb-1">Best Climate</div>
          <div className="flex flex-wrap gap-1">
            {cropInfo.bestClimate.map((climate, i) => (
              <span key={i} className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded text-xs">{climate}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-600 mb-1">Growth Duration</div>
          <div className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs inline-block">{cropInfo.growthDuration}</div>
        </div>
      </div>
    </div>
  );
};

export default CropInfoPanel;
