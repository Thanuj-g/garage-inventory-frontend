import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function AllCategoriesTable({
  categories = [],
  onEdit,
  onDelete,
}) {
  return (
    <div className="p-6 mt-8 bg-white shadow-sm rounded-xl">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">All Categories</h2>
        <p className="text-gray-500">Complete list of inventory categories</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-3">Category Name</th>
              <th className="py-3">Description</th>
              <th className="py-3">Items Count</th>
              <th className="py-3">Color</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat.name} className="transition border-b hover:bg-gray-50">
                <td className="flex items-center gap-3 py-4 font-medium">
                  <span className={`w-3 h-3 rounded-full ${cat.color}`} />
                  {cat.name}
                </td>

                <td className="py-4 text-gray-600">{cat.desc}</td>

                <td className="py-4">
                  <span className="px-3 py-1 text-sm bg-gray-100 rounded-full">
                    {cat.items ?? 0}
                  </span>
                </td>

                <td className="py-4">
                  <div className={`w-10 h-10 rounded-lg ${cat.color}`} />
                </td>

                <td className="py-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="text-gray-600 hover:text-blue-600"
                      onClick={() => onEdit?.(cat)}
                      aria-label={`Edit ${cat.name}`}
                    >
                      <FiEdit size={18} />
                    </button>

                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDelete?.(cat)}
                      aria-label={`Delete ${cat.name}`}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}