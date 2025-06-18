import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface MoodChartData {
  date: string;
  mood: 'happy' | 'motivated' | 'tired' | 'stressed' | 'sad';
}

interface MoodChartProps {
  data: MoodChartData[];
}

const moodMap: Record<MoodChartData['mood'], number> = {
  happy: 5,
  motivated: 4,
  tired: 3,
  stressed: 2,
  sad: 1,
};

const moodLabels: Record<number, MoodChartData['mood']> = {
  5: 'happy',
  4: 'motivated',
  3: 'tired',
  2: 'stressed',
  1: 'sad',
};

export const MoodChart: React.FC<MoodChartProps> = ({ data }) => {
  const chartData = data.map((d) => ({ ...d, moodValue: moodMap[d.mood] }));

  return (
    <div className="w-full h-64 bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-2 text-slate-700">Mood Journey</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tickFormatter={(v: number) => moodLabels[v]} />
          <Tooltip formatter={(value: number) => [moodLabels[value as number], 'Mood']} />
          <Line type="monotone" dataKey="moodValue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
