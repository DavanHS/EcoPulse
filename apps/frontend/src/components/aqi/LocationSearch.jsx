import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { BENGALURU_LOCALITIES } from '../../utils/constants';

export default function LocationSearch({ onSearch, loading = false }) {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const filtered = query.length > 0
        ? BENGALURU_LOCALITIES.filter((loc) =>
            loc.toLowerCase().includes(query.toLowerCase())
        )
        : BENGALURU_LOCALITIES;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
            setShowSuggestions(false);
        }
    };

    const handleSelect = (locality) => {
        setQuery(locality);
        setShowSuggestions(false);
        onSearch(locality);
    };

    return (
        <div ref={wrapperRef} className="relative mx-auto w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl bg-gray-900 border border-gray-700 shadow-xl p-1.5 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
                    <div className="flex flex-1 items-center px-3 sm:px-4 py-2 sm:py-0">
                        <FiMapPin className="text-gray-400 text-lg shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Search a Bengaluru locality..."
                            className="w-full bg-transparent px-3 py-2 text-base text-white placeholder-gray-500 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-cyan-600 px-6 py-3 sm:py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <FiSearch className="text-lg" />
                        <span>{loading ? 'Searching...' : 'Search Location'}</span>
                    </button>
                </div>
            </form>

            {showSuggestions && filtered.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-[300px] overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 py-2 shadow-2xl animate-slide-down scrollbar-thin">
                    <ul className="flex flex-col">
                        {filtered.map((loc) => (
                            <li key={loc}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(loc)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
                                        <FiMapPin className="text-green-500 text-sm" />
                                    </div>
                                    {loc}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
