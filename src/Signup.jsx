import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from './services/db';
import { useAuth } from './Contexts';

const Signup = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        gender: 'Male',
        location: { name: '', lat: null, lon: null },
        profileImage: '',
        otp: ''
    });

    const maleAvatars = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Adrian',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jude'
    ];

    const femaleAvatars = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Anya',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sassy',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Kimberly'
    ];

    const getAvatars = () => {
        return formData.gender === 'Female' ? femaleAvatars : maleAvatars;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenderSelect = (gender) => {
        setFormData({ ...formData, gender, profileImage: '' }); // Clear image when gender changes
    };

    const handleAvatarSelect = (avatar) => {
        setFormData({ ...formData, profileImage: avatar });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profileImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handleBackStep = () => {
        setStep(step - 1);
    };

    const [otpMessage, setOtpMessage] = useState('');

    const sendOtp = () => {
        if (!formData.phone) return alert('Please enter mobile number');
        setLoading(true);
        setOtpMessage('Sending OTP...');

        setTimeout(() => {
            setOtpSent(true);
            setLoading(false);
            setOtpMessage('OTP sent! Use 1234 to verify.');
        }, 1200);
    };

    const verifyOtp = () => {
        if (formData.otp === '1234') {
            setStep(3);
        } else {
            alert('Invalid OTP. Use 1234');
        }
    };

    const detectLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    const name = data.address.city || data.address.town || data.address.village || data.display_name.split(',')[0];
                    setFormData({ ...formData, location: { name, lat: latitude, lon: longitude } });
                } catch (err) {
                    setFormData({ ...formData, location: { name: 'Current Location', lat: latitude, lon: longitude } });
                }
                setLoading(false);
            }, () => {
                alert('Could not detect location. Please enter manually.');
                setLoading(false);
            });
        }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const finalData = {
                ...formData,
                profileImage: formData.profileImage || getAvatars()[0]
            };
            delete finalData.otp; // Don't store OTP in DB

            const user = await db.register(finalData);
            login(user);
            navigate('/');
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-card-dark rounded-3xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden animate-fade-in-down">
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-gray-100 dark:bg-background-dark">
                    <div
                        className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(15,240,34,0.5)]"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
                            {step === 1 && 'Create Account'}
                            {step === 2 && 'Verify Mobile'}
                            {step === 3 && 'Profile Details'}
                        </h1>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Step {step}/3</span>
                    </div>

                    {/* STEP 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-4 animate-slide-in-up">
                            <div className="space-y-1">
                                <label className="text-sm font-medium ml-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium ml-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium ml-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                />
                            </div>
                            <button
                                onClick={handleNextStep}
                                className="w-full bg-primary text-[#112212] font-bold py-3 mt-4 rounded-xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                            >
                                <span>Continue</span>
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </button>
                        </div>
                    )}

                    {/* STEP 2: Mobile Verification */}
                    {step === 2 && (
                        <div className="space-y-6 animate-slide-in-up">
                            <div className="space-y-1">
                                <label className="text-sm font-medium ml-1">Mobile Number</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">+91</span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="9876543210"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={sendOtp}
                                        disabled={loading || otpSent}
                                        className="px-4 bg-primary/20 text-primary font-bold rounded-xl hover:bg-primary/30 disabled:opacity-50 transition-all whitespace-nowrap"
                                    >
                                        {otpSent ? 'Resend' : 'Send'}
                                    </button>
                                </div>
                            </div>

                            {otpSent && (
                                <div className="space-y-4 animate-bounce-in">
                                    {otpMessage && (
                                        <p className={`text-xs text-center font-bold ${otpMessage.includes('sent') ? 'text-success' : 'text-primary'}`}>
                                            {otpMessage}
                                        </p>
                                    )}
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium ml-1 text-center block">Enter 4-Digit OTP</label>
                                        <input
                                            type="text"
                                            name="otp"
                                            maxLength="4"
                                            value={formData.otp}
                                            onChange={handleChange}
                                            className="w-full text-center text-3xl tracking-[1em] px-4 py-3 rounded-xl border-2 border-primary bg-primary/5 focus:ring-4 focus:ring-primary/20 outline-none transition-all font-bold"
                                        />
                                    </div>
                                    <button
                                        onClick={verifyOtp}
                                        className="w-full bg-primary text-[#112212] font-bold py-3 rounded-xl shadow-lg transition-all"
                                    >
                                        Verify & Next
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={handleBackStep}
                                className="w-full text-text-secondary-light dark:text-text-secondary-dark font-medium hover:underline"
                            >
                                Go Back
                            </button>
                        </div>
                    )}

                    {/* STEP 3: Profile Details */}
                    {step === 3 && (
                        <div className="space-y-6 animate-slide-in-up">
                            {/* Gender */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Gender</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Male', 'Female'].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => handleGenderSelect(g)}
                                            className={`py-2 rounded-xl text-sm font-bold border-2 transition-all ${formData.gender === g
                                                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                                : 'border-border-light dark:border-border-dark text-gray-500 hover:border-primary/50'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Farm Location</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={formData.location.name}
                                        placeholder="Click to detect location"
                                        className="flex-1 px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark outline-none transition-all text-sm truncate"
                                    />
                                    <button
                                        onClick={detectLocation}
                                        disabled={loading}
                                        className="p-3 bg-primary text-[#112212] rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center shrink-0"
                                    >
                                        <span className="material-symbols-outlined">my_location</span>
                                    </button>
                                </div>
                            </div>

                            {/* Avatar Selection */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium ml-1">Profile Photo</label>
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">upload</span>
                                        Choose from Device
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </div>

                                {formData.profileImage && formData.profileImage.startsWith('data:') ? (
                                    <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-primary shadow-lg group">
                                        <img src={formData.profileImage} alt="User upload" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setFormData({ ...formData, profileImage: '' })}
                                            className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-5 gap-2">
                                        {getAvatars().map((url, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => handleAvatarSelect(url)}
                                                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${formData.profileImage === url ? 'border-primary ring-2 ring-primary/20 scale-110 z-10' : 'border-transparent opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                <img src={url} alt={`avatar-${idx}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleBackStep}
                                    className="flex-1 bg-gray-100 dark:bg-background-dark text-text-light dark:text-text-dark font-bold py-4 rounded-xl transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleFinalSubmit}
                                    disabled={loading}
                                    className="flex-[2] bg-primary text-[#112212] font-bold py-4 rounded-xl shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <div className="animate-spin h-5 w-5 border-2 border-[#112212] border-t-transparent rounded-full" />
                                    ) : (
                                        <>
                                            <span>Sign Up</span>
                                            <span className="material-symbols-outlined text-lg">verified</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <p className="mt-8 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline font-display">Sign In</Link>
            </p>
        </div >
    );
};

export default Signup;
