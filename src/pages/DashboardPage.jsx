import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/card";
import {
  Package,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { authFetch, logout } from "../lib/auth";

const API_BASE = "http://127.0.0.1:8000";

function toMoney(n) {
  const x = Number(n ?? 0);
  return Number.isFinite(x) ? x : 0;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    monthlySales: 0,
    pendingOrders: 0,
    monthlySalesDeltaPct: null,
  });

  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [stockLevelData, setStockLevelData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setLoadError("");

        const res = await authFetch(`${API_BASE}/api/dashboard/overview/`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to load dashboard (${res.status})`);
        const json = await res.json();

        setStats({
          totalItems: Number(json?.stats?.totalItems ?? 0),
          lowStockItems: Number(json?.stats?.lowStockItems ?? 0),
          monthlySales: toMoney(json?.stats?.monthlySales),
          pendingOrders: Number(json?.stats?.pendingOrders ?? 0),
          monthlySalesDeltaPct:
            json?.stats?.monthlySalesDeltaPct == null
              ? null
              : Number(json.stats.monthlySalesDeltaPct),
        });

        setSalesData(Array.isArray(json?.salesData) ? json.salesData : []);
        setCategoryData(Array.isArray(json?.categoryData) ? json.categoryData : []);
        setStockLevelData(Array.isArray(json?.stockLevelData) ? json.stockLevelData : []);
        setLowStockItems(Array.isArray(json?.lowStockItems) ? json.lowStockItems : []);
      } catch (e) {
        if (e?.name !== "AbortError")
          setLoadError(e?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const monthlyDeltaLabel = useMemo(() => {
    if (stats.monthlySalesDeltaPct == null) return null;
    const pct = stats.monthlySalesDeltaPct;
    const sign = pct >= 0 ? "+" : "";
    return `${sign}${pct.toFixed(1)}% from last month`;
  }, [stats.monthlySalesDeltaPct]);

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
        <div>
          <h2 className="mb-1 text-3xl font-bold">Dashboard</h2>
          <p className="text-gray-500">Overview of your garage inventory</p>
          {loading && (
            <div className="mt-2 text-sm text-gray-600">Loading...</div>
          )}
          {loadError && (
            <div className="mt-2 text-sm text-red-600">{loadError}</div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Total Items</CardTitle>
              <Package className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {Number(stats.totalItems).toLocaleString()}
              </div>
              <p className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <TrendingUp className="w-3 h-3 text-green-600" /> Live from backend
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Low Stock Items</CardTitle>
              <TrendingDown className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {Number(stats.lowStockItems)}
              </div>
              <p className="mt-1 text-xs text-gray-500">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Monthly Sales</CardTitle>
              <DollarSign className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${toMoney(stats.monthlySales).toFixed(2)}
              </div>
              <p className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <TrendingUp className="w-3 h-3 text-green-600" />{" "}
                {monthlyDeltaLabel ?? "This month"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Pending Orders</CardTitle>
              <ShoppingCart className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {Number(stats.pendingOrders)}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Pending / Approved / Shipped
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Sales Trend</CardTitle>
              <CardDescription className="text-gray-500">
                Last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderColor: "#e5e7eb",
                      color: "#111827",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Inventory by Category</CardTitle>
              <CardDescription className="text-gray-500">
                Distribution of spare parts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderColor: "#e5e7eb",
                      color: "#111827",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Stock Levels */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Stock Levels by Category</CardTitle>
            <CardDescription className="text-gray-500">
              Inventory status across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stockLevelData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="category"
                  stroke="#6b7280"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#e5e7eb",
                    color: "#111827",
                  }}
                />
                <Bar
                  dataKey="inStock"
                  fill="#10b981"
                  name="In Stock"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="lowStock"
                  fill="#f59e0b"
                  name="Low Stock"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="outOfStock"
                  fill="#ef4444"
                  name="Out of Stock"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-gray-900">Low Stock Alerts</CardTitle>
            </div>
            <CardDescription className="text-gray-500">
              Items that need restocking
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Current:{" "}
                        <span className="font-semibold text-orange-600">
                          {item.stock}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">Min: {item.minStock}</p>
                    </div>

                    <div className="w-24 h-2 overflow-hidden bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            item.minStock > 0
                              ? (item.stock / item.minStock) * 100
                              : 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {!loading && !loadError && lowStockItems.length === 0 && (
                <div className="text-sm text-gray-600">
                  No low-stock alerts right now.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
