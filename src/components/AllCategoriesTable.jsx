import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function AllCategoriesTable({
  categories = [],
  onEdit,
  onDelete,
  canWrite = false,
  canDelete = false,
}) {
  const showActions = canWrite || canDelete;

  return (
    <div className="mt-6 overflow-x-auto bg-white shadow-sm rounded-xl">
      <table className="w-full text-sm">
        <thead className="text-left text-gray-600 border-b">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Description</th>
            <th className="p-4">Items</th>
            {showActions && <th className="p-4">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {(categories || []).map((cat) => (
            <tr key={cat.id ?? cat.name} className="border-b last:border-none">
              <td className="p-4 font-medium">{cat.name}</td>
              <td className="p-4">{cat.desc}</td>
              <td className="p-4">{cat.items}</td>

              {showActions && (
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {canWrite && (
                      <button
                        type="button"
                        onClick={() => onEdit?.(cat)}
                        className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        <FiEdit size={16} />
                        Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete?.(cat)}
                        className="p-2 text-red-500 border rounded-lg hover:bg-red-50"
                        aria-label="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}