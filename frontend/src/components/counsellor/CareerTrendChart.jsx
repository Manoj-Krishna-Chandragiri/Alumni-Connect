import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CareerTrendChart = ({ data, title = 'Career Trends' }) => {
  // Default data if none provided
  const chartData = data || [
    { month: 'Jan', placements: 45, internships: 30, higherStudies: 15 },
    { month: 'Feb', placements: 52, internships: 35, higherStudies: 18 },
    { month: 'Mar', placements: 48, internships: 42, higherStudies: 20 },
    { month: 'Apr', placements: 61, internships: 38, higherStudies: 22 },
    { month: 'May', placements: 55, internships: 45, higherStudies: 25 },
    { month: 'Jun', placements: 67, internships: 50, higherStudies: 28 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="placements"
            name="Placements"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: '#6366f1' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="internships"
            name="Internships"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="higherStudies"
            name="Higher Studies"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CareerTrendChart;
