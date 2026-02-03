import React, { useState } from 'react';
import Header from './components/Header';
import Background from './components/Background';
import SelectionPanel from './components/SelectionPanel';
import CompanionCropCard from './components/CompanionCropCard';
import CropInfoPanel from './components/CropInfoPanel';
import BenefitsSection from './components/BenefitsSection';
import InfoPanel from './components/InfoPanel';
import { cropDatabase, mainCrops } from './data/cropDatabase';


function App() {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedSoil, setSelectedSoil] = useState('');
  const [selectedClimate, setSelectedClimate] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleGetSuggestions = () => {
    if (selectedCrop && cropDatabase[selectedCrop]) {
      setSuggestions(cropDatabase[selectedCrop].companions);
      setShowResults(true);
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const selectedCropData = mainCrops.find(c => c.id === selectedCrop);

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-6 relative overflow-x-hidden">
      <Background />
      <div className="max-w-7xl mx-auto relative z-10">
        <Header />
        <SelectionPanel
          selectedCrop={selectedCrop}
          setSelectedCrop={setSelectedCrop}
          selectedSoil={selectedSoil}
          setSelectedSoil={setSelectedSoil}
          selectedClimate={selectedClimate}
          setSelectedClimate={setSelectedClimate}
          onGetSuggestions={handleGetSuggestions}
        />
        {showResults && suggestions.length > 0 && (
          <div id="results-section" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">{selectedCropData?.icon}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Companion Crops for {selectedCropData?.name}</h2>
                <p className="text-gray-600 mt-1">These crops work best when planted alongside {selectedCropData?.name}</p>
              </div>
            </div>

            {/* Validation Alerts */}
            {selectedCrop && cropDatabase[selectedCrop] && (
              <div className="space-y-4 mb-6">
                {/* Soil Validation */}
                {(() => {
                  const bestSoils = cropDatabase[selectedCrop].info.bestSoil.map(s => s.toLowerCase());
                  const isSoilSuitable = bestSoils.some(s => selectedSoil.includes(s) || s.includes(selectedSoil));
                  const soilName = soilTypes.find(s => s.id === selectedSoil)?.name || "Selected Soil";

                  if (selectedSoil && !isSoilSuitable) {
                    return (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              <span className="font-bold">Note on Soil:</span> {selectedCropData?.name} usually prefers {cropDatabase[selectedCrop].info.bestSoil.join(' or ')} soil. You selected {soilName}.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Climate Validation */}
                {(() => {
                  const bestClimates = cropDatabase[selectedCrop].info.bestClimate.map(c => c.toLowerCase());
                  const isClimateSuitable = bestClimates.some(c => selectedClimate.includes(c) || c.includes(selectedClimate));
                  const climateName = climateTypes.find(c => c.id === selectedClimate)?.name || "Selected Climate";

                  if (selectedClimate && !isClimateSuitable) {
                    return (
                      <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-orange-700">
                              <span className="font-bold">Note on Climate:</span> {selectedCropData?.name} thrives in {cropDatabase[selectedCrop].info.bestClimate.join(' or ')} conditions. You selected {climateName}.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}

            <CropInfoPanel cropId={selectedCrop} />
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {suggestions.map((suggestion, index) => <CompanionCropCard key={index} companion={suggestion} />)}
            </div>
            <BenefitsSection />
          </div>
        )}
        {!showResults && <InfoPanel />}
        <div className="text-center text-gray-600 mt-8 pb-4">
          <p className="text-sm">💚 Sustainable farming for a better tomorrow</p>
        </div>
      </div>
    </div>
  );
}

export default App;
