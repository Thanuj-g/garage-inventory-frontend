import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function ActionButtons({
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}) {
  return (
    <div className="flex items-center gap-3">
      {canEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
        >
          <FiEdit size={16} />
          Edit
        </button>
      )}

      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="p-2 text-red-600 border rounded-lg hover:bg-red-50"
          aria-label="Delete"
        >
          <FiTrash2 size={18} />
        </button>
      )}
    </div>
  );
}