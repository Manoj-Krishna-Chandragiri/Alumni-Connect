import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { validateRollNumber, parseRollNumber } from '../../utils/rollNumberUtils';

const RollNumberInput = ({ value, onChange, onValidationChange, className = '' }) => {
  const [validationState, setValidationState] = useState({ isValid: false, error: null });
  const [info, setInfo] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value) {
      const validation = validateRollNumber(value);
      setValidationState(validation);

      if (validation.isValid) {
        const parsed = parseRollNumber(value);
        setInfo(parsed);
      } else {
        setInfo(null);
      }

      // Notify parent component
      if (onValidationChange) {
        onValidationChange(validation.isValid);
      }
    } else {
      setValidationState({ isValid: false, error: null });
      setInfo(null);
      if (onValidationChange) {
        onValidationChange(false);
      }
    }
  }, [value, onValidationChange]);

  const handleChange = (e) => {
    const upperValue = e.target.value.toUpperCase();
    onChange(upperValue);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="e.g., 22BQ1A4225"
          maxLength={10}
          className={`
            w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2
            ${
              value
                ? validationState.isValid
                  ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                  : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }
            ${className}
          `}
        />
        {value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {validationState.isValid ? (
              <FiCheck className="w-5 h-5 text-green-500" />
            ) : (
              <FiX className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>

      {/* Validation Error */}
      {value && !validationState.isValid && validationState.error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <FiX className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{validationState.error}</p>
        </div>
      )}

      {/* Parsed Information */}
      {value && validationState.isValid && info && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <FiCheck className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">Valid Roll Number</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
            <div>
              <span className="font-medium">Year:</span> {info.year}
            </div>
            <div>
              <span className="font-medium">Entry:</span> {info.entryType}
            </div>
            <div className="col-span-2">
              <span className="font-medium">Branch:</span> {info.branchFull}
            </div>
            <div>
              <span className="font-medium">Student #:</span> {info.actualStudentNumber}
            </div>
          </div>
        </div>
      )}

      {/* Format Help (only show when focused and no value) */}
      {isFocused && !value && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <FiInfo className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">Format: YYBQXABC##</p>
            <ul className="list-disc list-inside space-y-0.5 ml-1">
              <li>YY: Year (e.g., 22 for 2022)</li>
              <li>BQ: Constant</li>
              <li>X: 1=Regular, 5=Lateral Entry</li>
              <li>A: Constant</li>
              <li>BC: Branch code</li>
              <li>##: Student number</li>
            </ul>
            <p className="mt-2">Example: 22BQ1A4225, 23BQ5A0508</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RollNumberInput;
