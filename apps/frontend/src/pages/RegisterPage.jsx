import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiMapPin, FiUserPlus, FiWind, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import ErrorAlert from '../components/ui/ErrorAlert';
import Loader from '../components/ui/Loader';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        defaultLocation: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.username || !form.email || !form.password) {
            setError('Please fill in all required fields.');
            return;
        }
        if (form.username.length < 3) {
            setError('Username must be at least 3 characters.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await register(form);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: 'username', label: 'Username', type: 'text', icon: FiUser, placeholder: 'johndoe', required: true },
        { name: 'email', label: 'Email', type: 'email', icon: FiMail, placeholder: 'you@example.com', required: true },
        { name: 'password', label: 'Password', type: 'password', icon: FiLock, placeholder: '••••••••', required: true },
        { name: 'defaultLocation', label: 'Default Area (Optional)', type: 'text', icon: FiMapPin, placeholder: 'e.g. Indiranagar', required: false },
    ];

    return (
        <div className="flex min-h-[calc(100vh-4rem-120px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md animate-fade-in-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-cyan-500 shadow-xl shadow-cyan-500/20 mb-6 transition-transform hover:scale-105">
                        <FiWind className="text-3xl text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
                        Create Account
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Join Eco<span className="text-green-500 font-bold">Pulse</span> to unlock history tracking.
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-3xl border border-gray-800 bg-gray-900 overflow-hidden shadow-2xl">
                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <ErrorAlert message={error} />}

                            {fields.map((f) => (
                                <div key={f.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                            {f.label}
                                        </label>
                                        {f.required && <span className="text-[10px] uppercase font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">Req</span>}
                                    </div>
                                    <div className="relative group">
                                        <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-cyan-500" />
                                        <input
                                            type={f.type}
                                            name={f.name}
                                            value={form[f.name]}
                                            onChange={handleChange}
                                            placeholder={f.placeholder}
                                            required={f.required}
                                            className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3.5 pl-11 text-sm sm:text-base text-white placeholder-gray-600 outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-cyan-600 px-6 py-4 text-sm sm:text-base font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {loading ? <Loader size="sm" /> : (
                                    <>
                                        <FiUserPlus className="text-lg" />
                                        Create Account
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="border-t border-gray-800 bg-gray-950 px-6 py-6 text-center">
                        <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                            Already have an account?
                            <Link to="/login" className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                                Sign In <FiArrowRight />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
