import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Contexts';

const AnimalTracking = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-[#0f2716] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <header className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate('/animal')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-bold">Live Tracking</h1>
            </header>

            {/* Mock Map View */}
            <div className={`w-full aspect-square md:aspect-video rounded-2xl overflow-hidden relative shadow-lg border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-0.12,51.50,-0.10,51.52&layer=mapnik&marker=51.51,-0.11"
                    style={{ filter: theme === 'dark' ? 'invert(90%) hue-rotate(180deg)' : 'none' }}
                ></iframe>
                <div className="absolute top-4 right-4 bg-white dark:bg-black/80 px-4 py-2 rounded-lg shadow-md">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-sm font-bold">Tracking 124 Animals</span>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-bold mb-3">Geo-Fencing Status</h3>
                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#1a3d24] border-white/10' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">North Pasture Zone</span>
                        <span className="text-green-500 text-sm font-bold">SECURE</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">All animals are within the designated safe zone.</p>
                </div>
            </div>
        </div>
    );
};

export default AnimalTracking;
