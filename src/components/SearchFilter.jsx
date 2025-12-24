import React from "react";
import { FiSearch, FiFilter, FiChevronDown } from "react-icons/fi";

export default function SearchFilter({
  onSearch,

  // NEW (for dropdown)
  categories = [],
  selectedCategory = "all",
  onCategoryChange,

  // keep for backward compatibility
  onFilter,
}) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="flex items-center w-full px-4 py-2 bg-white rounded-lg shadow-sm">
        <FiSearch className="mr-2 text-gray-400" size={18} />
        <input
          onChange={(e) => onSearch && onSearch(e.target.value)}
          type="text"
          placeholder="Search by name or part number..."
          className="w-full outline-none"
        />
      </div>

      {/* Category dropdown */}
      <div className="relative min-w-[220px]">
        <FiFilter
          size={18}
          className="absolute text-gray-500 -translate-y-1/2 pointer-events-none left-3 top-1/2"
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            onCategoryChange?.(e.target.value);
            // optional legacy hook
            onFilter?.(e.target.value);
          }}
          className="w-full py-2 pl-10 pr-10 bg-white border border-transparent rounded-lg shadow-sm appearance-none focus:border-blue-300 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <FiChevronDown
          size={18}
          className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2"
        />
      </div>
    </div>
  );
}