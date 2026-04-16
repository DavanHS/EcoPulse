import { useState } from 'react';
import { FiWind, FiActivity, FiCpu, FiMapPin, FiNavigation } from 'react-icons/fi';
import { aqiService } from '../services/aqiService';
import { historyService } from '../services/historyService';
import { useAuth } from '../hooks/useAuth';
import LocationSearch from '../components/aqi/LocationSearch';
import AqiCard from '../components/aqi/AqiCard';
import GeminiAdvisory from '../components/aqi/GeminiAdvisory';
import ComparisonView from '../components/comparison/ComparisonView';
import Loader from '../components/ui/Loader';
import ErrorAlert from '../components/ui/ErrorAlert';

const accuracyColors = {
    high: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400', label: 'High Accuracy' },
    moderate: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'Moderate Accuracy' },
    low: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', label: 'Low Accuracy' },
};

function StationInfo({ data }) {
    const accuracy = accuracyColors[data.accuracy] || accuracyColors.low;
    
    return (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3">
            {data.isEstimated && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-blue-500/20 border-blue-500/30 text-blue-400">
                    Estimated for {data.location}
                </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <FiMapPin className="text-gray-500" />
                <span>Station: {data.stationLocation}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <FiNavigation className="text-gray-500" />
                <span>{data.distanceKm} km away</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${accuracy.bg} ${accuracy.border} ${accuracy.text}`}>
                {accuracy.label}
            </div>
        </div>
    );
}

export default function HomePage() {
    const { isAuthenticated, user } = useAuth();
    const [aqiData, setAqiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (location) => {
        setLoading(true);
        setError('');
        setAqiData(null);

        try {
            const data = await aqiService.getCurrentAqi(location);
            setAqiData(data);

            if (isAuthenticated) {
                try {
                    await historyService.saveSearch({
                        locationSearched: data.location,
                        aqiValue: data.aqi,
                        dominantPollutant: data.dominantPollutant,
                        aiRiskLevel: data.geminiAdvisory?.riskLevel || null,
                    });
                } catch {
                    // Silent catch for background metric
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch air quality data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* ── HERO SECTION ──────────────────────────── */}
            <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 border-b border-gray-800">
                {/* Decorative background glow */}
                <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-full max-w-[800px] bg-gradient-to-b from-green-500/10 via-cyan-500/5 to-transparent blur-[100px]" />

                <div className="relative mx-auto max-w-4xl text-center animate-fade-in-up z-50">
                    <div className="mx-auto mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-cyan-600 shadow-2xl shadow-green-500/20 animate-float">
                        <FiWind className="text-3xl sm:text-4xl text-white" />
                    </div>

                    <h1 className="mb-6 text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white">
                        Breathe <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Smarter</span>
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-base sm:text-lg text-gray-400 leading-relaxed">
                        Real-time air quality tracking for Bengaluru, augmented with actionable health insights powered by Gemini AI.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 border border-gray-700 px-4 py-2 text-xs font-semibold text-gray-300">
                            <FiActivity className="text-green-500" /> Live AQI Maps
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 border border-gray-700 px-4 py-2 text-xs font-semibold text-gray-300">
                            <FiCpu className="text-cyan-400" /> AI Health Advisory
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 border border-gray-700 px-4 py-2 text-xs font-semibold text-gray-300">
                            🏙️ Namma Bengaluru
                        </span>
                    </div>

                    <LocationSearch onSearch={handleSearch} loading={loading} />
                </div>
            </section>

            {/* ── MAIN CONTENT AREA ─────────────────────── */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

                {/* Errors & Loaders */}
                <div className="max-w-3xl mx-auto mb-12">
                    {error && <ErrorAlert message={error} />}
                    {loading && (
                        <div className="py-12 flex justify-center">
                            <Loader size="lg" text="Analyzing current air quality..." />
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {aqiData && !loading && (
                    <section className="mb-20 animate-fade-in-up">
                        <div className="mb-8 flex flex-col items-center">
                            <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Displaying real-time data for</p>
                            <h2 className="text-3xl font-black text-white">{aqiData.location}, India</h2>
                            {aqiData.stationLocation && <StationInfo data={aqiData} />}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 stagger">
                            <AqiCard label="aqi" value={aqiData.aqi} />
                            <AqiCard label="pm25" value={aqiData.pm25} unit="µg/m³" />
                            <AqiCard label="pm10" value={aqiData.pm10} unit="µg/m³" />
                            <AqiCard label="no2" value={aqiData.no2} unit="ppb" />
                            <AqiCard label="so2" value={aqiData.so2} unit="ppb" />
                            <AqiCard label="o3" value={aqiData.o3} unit="ppb" />
                        </div>

                        {aqiData.geminiAdvisory && (
                            <div className="max-w-4xl mx-auto mt-8">
                                <GeminiAdvisory advisory={aqiData.geminiAdvisory} />
                            </div>
                        )}
                    </section>
                )}

                {/* Comparison Section */}
                <section className="border-t border-gray-800 pt-16 pb-8">
                    <ComparisonView />
                </section>

            </div>
        </div>
    );
}
