import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Contexts';

const AlertsSystem = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const alerts = [
        { title: 'Vaccination Due', message: 'Sheep Flock A needs vaccination tomorrow.', type: 'warning', time: '2 hours ago' },
        { title: 'Low Feed Stock', message: 'Chicken feed running low (15%). Order soon.', type: 'info', time: '4 hours ago' },
        { title: 'Temperature Warning', message: 'Barn 2 temperature slightly elevated.', type: 'danger', time: 'Yesterday' },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return 'schedule';
            case 'info': return 'info';
            case 'danger': return 'warning';
            default: return 'notifications';
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'warning': return 'text-orange-500 bg-orange-100 dark:bg-orange-500/20';
            case 'info': return 'text-blue-500 bg-blue-100 dark:bg-blue-500/20';
            case 'danger': return 'text-red-500 bg-red-100 dark:bg-red-500/20';
            default: return 'text-gray-500 bg-gray-100';
        }
    };

    return (
        <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-[#0f2716] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <header className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate('/animal')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-bold">Farm Alerts</h1>
            </header>

            <div className="space-y-4">
                {alerts.map((alert, index) => (
                    <div key={index} className={`p-4 rounded-xl border flex gap-4 ${theme === 'dark' ? 'bg-[#1a3d24] border-white/10' : 'bg-white border-gray-100'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getColor(alert.type)}`}>
                            <span className="material-symbols-outlined">{getIcon(alert.type)}</span>
                        </div>
                        <div>
                            <div className="flex justify-between items-start w-full">
                                <h3 className="font-bold text-lg">{alert.title}</h3>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{alert.time}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">{alert.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-8 py-3 bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-white/20">
                Clear All Alerts
            </button>
        </div>
    );
};

export default AlertsSystem;
