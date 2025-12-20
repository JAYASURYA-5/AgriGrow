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
