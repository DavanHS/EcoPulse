import { useState, useEffect } from 'react';
import { FiClock, FiMapPin, FiTrendingUp } from 'react-icons/fi';
import { historyService } from '../services/historyService';
import { getAqiLevel, POLLUTANT_LABELS } from '../utils/constants';
import AqiTrendChart from '../components/charts/AqiTrendChart';
import Loader from '../components/ui/Loader';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await historyService.getHistory();
                const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
                setHistory(sorted);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load history.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader size="lg" text="Loading your environmental history..." />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

            {/* Page Header */}
            <div className="mb-10 sm:mb-14 border-b border-gray-800 pb-8 animate-fade-in-up">
                <div className="flex items-center gap-4 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/20">
                        <FiClock className="text-2xl text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                        Search History
                    </h1>
                </div>
                <p className="text-base sm:text-lg text-gray-400 max-w-2xl">
                    Track your past AQI lookups and monitor exposure trends across different neighborhoods.
                </p>
            </div>

            {error && <div className="mb-8"><ErrorAlert message={error} /></div>}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12">
                {/* Left Column: Chart */}
                <div className="xl:col-span-1 border-b xl:border-b-0 xl:border-r border-gray-800 pb-10 xl:pb-0 xl:pr-8">
                    <div className="sticky top-24">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
                            <FiTrendingUp className="text-indigo-400" />
                            Exposure Trends
                        </h2>
                        <AqiTrendChart data={history} />
                    </div>
                </div>

                {/* Right Column: Table/List */}
                <div className="xl:col-span-2">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
                        Detailed Records
                    </h2>

                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-700 bg-gray-900/50 py-24 text-center px-4">
                            <span className="mb-4 text-5xl">🧭</span>
                            <h3 className="text-xl font-bold text-white mb-2">No History Yet</h3>
                            <p className="text-gray-400 max-w-sm mb-6">You haven&apos;t searched for any locations yet. Look up a neighborhood to start tracking your exposure.</p>
                            <a href="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-transform hover:scale-105 active:scale-95">
                                Go to Dashboard
                            </a>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-gray-950/50 border-b border-gray-800">
                                        <tr>
                                            {['Location', 'AQI', 'Dominant Pollutant', 'Risk Level', 'Date Searched'].map((h) => (
                                                <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {history.map((entry, i) => {
                                            const level = getAqiLevel(entry.aqiValue ?? 0);
                                            const dateValue = entry.createdAt || entry.timestamp;
                                            const date = dateValue ? new Date(dateValue) : null;
                                            const isValidDate = date && !isNaN(date.getTime());
                                            
                                            return (
                                                <tr key={entry._id || i} className="hover:bg-gray-800/30 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800">
                                                                <FiMapPin className="text-gray-400 text-xs" />
                                                            </div>
                                                            <span className="font-semibold text-white">{entry.locationSearched}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span
                                                            className="inline-flex items-center rounded-full px-3 py-1 font-black"
                                                            style={{ backgroundColor: `${level.color}15`, color: level.color, border: `1px solid ${level.color}30` }}
                                                        >
                                                            {entry.aqiValue}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-gray-300 font-medium">
                                                            {POLLUTANT_LABELS[entry.dominantPollutant] || entry.dominantPollutant}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-gray-300">
                                                            {entry.aiRiskLevel ? `${entry.aiRiskLevel}/5` : '—'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-gray-500">
                                                        {isValidDate ? (
                                                            <>
                                                                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                <span className="mx-1.5 hidden sm:inline">·</span>
                                                                <br className="sm:hidden" />
                                                                {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                            </>
                                                        ) : (
                                                            '—'
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
