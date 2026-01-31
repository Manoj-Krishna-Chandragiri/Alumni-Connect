import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const AnalyticsCard = ({
  title,
  value,
  previousValue,
  suffix = '',
  icon: Icon,
  color = 'blue',
  description,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  const percentChange = previousValue
    ? (((value - previousValue) / previousValue) * 100).toFixed(1)
    : null;

  const getTrendIcon = () => {
    if (!percentChange) return <FiMinus className="w-4 h-4" />;
    if (parseFloat(percentChange) > 0) return <FiTrendingUp className="w-4 h-4" />;
    if (parseFloat(percentChange) < 0) return <FiTrendingDown className="w-4 h-4" />;
    return <FiMinus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!percentChange) return 'text-gray-500';
    if (parseFloat(percentChange) > 0) return 'text-green-600';
    if (parseFloat(percentChange) < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix && <span className="text-lg text-gray-500 ml-1">{suffix}</span>}
          </p>
          
          {percentChange && (
            <div className={`flex items-center gap-1 mt-2 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {Math.abs(parseFloat(percentChange))}%
              </span>
              <span className="text-sm text-gray-500">vs last period</span>
            </div>
          )}
          
          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCard;
