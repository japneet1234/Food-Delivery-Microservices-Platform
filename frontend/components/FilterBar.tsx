'use client';

import { FiFilter, FiArrowDown, FiArrowUp } from 'react-icons/fi';

type SortOption = 'rating-desc' | 'rating-asc' | 'name-asc' | 'name-desc';

interface FilterBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function FilterBar({ sortBy, onSortChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 text-gray-600">
        <FiFilter className="w-5 h-5" />
        <span className="font-medium">Sort by:</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onSortChange('rating-desc')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            sortBy === 'rating-desc'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center gap-1">
            Rating <FiArrowDown className="w-4 h-4" />
          </span>
        </button>
        <button
          onClick={() => onSortChange('rating-asc')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            sortBy === 'rating-asc'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center gap-1">
            Rating <FiArrowUp className="w-4 h-4" />
          </span>
        </button>
        <button
          onClick={() => onSortChange('name-asc')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            sortBy === 'name-asc'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center gap-1">
            Name A-Z <FiArrowUp className="w-4 h-4" />
          </span>
        </button>
        <button
          onClick={() => onSortChange('name-desc')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            sortBy === 'name-desc'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center gap-1">
            Name Z-A <FiArrowDown className="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  );
}

