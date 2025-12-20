import React from 'react';

const CropCard = ({ crop, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-2 ${isSelected
          ? 'border-green-600 bg-green-50 shadow-2xl scale-105 z-10'
          : 'border-white/50 bg-white/60 backdrop-blur-sm hover:border-green-400 hover:shadow-xl'
        }`}
    >
      <div className="text-4xl mb-2">{crop.icon}</div>
      <div className="font-semibold text-gray-800">{crop.name}</div>
    </button>
  );
};

export default CropCard;
