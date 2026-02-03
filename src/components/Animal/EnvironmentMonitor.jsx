import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Contexts';

const EnvironmentMonitor = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-[#0f2716] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <header className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate('/animal')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-bold">Barn Environment</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Temperature */}
                <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-4 ${theme === 'dark' ? 'bg-[#1a3d24] border-white/10' : 'bg-white border-gray-100'}`}>
                    <span className="material-symbols-outlined text-5xl text-orange-500">thermostat</span>
                    <div className="text-center">
                        <p className="text-gray-500 text-sm uppercase tracking-wide">Temperature</p>
                        <h2 className="text-5xl font-bold">24°C</h2>
                        <p className="text-green-500 text-sm mt-2 font-semibold">● Optimal Range</p>
                    </div>
                </div>

                {/* Humidity */}
                <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-4 ${theme === 'dark' ? 'bg-[#1a3d24] border-white/10' : 'bg-white border-gray-100'}`}>
                    <span className="material-symbols-outlined text-5xl text-blue-500">water_drop</span>
                    <div className="text-center">
                        <p className="text-gray-500 text-sm uppercase tracking-wide">Humidity</p>
                        <h2 className="text-5xl font-bold">65%</h2>
                        <p className="text-green-500 text-sm mt-2 font-semibold">● Comfortable</p>
                    </div>
                </div>
            </div>

            <div className={`mt-6 p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#1a3d24] border-white/10' : 'bg-white border-gray-100'}`}>
                <h3 className="font-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-yellow-500">light_mode</span>
                    Suggested Actions
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>Maintain ventilation fans at 40% speed.</li>
                    <li>Check water dispensers for refill.</li>
                    <li>Open side shutters for natural light.</li>
                </ul>
            </div>
        </div>
    );
};

export default EnvironmentMonitor;
