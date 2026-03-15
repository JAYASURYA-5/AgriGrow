import React from 'react';
import { MapPin, Wind, Sun, Book } from 'lucide-react';
import CropCard from './CropCard';
import { mainCrops, soilTypes, climateTypes } from '../data/cropDatabase';

const SelectionPanel = ({
  selectedCrop,
  setSelectedCrop,
  selectedSoil,
  setSelectedSoil,
  selectedClimate,
  setSelectedClimate,
  onGetSuggestions
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-10 mb-10 border border-white/50 transform transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-green-600" />
        Select Your Farming Details
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Main Crop *</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {mainCrops.map(crop => (
            <CropCard key={crop.id} crop={crop} isSelected={selectedCrop === crop.id} onClick={() => setSelectedCrop(crop.id)} />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Wind className="w-4 h-4" />Soil Type
          </label>
          <select value={selectedSoil} onChange={(e) => setSelectedSoil(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-900">
            <option value="">Select soil type</option>
            {soilTypes.map(soil => <option key={soil.id} value={soil.id}>{soil.name} - {soil.description}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Sun className="w-4 h-4" />Climate Zone
          </label>
          <select value={selectedClimate} onChange={(e) => setSelectedClimate(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-900">
            <option value="">Select climate</option>
            {climateTypes.map(climate => <option key={climate.id} value={climate.id}>{climate.name} ({climate.temp})</option>)}
          </select>
        </div>
      </div>

      <button onClick={onGetSuggestions} disabled={!selectedCrop} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        <Book className="w-5 h-5" />Get Intercropping Suggestions
      </button>
    </div>
  );
};

export default SelectionPanel;
