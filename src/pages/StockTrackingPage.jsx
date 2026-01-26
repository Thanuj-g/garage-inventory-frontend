import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { Search, AlertTriangle, TrendingDown, Package } from "lucide-react";
import CriticalStock from "../components/CriticalStock";
import { authFetch, logout } from "../lib/auth";

const API_BASE = "http://127.0.0.1:8000";

function statusPillClasses(status) {
  switch (status) {
    case "Critical":
      return "text-red-600 bg-red-100";
    case "Low":
      return "text-orange-600 bg-orange-100";
    case "Healthy":
      return "text-green-600 bg-green-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
}

export default function StockTrackingPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("stock-tracking");
  const [query, setQuery] = useState("");

  const [items, setItems] = useState([]);
  const [overview, setOverview] = useState({ critical: 0, low: 0, healthy: 0 });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setLoadError("");

        // Load stats + table data in parallel
        const qs = new URLSearchParams();
        if (query.trim()) qs.set("search", query.trim());

        const [overviewRes, itemsRes] = await Promise.all([
          authFetch(`${API_BASE}/api/stock-tracking/overview/`, { signal: controller.signal }),
          authFetch(`${API_BASE}/api/stock-tracking/items/?${qs.toString()}`, { signal: controller.signal }),
        ]);

        if (!overviewRes.ok) throw new Error(`Failed to load overview (${overviewRes.status})`);
        if (!itemsRes.ok) throw new Error(`Failed to load items (${itemsRes.status})`);

        const overviewJson = await overviewRes.json();
        const itemsJson = await itemsRes.json();

        setOverview({
          critical: Number(overviewJson?.critical ?? 0),
          low: Number(overviewJson?.low ?? 0),
          healthy: Number(overviewJson?.healthy ?? 0),
        });
        setItems(Array.isArray(itemsJson) ? itemsJson : []);
      } catch (e) {
        if (e?.name !== "AbortError") setLoadError(e?.message || "Failed to load stock tracking data");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [query]);

  // Backend already filters by `search`, but keep this so UI behaves even if backend changes.
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter(
      (it) =>
        String(it.part || "").toLowerCase().includes(q) ||
        String(it.name || "").toLowerCase().includes(q) ||
        String(it.category || "").toLowerCase().includes(q)
    );
  }, [items, query]);

  const stats = useMemo(() => {
    return [
      {
        title: "Critical Stock",
        value: overview.critical,
        description: "Items need immediate restock",
        icon: AlertTriangle,
        bg: "bg-red-50",
        text: "text-red-600",
      },
      {
        title: "Low Stock",
        value: overview.low,
        description: "Items approaching reorder point",
        icon: TrendingDown,
        bg: "bg-orange-50",
        text: "text-orange-600",
      },
      {
        title: "Healthy Stock",
        value: overview.healthy,
        description: "Items with adequate stock",
        icon: Package,
        bg: "bg-green-50",
        text: "text-green-600",
      },
    ];
  }, [overview]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          navigate(`/${page}`);
        }}
        onLogout={() => {
          logout();
          navigate("/login", { replace: true });
        }}
      />

      <main className="flex-1 min-h-screen p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Stock Tracking</h1>
          <p className="text-gray-500">Monitor inventory levels and get alerts</p>

          {loading && <div className="mt-2 text-sm text-gray-600">Loading...</div>}
          {loadError && <div className="mt-2 text-sm text-red-600">{loadError}</div>}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-3">
          {stats.map((stat, i) => (
            <div key={i} className={`rounded-2xl border p-6 ${stat.bg}`}>
              <div className="flex items-center gap-3 mb-4">
                <stat.icon className={`${stat.text}`} />
                <h3 className="font-semibold">{stat.title}</h3>
              </div>
              <p className={`text-4xl font-bold ${stat.text}`}>{stat.value}</p>
              <p className={`mt-2 text-sm ${stat.text}`}>{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="p-6 bg-white shadow-sm rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Stock Levels</h2>
              <p className="text-sm text-gray-500">
                Current inventory status for all items
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search items..."
                className="py-2 pl-10 pr-4 text-sm border rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b">
                <tr className="text-gray-500">
                  <th className="py-3">Part Number</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Stock Level</th>
                  <th>Status</th>
                  <th>Last Restocked</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item, i) => (
                  <tr key={`${item.part}-${i}`} className="border-b last:border-none">
                    <td className="py-4 font-medium">{item.part}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>
                      <span className="font-semibold">{item.stock}</span>
                      <div className="text-xs text-gray-400">Min: {item.min}</div>
                    </td>
                    <td className="w-40">
                      <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-gray-800"
                          style={{ width: `${Number(item.percent ?? 0)}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {Number(item.percent ?? 0)}%
                      </div>
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${statusPillClasses(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{item.date}</td>
                  </tr>
                ))}

                {filteredItems.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="py-8 text-gray-500">
                      No items match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical Stock section (added below) */}
        <div className="mt-8">
          <CriticalStock />
        </div>
      </main>
    </div>
  );
}