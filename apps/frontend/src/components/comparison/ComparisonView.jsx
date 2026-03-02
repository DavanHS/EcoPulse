import { useState } from 'react';
import { FiRefreshCw, FiAward } from 'react-icons/fi';
import { BENGALURU_LOCALITIES } from '../../utils/constants';
import { aqiService } from '../../services/aqiService';
import AqiCard from '../aqi/AqiCard';
import GeminiAdvisory from '../aqi/GeminiAdvisory';
import Loader from '../ui/Loader';
import ErrorAlert from '../ui/ErrorAlert';

export default function ComparisonView() {
    const [loc1, setLoc1] = useState('');
    const [loc2, setLoc2] = useState('');
    const [data1, setData1] = useState(null);
    const [data2, setData2] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCompare = async () => {
        if (!loc1 || !loc2) return;
        setLoading(true);
        setError('');
        setData1(null);
        setData2(null);

        try {
            const [res1, res2] = await Promise.all([
                aqiService.getCurrentAqi(loc1),
                aqiService.getCurrentAqi(loc2),
            ]);
            setData1(res1);
            setData2(res2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch comparison data.');
        } finally {
            setLoading(false);
        }
    };

    const winner =
        data1 && data2
            ? data1.aqi < data2.aqi ? loc1
                : data2.aqi < data1.aqi ? loc2
                    : 'Tie'
            : null;

    const renderColumn = (loc, data, isWinner) => (
        <div className="flex-1 w-full space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <h3 className="text-xl font-bold text-white tracking-tight">{loc}</h3>
                {isWinner && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400 border border-green-500/20">
                        <FiAward className="text-sm" /> Winner
                    </span>
                )}
            </div>

            {data && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <AqiCard label="aqi" value={data.aqi} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <AqiCard label="pm25" value={data.pm25} unit="µg/m³" />
                        <AqiCard label="no2" value={data.no2} unit="ppb" />
                    </div>
                    {data.geminiAdvisory && <GeminiAdvisory advisory={data.geminiAdvisory} />}
                </div>
            )}
        </div>
    );

    return (
        <div className="mx-auto w-full max-w-6xl">
            <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
                    Neighborhood <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400" style={{ WebkitTextFillColor: 'transparent' }}>Showdown</span>
                </h2>
                <p className="text-base text-gray-400 max-w-2xl mx-auto">
                    Compare air quality metrics side-by-side to make informed decisions about your day.
                </p>
            </div>

            {/* Selectors */}
            <div className="mx-auto max-w-3xl mb-12">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-gray-900 border border-gray-800 shadow-xl">
                    <select
                        value={loc1}
                        onChange={(e) => setLoc1(e.target.value)}
                        className="flex-1 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3.5 text-sm text-white font-medium outline-none focus:border-blue-500 transition-colors"
                    >
                        <option value="">Select Neighborhood 1</option>
                        {BENGALURU_LOCALITIES.map((loc) => (
                            <option key={loc} value={loc} disabled={loc === loc2}>{loc}</option>
                        ))}
                    </select>

                    <div className="flex shrink-0 items-center justify-center py-2 md:py-0">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 border border-gray-700 text-xs font-black text-gray-400 shadow-inner">
                            VS
                        </span>
                    </div>

                    <select
                        value={loc2}
                        onChange={(e) => setLoc2(e.target.value)}
                        className="flex-1 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3.5 text-sm text-white font-medium outline-none focus:border-blue-500 transition-colors"
                    >
                        <option value="">Select Neighborhood 2</option>
                        {BENGALURU_LOCALITIES.map((loc) => (
                            <option key={loc} value={loc} disabled={loc === loc1}>{loc}</option>
                        ))}
                    </select>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleCompare}
                        disabled={!loc1 || !loc2 || loading}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <FiRefreshCw className={`text-lg ${loading ? 'animate-spin' : ''}`} />
                        Compare Locations
                    </button>
                </div>
            </div>

            {/* Error & Loading States */}
            <div className="max-w-2xl mx-auto">
                {error && <ErrorAlert message={error} />}
                {loading && (
                    <div className="py-12 flex justify-center">
                        <Loader size="lg" text="Fetching comparative data..." />
                    </div>
                )}
            </div>

            {/* Results Grid */}
            {data1 && data2 && (
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-8">
                    {renderColumn(loc1, data1, winner === loc1)}

                    <div className="hidden lg:flex w-px flex-col items-center justify-center self-stretch">
                        <div className="h-full w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
                    </div>

                    <div className="flex lg:hidden h-px w-full items-center justify-center">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                    </div>

                    {renderColumn(loc2, data2, winner === loc2)}
                </div>
            )}
        </div>
    );
}
