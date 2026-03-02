import { FiShield, FiInfo } from 'react-icons/fi';

const riskConfig = {
    1: { label: 'Very Low', emoji: '🟢', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', text: '#4ade80' },
    2: { label: 'Low', emoji: '🟡', bg: 'rgba(250,204,21,0.1)', border: 'rgba(250,204,21,0.3)', text: '#facc15' },
    3: { label: 'Moderate', emoji: '🟠', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.3)', text: '#fb923c' },
    4: { label: 'High', emoji: '🔴', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', text: '#f87171' },
    5: { label: 'Very High', emoji: '🟣', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.3)', text: '#c084fc' },
};

export default function GeminiAdvisory({ advisory }) {
    if (!advisory) return null;

    const { riskLevel, advisoryMessage } = advisory;
    const config = riskConfig[riskLevel] || riskConfig[3];

    return (
        <div
            className="animate-fade-in-up rounded-2xl p-5 sm:p-6 shadow-md"
            style={{ backgroundColor: config.bg, border: `1px solid ${config.border}` }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 border border-gray-700 shadow-sm">
                        <FiShield className="text-gray-400 text-lg" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-300">
                        AI Health Advisory
                    </h3>
                </div>

                <div
                    className="inline-flex items-center self-start sm:self-auto gap-2 rounded-full px-3 py-1.5 text-xs font-bold border border-gray-700 bg-gray-900"
                    style={{ color: config.text }}
                >
                    <span>{config.emoji}</span>
                    <span>Risk Level {riskLevel}/5</span>
                    <span className="hidden sm:inline">— {config.label}</span>
                </div>
            </div>

            <p className="text-[15px] sm:text-base leading-relaxed text-gray-300">
                {advisoryMessage}
            </p>

            <div className="mt-5 border-t border-gray-700/50 pt-4 flex items-center gap-2 text-xs text-gray-400">
                <FiInfo className="shrink-0 text-sm" />
                <p>Actionable insights provided by Gemini AI. <span className="hidden sm:inline">Always consult medical professionals for health emergencies.</span></p>
            </div>
        </div>
    );
}
