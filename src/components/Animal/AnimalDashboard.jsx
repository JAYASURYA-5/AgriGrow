import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Contexts';

const AnimalDashboard = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const stats = [
        { label: 'Total Animals', value: '124', icon: 'pets', color: 'text-blue-500' },
        { label: 'Healthy', value: '118', icon: 'check_circle', color: 'text-green-500' },
        { label: 'Critical Attention', value: '2', icon: 'warning', color: 'text-red-500' },
        { label: 'Pregnancy', value: '8', icon: 'favorite', color: 'text-pink-500' },
    ];

    const menuItems = [
        { name: 'Register Animal', icon: 'add_circle', path: '/animal/register', color: 'bg-blue-500' },
        { name: 'Health Monitoring', icon: 'monitor_heart', path: '/animal/health', color: 'bg-red-500' },
        { name: 'Animal Tracking', icon: 'location_on', path: '/animal/tracking', color: 'bg-green-500' },
        { name: 'Feed Planner', icon: 'restaurant', path: '/animal/feed', color: 'bg-yellow-500' },
        { name: 'Disease Detection', icon: 'healing', path: '/animal/disease', color: 'bg-purple-500' },
        { name: 'Environment', icon: 'thermostat', path: '/animal/environment', color: 'bg-cyan-500' },
        { name: 'Alerts', icon: 'notifications', path: '/animal/alerts', color: 'bg-orange-500' },
    ];

    return (
        <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-[#0f2716] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-2xl font-bold">Livestock Manager</h1>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className={`p-4 rounded-xl shadow-lg border ${theme === 'dark' ? 'bg-[#1a3d24] border-white/10' : 'bg-white border-gray-100'} flex flex-col items-center justify-center gap-2`}>
                        <span className={`material-symbols-outlined text-3xl ${stat.color}`}>{stat.icon}</span>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold">{stat.value}</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Menu Grid */}
            <h2 className="text-xl font-semibold mb-4">Management Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(item.path)}
                        className={`cursor-pointer p-6 rounded-2xl shadow-md border hover:shadow-xl hover:scale-105 transition-all duration-300 ${theme === 'dark' ? 'bg-[#1a3d24] border-white/10' : 'bg-white border-gray-100'} flex flex-col items-center gap-3`}
                    >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${item.color} text-white shadow-lg`}>
                            <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                        </div>
                        <span className="font-semibold text-center">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnimalDashboard;
