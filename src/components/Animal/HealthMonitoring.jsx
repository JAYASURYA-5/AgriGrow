import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Contexts';

const HealthMonitoring = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const healthData = [
        { id: 'COW-104', type: 'Cow', status: 'Healthy', notes: 'Routine checkup clear', lastCheck: '2 days ago' },
        { id: 'GOAT-22', type: 'Goat', status: 'Attention', notes: 'Mild fever noticed', lastCheck: 'Today' },
        { id: 'SHEEP-09', type: 'Sheep', status: 'Healthy', notes: 'Vaccination due next week', lastCheck: '5 days ago' },
        { id: 'COW-108', type: 'Cow', status: 'Critical', notes: 'Severe limping not improving', lastCheck: 'Yesterday' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Healthy': return 'text-green-500 bg-green-100 dark:bg-green-500/10';
            case 'Attention': return 'text-orange-500 bg-orange-100 dark:bg-orange-500/10';
            case 'Critical': return 'text-red-500 bg-red-100 dark:bg-red-500/10';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-[#0f2716] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <header className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate('/animal')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-bold">Health Monitoring</h1>
            </header>

            <div className="grid gap-4">
                {healthData.map((animal, index) => (
                    <div key={index} className={`p-4 rounded-xl shadow-sm border ${theme === 'dark' ? 'bg-[#1a3d24] border-white/10' : 'bg-white border-gray-100'} flex items-center justify-between`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-blue-500/20 text-blue-500 font-bold`}>
                                {animal.type[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{animal.id}</h3>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{animal.notes}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(animal.status)}`}>
                                {animal.status}
                            </span>
                            <span className="text-xs text-gray-400">{animal.lastCheck}</span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="fixed bottom-6 right-6 w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110">
                <span className="material-symbols-outlined text-2xl">add_alert</span>
            </button>
        </div>
    );
};

export default HealthMonitoring;
