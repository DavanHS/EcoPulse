import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend,
} from 'recharts';
import { COMPARISON_POLLUTANTS } from '../../utils/pollutantInfo';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-gray-600 bg-gray-900/95 p-3 shadow-xl backdrop-blur-sm">
            <p className="mb-2 text-xs font-bold text-gray-300">{label}</p>
            {payload.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-gray-400 font-medium">{entry.name}:</span>
                    <span className="text-xs font-bold" style={{ color: entry.color }}>{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

export default function ComparisonChart({ data1, data2, label1, label2 }) {
    const chartData = COMPARISON_POLLUTANTS.map(pollutant => ({
        name: pollutant.label,
        [label1 || 'Location 1']: data1?.[pollutant.key] ?? 0,
        [label2 || 'Location 2']: data2?.[pollutant.key] ?? 0,
    }));

    return (
        <div className="w-full h-[350px] sm:h-[400px] p-4 rounded-3xl bg-gray-900/80 border border-gray-800">
            <h3 className="text-lg font-bold text-white text-center mb-4">
                Pollutant Comparison
            </h3>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                        axisLine={{ stroke: '#374151' }}
                        tickLine={false}
                        tickMargin={8}
                    />
                    <YAxis
                        tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#374151', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Legend 
                        wrapperStyle={{ paddingTop: '10px' }}
                        formatter={(value) => <span className="text-gray-400 text-xs font-medium">{value}</span>}
                    />
                    <Bar
                        dataKey={label1 || 'Location 1'}
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                    />
                    <Bar
                        dataKey={label2 || 'Location 2'}
                        fill="#06b6d4"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}