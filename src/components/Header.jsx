import React from "react";
import { FiPlus } from "react-icons/fi";

export default function Header({ onAdd }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-gray-500">Manage all spare parts and consumables</p>
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        <FiPlus size={18} />
        Add New Item
      </button>
    </div>
  );
}