import { useState, useEffect } from 'react';

/**
 * Custom hook để quản lý filter
 */
export const useFilter = (items = [], initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [filtered, setFiltered] = useState(items);

  useEffect(() => {
    let result = items;

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) => {
          if (Array.isArray(value)) {
            return value.includes(item[key]);
          }
          return item[key] === value;
        });
      }
    });

    setFiltered(result);
  }, [filters, items]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    filtered,
    updateFilter,
    clearFilters,
  };
};
