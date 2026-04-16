import { useState } from 'react';
import { FiRefreshCw, FiAward, FiMapPin, FiNavigation } from 'react-icons/fi';
import { aqiService } from '../../services/aqiService';
import AqiCard from '../aqi/AqiCard';
import GeminiAdvisory from '../aqi/GeminiAdvisory';
import ComparisonChart from './ComparisonChart';
import Loader from '../ui/Loader';
import ErrorAlert from '../ui/ErrorAlert';

const accuracyColors = {
    high: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400', label: 'High' },
    moderate: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'Moderate' },
    low: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', label: 'Low' },
};

function ComparisonStationInfo({ data, isWinner }) {
    if (!data) return null;
    
    const accuracy = accuracyColors[data.accuracy] || accuracyColors.low;
    
    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
                <FiMapPin className="text-gray-500" />
                <span>{data.stationLocation}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <FiNavigation className="text-gray-500" />
                <span>{data.distanceKm} km</span>
            </div>
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-semibold ${accuracy.bg} ${accuracy.border} ${accuracy.text}`}>
                {accuracy.label} Accuracy
            </div>
        </div>
    );
}

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

    const renderColumn = (loc, data, isWinner, accentColor) => (
        <div className="flex-1 w-full animate-fade-in-up">
            <div className={`flex items-center justify-between border-b-2 pb-4 mb-6 ${isWinner ? 'border-green-500' : 'border-gray-700'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${accentColor}`} />
                    <h3 className="text-xl font-bold text-white tracking-tight">{loc}</h3>
                </div>
                {isWinner && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-4 py-1.5 text-xs font-bold text-green-400 border border-green-500/30">
                        <FiAward className="text-sm" /> Better Air Quality
                    </span>
                )}
            </div>

            {data && (
                <div>
                    <ComparisonStationInfo data={data} isWinner={isWinner} />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        <AqiCard label="aqi" value={data.aqi} />
                        <AqiCard label="pm25" value={data.pm25} unit="µg/m³" />
                        <AqiCard label="pm10" value={data.pm10} unit="µg/m³" />
                        <AqiCard label="no2" value={data.no2} unit="ppb" />
                        <AqiCard label="so2" value={data.so2} unit="ppb" />
                        <AqiCard label="o3" value={data.o3} unit="ppb" />
                    </div>
                    {data.geminiAdvisory && <GeminiAdvisory advisory={data.geminiAdvisory} />}
                </div>
            )}
        </div>
    );

    return (
        <div className="mx-auto w-full max-w-7xl">
            <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
                    Neighborhood <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400" style={{ WebkitTextFillColor: 'transparent' }}>Showdown</span>
                </h2>
                <p className="text-base text-gray-400 max-w-2xl mx-auto">
                    Compare air quality metrics side-by-side to make informed decisions about your day.
                </p>
            </div>

            {/* Selectors */}
            <div className="mx-auto max-w-4xl mb-12">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-6 rounded-3xl bg-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur-sm">
                    <div className="relative flex-1">
                        <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={loc1}
                            onChange={(e) => setLoc1(e.target.value)}
                            placeholder="Enter first location (e.g., Indiranagar)"
                            className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-4 pl-11 text-sm text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>

                    <div className="flex shrink-0 items-center justify-center py-2 md:py-0">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 border-2 border-gray-700 text-sm font-black text-white shadow-lg">
                            VS
                        </span>
                    </div>

                    <div className="relative flex-1">
                        <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={loc2}
                            onChange={(e) => setLoc2(e.target.value)}
                            placeholder="Enter second location (e.g., Whitefield)"
                            className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-4 pl-11 text-sm text-white font-medium outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleCompare}
                        disabled={!loc1 || !loc2 || loading}
                        className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-10 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <FiRefreshCw className={`text-xl ${loading ? 'animate-spin' : ''}`} />
                        Compare Now
                    </button>
                </div>
            </div>

            {/* Error & Loading States */}
            <div className="max-w-2xl mx-auto">
                {error && <ErrorAlert message={error} />}
                {loading && (
                    <div className="py-16 flex justify-center">
                        <Loader size="lg" text="Analyzing both locations..." />
                    </div>
                )}
            </div>

            {/* Results Grid */}
            {data1 && data2 && !loading && (
                <div className="mt-8">
                    {/* Winner Banner */}
                    {winner !== 'Tie' && (
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500/10 border border-green-500/30">
                                <FiAward className="text-2xl text-green-400" />
                                <span className="text-lg font-bold text-green-400">
                                    {winner} has better air quality!
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Comparison Chart */}
                    <div className="mb-8">
                        <ComparisonChart 
                            data1={data1} 
                            data2={data2} 
                            label1={loc1} 
                            label2={loc2} 
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {renderColumn(loc1, data1, winner === loc1, 'bg-blue-500')}
                        
                        <div className="hidden lg:flex w-px flex-col items-center justify-center self-stretch">
                            <div className="h-full w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
                        </div>

                        <div className="flex lg:hidden h-px w-full items-center justify-center my-4">
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                        </div>

                        {renderColumn(loc2, data2, winner === loc2, 'bg-cyan-500')}
                    </div>
                </div>
            )}
        </div>
    );
}
