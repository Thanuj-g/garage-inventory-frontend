import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex gap-3">
      <button onClick={onEdit} className="text-gray-600 hover:text-blue-600" aria-label="Edit">
        <FiEdit size={18} />
      </button>
      <button onClick={onDelete} className="text-red-500 hover:text-red-700" aria-label="Delete">
        <FiTrash2 size={18} />
      </button>
    </div>
  );
}