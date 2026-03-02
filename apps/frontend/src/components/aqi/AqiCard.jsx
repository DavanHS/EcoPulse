import { getAqiLevel, POLLUTANT_LABELS } from '../../utils/constants';

export default function AqiCard({ label, value, unit = '' }) {
    const level = getAqiLevel(value ?? 0);
    const displayLabel = POLLUTANT_LABELS[label] || label;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 p-6 flex flex-col justify-between h-full shadow-lg transition-transform hover:-translate-y-1">
            {/* Top Accent Line */}
            <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: level.color }}
            />

            {/* Background Glow */}
            <div
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl"
                style={{ backgroundColor: level.color }}
            />

            <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {displayLabel}
                </h3>
                <div className="flex items-baseline gap-1 mt-2">
                    <span
                        className="text-4xl sm:text-5xl font-black tracking-tight"
                        style={{ color: level.color }}
                    >
                        {value ?? '—'}
                    </span>
                    {unit && <span className="text-sm font-medium text-gray-500 ml-1">{unit}</span>}
                </div>
            </div>

            <div className="mt-4 flex items-center">
                <span
                    className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{ backgroundColor: `${level.color}20`, color: level.color }}
                >
                    {level.label}
                </span>
            </div>
        </div>
    );
}
