import { FiCheck, FiX, FiMinus } from 'react-icons/fi';

const ReasonList = ({ reasons, type = 'positive' }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'positive':
        return <FiCheck className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <FiX className="w-4 h-4 text-red-500" />;
      default:
        return <FiMinus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-100';
      case 'negative':
        return 'bg-red-50 border-red-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getBackgroundColor(type)}`}>
      <h4 className="font-medium text-gray-900 mb-3">
        {type === 'positive' ? 'Strengths' : type === 'negative' ? 'Areas to Improve' : 'Notes'}
      </h4>
      <ul className="space-y-2">
        {reasons.map((reason, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="flex-shrink-0 mt-0.5">{getIcon(type)}</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReasonList;
