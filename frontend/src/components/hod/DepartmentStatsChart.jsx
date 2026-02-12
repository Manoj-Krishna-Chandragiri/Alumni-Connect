import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DepartmentStatsChart = ({ data, title = 'Department Statistics' }) => {
  // Default data if none provided
  const chartData = data || [
    { department: 'CSE', students: 450, alumni: 1200, placements: 85 },
    { department: 'ECE', students: 380, alumni: 980, placements: 78 },
    { department: 'ME', students: 320, alumni: 850, placements: 72 },
    { department: 'CE', students: 280, alumni: 720, placements: 68 },
    { department: 'EE', students: 250, alumni: 650, placements: 75 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="department" 
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
          <Bar
            dataKey="students"
            name="Current Students"
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="alumni"
            name="Total Alumni"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="placements"
            name="Placement %"
            fill="#f59e0b"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentStatsChart;
