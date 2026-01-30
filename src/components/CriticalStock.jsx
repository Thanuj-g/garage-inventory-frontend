import React, { useEffect, useState } from "react";
import { authFetch } from "../lib/auth";

const API_BASE = "http://127.0.0.1:8000";

export default function CriticalStock({ limit = 10 }) {
  const [criticalItems, setCriticalItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setLoadError("");

        const qs = new URLSearchParams();
        qs.set("limit", String(limit));

        const res = await authFetch(
          `${API_BASE}/api/stock-tracking/critical/?${qs.toString()}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const json = await res.json();
        setCriticalItems(Array.isArray(json) ? json : []);
      } catch (e) {
        if (e?.name !== "AbortError")
          setLoadError(e?.message || "Failed to load critical stock");
      }
    })();

    return () => controller.abort();
  }, [limit]);

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

      {loading && (
        <div className="text-sm text-gray-700">Loading critical items...</div>
      )}
      {loadError && <div className="text-sm text-red-700">{loadError}</div>}

      {!loading && !loadError && criticalItems.length === 0 && (
        <div className="text-sm text-gray-700">No critical items right now.</div>
      )}

      <div className="space-y-4">
        {criticalItems.map((item) => (
          <div
            key={item.id ?? item.code}
            className="flex items-center justify-between p-4 bg-white border border-red-200 rounded-lg shadow-sm"
          >
            <div>
              <p className="font-semibold text-red-700">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.code} - {item.category}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Current:{" "}
                <span className="font-medium">{item.current}</span> | Required:{" "}
                <span className="font-medium">{item.required}</span>
              </p>
            </div>

            <button
              type="button"
              className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
              onClick={() => {
                // Hook up to your real reorder flow later (PO creation, vendor email, etc.)
                window.alert(`Reorder: ${item.code}`);
              }}
            >
              Reorder Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}