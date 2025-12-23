import React from "react";
import { FiSearch, FiFilter } from "react-icons/fi";

export default function SearchFilter({ onSearch, onFilter }) {
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

      <button
        onClick={onFilter}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm"
      >
        <FiFilter size={18} />
        All Categories
      </button>
    </div>
  );
}