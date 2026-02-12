import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const AdvancedSearch = ({
  filters = [],
  onSearch,
  placeholder = 'Search...',
  debounceMs = 500,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, activeFilters]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        search: searchTerm,
        ...activeFilters,
      });
    }
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
  };

  const activeFilterCount = Object.values(activeFilters).filter(v => v && v !== '').length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FiFilter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && filters.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.label}
                </label>
                
                {filter.type === 'select' && (
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === 'multiselect' && (
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    {filter.options?.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={(activeFilters[filter.key] || []).includes(option.value)}
                          onChange={(e) => {
                            const current = activeFilters[filter.key] || [];
                            const updated = e.target.checked
                              ? [...current, option.value]
                              : current.filter(v => v !== option.value);
                            handleFilterChange(filter.key, updated.length > 0 ? updated : undefined);
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === 'range' && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={filter.min || 0}
                      max={filter.max || 100}
                      value={activeFilters[filter.key] || filter.min || 0}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{filter.min || 0}</span>
                      <span className="font-medium text-gray-700">
                        {activeFilters[filter.key] || filter.min || 0}
                      </span>
                      <span>{filter.max || 100}</span>
                    </div>
                  </div>
                )}

                {filter.type === 'text' && (
                  <input
                    type="text"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    placeholder={filter.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}

                {filter.type === 'date' && (
                  <input
                    type="date"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            
            const filter = filters.find(f => f.key === key);
            if (!filter) return null;

            const displayValue = Array.isArray(value) 
              ? `${value.length} selected`
              : filter.options?.find(o => o.value === value)?.label || value;

            return (
              <div
                key={key}
                className="flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                <span className="font-medium">{filter.label}:</span>
                <span>{displayValue}</span>
                <button
                  onClick={() => handleFilterChange(key, undefined)}
                  className="hover:text-primary-900"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
