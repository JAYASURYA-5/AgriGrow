import React from 'react';
import { Book, CheckCircle } from 'lucide-react';

const InfoPanel = () => {
  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-10 mb-10 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Book className="w-8 h-8 text-green-600" />
        <h3 className="text-2xl font-bold text-gray-800">Why Intercropping?</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span>Increases overall farm productivity and income by 15-30%</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span>Reduces pest and disease pressure naturally without chemicals</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span>Improves soil fertility through nitrogen fixation by legumes</span>
          </li>
        </ul>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span>Better land and resource utilization throughout the season</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span>Provides risk diversification for farmers against crop failure</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <span>Reduces dependency on external inputs and increases sustainability</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InfoPanel;
