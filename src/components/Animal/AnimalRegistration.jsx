import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Contexts';

const AnimalRegistration = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        tagId: '',
        type: 'Cow',
        breed: '',
        age: '',
        weight: '',
        notes: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Animal Registered Successfully! (Mock)');
        navigate('/animal');
    };

    return (
        <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-[#0f2716] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <header className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate('/animal')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-bold">Register New Animal</h1>
            </header>

            <form onSubmit={handleSubmit} className={`max-w-2xl mx-auto p-6 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-[#1a3d24] border-white/10' : 'bg-white border-gray-100'}`}>
                <div className="grid gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Tag ID / Name</label>
                        <input
                            name="tagId"
                            value={formData.tagId}
                            onChange={handleChange}
                            required
                            type="text"
                            placeholder="e.g. COW-0043"
                            className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-[#0f2716] border-white/20 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 outline-none`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-[#0f2716] border-white/20 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 outline-none`}
                            >
                                <option>Cow</option>
                                <option>Goat</option>
                                <option>Sheep</option>
                                <option>Chicken</option>
                                <option>Pig</option>
                                <option>Horse</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Breed</label>
                            <input
                                name="breed"
                                value={formData.breed}
                                onChange={handleChange}
                                type="text"
                                placeholder="e.g. Holstein"
                                className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-[#0f2716] border-white/20 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 outline-none`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Age (Months)</label>
                            <input
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                type="number"
                                placeholder="Age in months"
                                className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-[#0f2716] border-white/20 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 outline-none`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                            <input
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                type="number"
                                placeholder="Weight in KG"
                                className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-[#0f2716] border-white/20 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 outline-none`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Medical Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Any specific health notes or markings..."
                            className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-[#0f2716] border-white/20 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 outline-none`}
                        ></textarea>
                    </div>

                    <button type="submit" className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95">
                        Register Animal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AnimalRegistration;
