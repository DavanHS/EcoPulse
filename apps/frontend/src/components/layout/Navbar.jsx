import { Link, useNavigate } from 'react-router-dom';
import { FiWind, FiLogIn, FiLogOut, FiClock, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="group flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-cyan-500 shadow-lg shadow-green-500/20 transition-transform duration-300 group-hover:scale-105">
                        <FiWind className="text-xl text-white" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-white">
                        Eco<span className="text-green-500">Pulse</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/history"
                                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                            >
                                <FiClock className="text-lg" />
                                History
                            </Link>

                            <div className="h-6 w-px bg-gray-700" />

                            <span className="text-sm font-medium text-gray-300">
                                Hi, {user?.username}
                            </span>

                            <button
                                onClick={handleLogout}
                                className="ml-2 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                            >
                                <FiLogOut className="text-lg" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition-all hover:scale-105 active:scale-95"
                        >
                            <FiLogIn className="text-lg" />
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none"
                    >
                        <span className="sr-only">Open main menu</span>
                        {mobileMenuOpen ? (
                            <FiX className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <FiMenu className="block h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="border-t border-gray-800 bg-gray-900 md:hidden animate-slide-down">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {isAuthenticated ? (
                            <>
                                <div className="px-3 py-2 text-base font-medium text-gray-300">
                                    Hi, {user?.username}
                                </div>
                                <Link
                                    to="/history"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    <FiClock className="text-xl" />
                                    History
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                >
                                    <FiLogOut className="text-xl" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 rounded-md bg-green-500/10 px-3 py-2 text-base font-medium text-green-400 hover:bg-green-500/20"
                            >
                                <FiLogIn className="text-xl" />
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
