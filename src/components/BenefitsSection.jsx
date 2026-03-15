import React from 'react';
import { Droplet, Calendar, Leaf } from 'lucide-react';

const BenefitsSection = () => {
  return (
    <div className="mt-8 grid md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-gray-800">Water Efficiency</h4>
        </div>
        <p className="text-sm text-gray-600">Better moisture retention and reduced irrigation needs through complementary root systems</p>
      </div>
      
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-amber-600 p-2 rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-gray-800">Extended Season</h4>
        </div>
        <p className="text-sm text-gray-600">Multiple harvests throughout the growing season with staggered planting schedules</p>
      </div>
      
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-purple-600 p-2 rounded-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-gray-800">Soil Health</h4>
        </div>
        <p className="text-sm text-gray-600">Improved soil structure and nutrient balance through diverse root systems</p>
      </div>
    </div>
  );
};

export default BenefitsSection;
