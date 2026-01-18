import React from "react";

const criticalItems = [
  {
    name: "Engine Oil 5W-30",
    code: "ENG-001",
    category: "Oils & Fluids",
    current: 5,
    required: 20,
  },
  {
    name: "Brake Pads - Front",
    code: "BRK-102",
    category: "Brake System",
    current: 8,
    required: 15,
  },
  {
    name: "Air Filter",
    code: "ENG-015",
    category: "Engine Parts",
    current: 3,
    required: 10,
  },
  {
    name: "Spark Plugs Set",
    code: "ENG-022",
    category: "Engine Parts",
    current: 12,
    required: 25,
  },
];

export default function CriticalStock() {
  return (
    <div className="p-6 border border-red-200 rounded-lg bg-red-50">
      <h2 className="flex items-center mb-4 text-lg font-semibold text-red-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M5.07 19h13.86a1 1 0 00.93-1.37l-6.93-12a1 1 0 00-1.74 0l-6.93 12A1 1 0 005.07 19z"
          />
        </svg>
        Critical Stock Items - Immediate Action Required
      </h2>

      <div className="space-y-4">
        {criticalItems.map((item) => (
          <div
            key={item.code}
            className="flex items-center justify-between p-4 bg-white border border-red-200 rounded-lg shadow-sm"
          >
            <div>
              <p className="font-semibold text-red-700">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.code} - {item.category}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Current: <span className="font-medium">{item.current}</span> |
                Required: <span className="font-medium">{item.required}</span>
              </p>
            </div>

            <button
              type="button"
              className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Reorder Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}