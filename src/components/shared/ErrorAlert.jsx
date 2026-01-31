import { FiX, FiAlertCircle } from 'react-icons/fi';

const ErrorAlert = ({ message, onClose }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
