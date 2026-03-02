import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Area, AreaChart,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-xl">
            <p className="mb-2 text-sm font-bold text-white">{label}</p>
            {payload.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-gray-400 font-medium">{entry.name}:</span>
                    <span className="text-sm font-black" style={{ color: entry.color }}>{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

export default function AqiTrendChart({ data = [] }) {
    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-800 bg-gray-900/30 h-[300px] text-gray-500">
                <span className="mb-3 text-3xl">📉</span>
                <p className="text-sm font-medium">Insufficient data for trending</p>
            </div>
        );
    }

    const chartData = data
        .slice()
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map((entry) => ({
            date: new Date(entry.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            }),
            AQI: entry.aqiValue,
        }));

    return (
        <div className="w-full h-[300px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <defs>
                        <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} /> {/* indigo-400 */}
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                        axisLine={{ stroke: '#374151' }}
                        tickLine={false}
                        tickMargin={10}
                        minTickGap={20}
                    />
                    <YAxis
                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#374151', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area
                        type="monotone"
                        dataKey="AQI"
                        stroke="#818cf8"
                        strokeWidth={3}
                        fill="url(#aqiGradient)"
                        activeDot={{ r: 6, stroke: '#818cf8', strokeWidth: 2, fill: '#111827' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
