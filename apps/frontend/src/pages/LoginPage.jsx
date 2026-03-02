import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn, FiWind, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import ErrorAlert from '../components/ui/ErrorAlert';
import Loader from '../components/ui/Loader';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.email || !form.password) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            await login(form);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem-120px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md animate-fade-in-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-cyan-500 shadow-xl shadow-green-500/20 mb-6 transition-transform hover:scale-105">
                        <FiWind className="text-3xl text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Sign in to track your environmental exposure.
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-3xl border border-gray-800 bg-gray-900 overflow-hidden shadow-2xl">
                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <ErrorAlert message={error} />}

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-green-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3.5 pl-11 text-sm sm:text-base text-white placeholder-gray-600 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                    Password
                                </label>
                                <div className="relative group">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-green-500" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3.5 pl-11 text-sm sm:text-base text-white placeholder-gray-600 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-sm sm:text-base font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {loading ? <Loader size="sm" /> : (
                                    <>
                                        <FiLogIn className="text-lg" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="border-t border-gray-800 bg-gray-950 px-6 py-6 text-center">
                        <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                            New to EcoPulse?
                            <Link to="/register" className="inline-flex items-center gap-1 font-bold text-green-400 hover:text-green-300 transition-colors">
                                Create Account <FiArrowRight />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
