import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from './services/db';
import { useAuth } from './Contexts';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!formData.identifier || !formData.password) return;

        setLoading(true);
        try {
            const user = await db.login(formData.identifier, formData.password);
            login(user);
            navigate('/');
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const mockGoogleUser = {
                name: 'Google User',
                email: 'user@gmail.com',
                profileImage: 'https://lh3.googleusercontent.com/a/default-user',
                location: { name: 'New Delhi', lat: 28.6139, lon: 77.2090 }
            };
            const user = await db.socialLogin(mockGoogleUser);
            login(user);
            navigate('/');
        } catch (err) {
            alert('Google sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-card-dark rounded-3xl shadow-2xl overflow-hidden border border-border-light dark:border-border-dark animate-fade-in-down">
                <div className="p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-primary/20 p-4 rounded-2xl mb-4 group hover:scale-110 transition-transform cursor-pointer">
                            <span className="material-symbols-outlined text-primary text-5xl">agriculture</span>
                        </div>
                        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Welcome Back</h1>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">Sign in to manage your farm</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text-light dark:text-text-dark ml-1">Email or Mobile</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">person</span>
                                <input
                                    type="text"
                                    name="identifier"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text-light dark:text-text-dark ml-1">Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-[#112212] font-bold py-3 rounded-xl shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="animate-spin h-5 w-5 border-2 border-[#112212] border-t-transparent rounded-full" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <span className="material-symbols-outlined text-lg">login</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border-light dark:border-border-dark"></div>
                        </div>
                        <span className="relative bg-white dark:bg-card-dark px-4 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Or continue with</span>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full bg-white dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark font-semibold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-background-light/5 transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Sign in with Google</span>
                    </button>

                    <p className="text-center mt-8 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary font-bold hover:underline">Get Started</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
