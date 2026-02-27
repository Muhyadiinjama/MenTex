import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { format } from 'date-fns';

interface MoodTrendChartProps {
    data: Array<{
        date: string;
        avgScore: number;
        min: number;
        max: number;
        dominantMood?: string;
    }>;
    windowMode: 'Weekly' | 'Monthly';
}

const MoodTrendChart: React.FC<MoodTrendChartProps> = ({ data, windowMode }) => {
    if (!data || data.length === 0) return <div>No data available</div>;

    const formattedData = data.map((d) => ({
        ...d,
        displayDate: windowMode === 'Weekly'
            ? format(new Date(d.date), 'EEE')
            : format(new Date(d.date), 'MMM d')
    }));

    const firstX = formattedData[0]?.displayDate;
    const lastX = formattedData[formattedData.length - 1]?.displayDate;

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                    {firstX && lastX && (
                        <>
                            <ReferenceArea x1={firstX} x2={lastX} y1={1} y2={2.4} fill="rgba(248, 113, 113, 0.09)" />
                            <ReferenceArea x1={firstX} x2={lastX} y1={2.4} y2={3.8} fill="rgba(251, 191, 36, 0.08)" />
                            <ReferenceArea x1={firstX} x2={lastX} y1={3.8} y2={5} fill="rgba(16, 185, 129, 0.08)" />
                        </>
                    )}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="displayDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--color-text-sub)', fontSize: 12 }}
                    />
                    <YAxis
                        domain={[1, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        width={28}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--color-text-sub)', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--color-white)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                            color: 'var(--color-text)'
                        }}
                        itemStyle={{ color: 'var(--color-text)' }}
                        cursor={{ stroke: 'var(--color-primary)', strokeWidth: 2 }}
                        formatter={(value, name) => {
                            if (name === 'avgScore') return [`${value}/5`, 'Daily average'];
                            return [value, name];
                        }}
                        labelFormatter={(label, payload) => {
                            const entry = payload && payload[0] ? payload[0].payload : null;
                            const mood = entry?.dominantMood ? ` | Mostly: ${entry.dominantMood}` : '';
                            return `${label}${mood}`;
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="avgScore"
                        stroke="var(--color-primary)"
                        strokeWidth={4}
                        dot={{ r: 4, fill: 'var(--color-primary)', strokeWidth: 2, stroke: 'var(--color-white)' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MoodTrendChart;
