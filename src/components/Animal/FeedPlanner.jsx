import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Contexts';

const FeedPlanner = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [selectedAnimal, setSelectedAnimal] = useState('Cow');

    const feedPlans = {
        'Cow': { mix: 'Grass 60% + Corn 30% + Supplements 10%', quantity: '12kg / day', cost: '$4.50' },
        'Goat': { mix: 'Shrubs 70% + Grains 30%', quantity: '3kg / day', cost: '$1.20' },
        'Chicken': { mix: 'Corn 50% + Wheat 30% + Protein 20%', quantity: '150g / day', cost: '$0.15' },
    };

    return (
        <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-[#0f2716] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <header className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate('/animal')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-bold">Smart Feed Planner</h1>
            </header>

            <div className={`p-6 rounded-2xl shadow-lg border mb-6 ${theme === 'dark' ? 'bg-[#1a3d24] border-white/10' : 'bg-white border-gray-100'}`}>
                <label className="block text-sm font-medium mb-3">Select Animal Type</label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {['Cow', 'Goat', 'Sheep', 'Chicken', 'Pig'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedAnimal(type)}
                            className={`px-6 py-2 rounded-full border transition-all whitespace-nowrap ${selectedAnimal === type
                                ? 'bg-yellow-500 text-black border-yellow-500 font-bold shadow-md'
                                : `border-gray-300 dark:border-gray-600 ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {feedPlans[selectedAnimal] ? (
                <div className="grid gap-4 animate-fade-in-up">
                    <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-[#1a3d24] border-white/10' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-yellow-500 text-2xl">restaurant_menu</span>
                            <h3 className="font-bold text-lg">Recommended Mix</h3>
                        </div>
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{feedPlans[selectedAnimal].mix}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-[#1a3d24] border-white/10' : 'bg-white border-gray-100'}`}>
                            <p className="text-sm text-gray-500 mb-1">Daily Quantity</p>
                            <p className="text-2xl font-bold">{feedPlans[selectedAnimal].quantity}</p>
                        </div>
                        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-[#1a3d24] border-white/10' : 'bg-white border-gray-100'}`}>
                            <p className="text-sm text-gray-500 mb-1">Est. Cost</p>
                            <p className="text-2xl font-bold text-green-500">{feedPlans[selectedAnimal].cost}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2">info</span>
                    <p>No specific plan available for {selectedAnimal} yet.</p>
                </div>
            )}
        </div>
    );
};

export default FeedPlanner;
