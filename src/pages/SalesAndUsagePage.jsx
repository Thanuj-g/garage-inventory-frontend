import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";

import {
  Plus,
  ShoppingCart,
  Package,
  TrendingUp,
  ChevronDown,
  Check,
} from "lucide-react";
import RecordTransactionModal from "../components/RecordTransactionModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { authFetch, logout } from "../lib/auth";
import { getPermissions } from "../lib/permissions"; // <-- add

const API_BASE = "http://127.0.0.1:8000";

function toMoney(n) {
  const x = Number(n ?? 0);
  return Number.isFinite(x) ? x : 0;
}

function mapTxnFromApi(t) {
  return {
    id: t.id, // TR-xxx
    item: t.item_name,
    qty: Number(t.qty ?? 0),
    price: toMoney(t.unit_price),
    total: toMoney(t.total),
    customer: t.customer ?? "",
    type: t.txn_type, // "Sale" | "Usage"
    partNumber: t.part_number ?? "",
    createdAt: t.created_at,
  };
}

function filterTypeToApiParam(filterType) {
  if (filterType === "Sales Only") return "Sale";
  if (filterType === "Usage Only") return "Usage";
  return "";
}

export default function SalesAndUsagePage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("sales");
  const [filterType, setFilterType] = useState("All Transactions");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { isStaff } = getPermissions(); // <-- add

  const [isRecordOpen, setIsRecordOpen] = useState(false);

  const [summary, setSummary] = useState({
    total_revenue: 0,
    todays_sales: 0,
    items_sold: 0,
    avg_transaction: 0,
  });

  const [weeklyData, setWeeklyData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadSummary = async (signal) => {
    const res = await authFetch(`${API_BASE}/api/sales-usage/summary/`, { signal });
    if (!res.ok) throw new Error(`Failed to load summary (${res.status})`);
    const json = await res.json();
    setSummary({
      total_revenue: toMoney(json?.total_revenue),
      todays_sales: Number(json?.todays_sales ?? 0),
      items_sold: Number(json?.items_sold ?? 0),
      avg_transaction: toMoney(json?.avg_transaction),
    });
  };

  const loadWeekly = async (signal) => {
    const res = await authFetch(`${API_BASE}/api/sales-usage/weekly/`, { signal });
    if (!res.ok) throw new Error(`Failed to load weekly data (${res.status})`);
    const json = await res.json();
    setWeeklyData(Array.isArray(json) ? json : []);
  };

  const loadTransactions = async (signal, typeParam) => {
    const qs = new URLSearchParams();
    if (typeParam) qs.set("type", typeParam);

    const res = await authFetch(
      `${API_BASE}/api/sales-usage/transactions/?${qs.toString()}`,
      { signal }
    );
    if (!res.ok) throw new Error(`Failed to load transactions (${res.status})`);
    const json = await res.json();
    setTransactions(Array.isArray(json) ? json.map(mapTxnFromApi) : []);
  };

  useEffect(() => {
    const controller = new AbortController();
    const typeParam = filterTypeToApiParam(filterType);

    (async () => {
      try {
        setLoading(true);
        setLoadError("");

        // Staff: only transaction list (no summary/cards/chart)
        // Manager/Admin: load everything
        const tasks = [loadTransactions(controller.signal, typeParam)];
        if (!isStaff) {
          tasks.push(loadSummary(controller.signal));
          tasks.push(loadWeekly(controller.signal));
        }

        await Promise.all(tasks);
      } catch (e) {
        if (e?.name !== "AbortError")
          setLoadError(e?.message || "Failed to load sales & usage data");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [filterType, isStaff]);

  const filteredData = useMemo(() => {
    return transactions.filter((item) => {
      if (filterType === "Sales Only") return item.type === "Sale";
      if (filterType === "Usage Only") return item.type === "Usage";
      return true;
    });
  }, [transactions, filterType]);

  const handleRecordTransaction = async (payload) => {
    try {
      setLoadError("");

      const res = await authFetch(`${API_BASE}/api/sales-usage/transactions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txn_type: payload.type, // "Sale" | "Usage"
          item_name: payload.item,
          part_number: payload.partNumber || "",
          qty: Number(payload.qty ?? 0),
          unit_price: Number(payload.price ?? 0),
          customer: payload.customer || "",
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to record transaction (${res.status}) ${text}`.trim());
      }

      const typeParam = filterTypeToApiParam(filterType);

      // Refresh: staff only needs transaction list; manager/admin also refresh summary/chart
      const tasks = [loadTransactions(undefined, typeParam)];
      if (!isStaff) {
        tasks.push(loadSummary(undefined));
        tasks.push(loadWeekly(undefined));
      }
      await Promise.all(tasks);

      setIsRecordOpen(false);
    } catch (e) {
      setLoadError(e?.message || "Failed to record transaction");
    }
  };

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

      <main className="flex-1 min-h-screen p-6 space-y-6 overflow-y-auto text-gray-900 bg-gray-50">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="mb-1 text-3xl font-bold">Sales &amp; Usage Tracking</h2>
            <p className="text-gray-500">Monitor sales and internal usage</p>
            {loading && <div className="mt-2 text-sm text-gray-600">Loading...</div>}
            {loadError && <div className="mt-2 text-sm text-red-600">{loadError}</div>}
            {isStaff && (
              <div className="mt-2 text-sm text-gray-600">
                Staff view: summary and charts are hidden
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsRecordOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Record Transaction
          </button>
        </div>

        {/* Info Cards (MANAGER ONLY) */}
        {!isStaff && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-3xl font-bold">
                  <span className="text-xl font-normal text-green-600">$</span>
                  {toMoney(summary.total_revenue).toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Today's Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-3xl font-bold">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />{" "}
                  {Number(summary.todays_sales ?? 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Items Sold
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-3xl font-bold">
                  <Package className="w-6 h-6 text-purple-600" />{" "}
                  {Number(summary.items_sold ?? 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Avg Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-3xl font-bold">
                  <TrendingUp className="w-5 h-5 text-orange-600" />{" "}
                  ${toMoney(summary.avg_transaction).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chart Section (MANAGER ONLY) */}
        {!isStaff && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Weekly Sales vs Usage</CardTitle>
              <p className="text-sm text-gray-500">
                Sales revenue and internal usage over the week
              </p>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={weeklyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis dataKey="day" stroke="#6b7280" tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#6b7280"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e5e7eb",
                      color: "#111827",
                    }}
                    itemStyle={{ color: "#111827" }}
                    cursor={{ fill: "#f3f4f6" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="sales"
                    name="Sales ($)"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                  <Bar
                    dataKey="usage"
                    name="Usage ($)"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Transactions Table (VISIBLE TO ALL) */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-gray-900">Transaction History</CardTitle>
              <p className="text-sm text-gray-500">Recent sales and usage records</p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-gray-700 transition-colors bg-white border border-gray-200 rounded-md hover:bg-gray-50 w-44"
              >
                <span>{filterType}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 z-20 mt-2 overflow-hidden text-sm bg-white border border-gray-200 rounded-lg shadow-lg w-52 top-full">
                  {["All Transactions", "Sales Only", "Usage Only"].map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => {
                        setFilterType(option);
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      {option}
                      {filterType === option && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-600 uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Number</th>
                    <th className="px-4 py-3">Item Name</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Unit Price</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Customer/Purpose</th>
                    <th className="px-4 py-3 rounded-r-lg">Type</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{item.id}</td>
                      <td className="px-4 py-3">{item.item}</td>
                      <td className="px-4 py-3">{item.qty}</td>
                      <td className="px-4 py-3">${toMoney(item.price).toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        ${toMoney(item.total).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.customer}</td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            "px-2 py-1 rounded-full text-xs font-medium border",
                            item.type === "Sale"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-800 border-amber-200",
                          ].join(" ")}
                        >
                          {item.type}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {!loading && !loadError && filteredData.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-sm text-gray-500">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <RecordTransactionModal
          isOpen={isRecordOpen}
          onClose={() => setIsRecordOpen(false)}
          onSubmit={handleRecordTransaction}
        />
      </main>
    </div>
  );
}
