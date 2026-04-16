import { getAqiLevel, POLLUTANT_LABELS, getPollutantLevel, POLLUTANT_THRESHOLDS } from '../../utils/constants';
import { POLLUTANT_INFO } from '../../utils/pollutantInfo';

export default function AqiCard({ label, value, unit = '' }) {
    const isAqi = label === 'aqi';
    const level = isAqi ? getAqiLevel(value ?? 0) : getPollutantLevel(label, value ?? 0);
    const displayLabel = POLLUTANT_LABELS[label] || label;
    const info = POLLUTANT_INFO[label];
    const thresholds = POLLUTANT_THRESHOLDS[label];

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 p-5 flex flex-col justify-between h-full shadow-lg transition-transform hover:-translate-y-1">
            <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: level?.color || '#6b7280' }}
            />

            <div
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl"
                style={{ backgroundColor: level?.color || '#6b7280' }}
            />

            <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {displayLabel}
                </h3>
                <div className="flex items-baseline gap-1 mt-2">
                    <span
                        className="text-4xl sm:text-5xl font-black tracking-tight"
                        style={{ color: level?.color || '#6b7280' }}
                    >
                        {value ?? '—'}
                    </span>
                    {unit && <span className="text-sm font-medium text-gray-500 ml-1">{unit}</span>}
                </div>
            </div>

            <div className="mt-4 flex items-center">
                <span
                    className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{ backgroundColor: `${level?.color || '#6b7280'}20`, color: level?.color || '#6b7280' }}
                >
                    {level?.label || 'Unknown'}
                </span>
            </div>

            {info && thresholds && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-400 leading-relaxed">
                        {info.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-gray-500">≤{thresholds.safe} {thresholds.unit}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <span className="text-gray-500">≤{thresholds.warning} {thresholds.unit}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-gray-500">&gt;{thresholds.warning} {thresholds.unit}</span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}