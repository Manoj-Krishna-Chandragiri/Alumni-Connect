import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const PlacementTrendsChart = ({ data, title = 'Placement Trends (5 Years)' }) => {
  // Default data if none provided
  const chartData = data || [
    { year: '2019', placements: 820, avgPackage: 12, topPackage: 45 },
    { year: '2020', placements: 780, avgPackage: 11, topPackage: 42 },
    { year: '2021', placements: 850, avgPackage: 14, topPackage: 55 },
    { year: '2022', placements: 920, avgPackage: 16, topPackage: 65 },
    { year: '2023', placements: 980, avgPackage: 18, topPackage: 75 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAvgPackage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="year" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            yAxisId="left"
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
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
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="placements"
            name="Total Placements"
            stroke="#6366f1"
            fillOpacity={1}
            fill="url(#colorPlacements)"
            strokeWidth={2}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="avgPackage"
            name="Avg Package (LPA)"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorAvgPackage)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlacementTrendsChart;
