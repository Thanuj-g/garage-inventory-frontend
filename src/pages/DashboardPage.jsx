import React, { useState } from "react";
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

const salesData = [
  { month: "Jan", sales: 4500 },
  { month: "Feb", sales: 5200 },
  { month: "Mar", sales: 4800 },
  { month: "Apr", sales: 6300 },
  { month: "May", sales: 7100 },
  { month: "Jun", sales: 6800 },
];

const categoryData = [
  { name: "Engine Parts", value: 35, color: "#3b82f6" },
  { name: "Brake System", value: 25, color: "#10b981" },
  { name: "Oils & Fluids", value: 20, color: "#f59e0b" },
  { name: "Electrical", value: 12, color: "#8b5cf6" },
  { name: "Accessories", value: 5, color: "#ec4899" },
  { name: "Others", value: 3, color: "#6b7280" },
];

const stockLevelData = [
  { category: "Engine Parts", inStock: 245, lowStock: 12, outOfStock: 3 },
  { category: "Brake System", inStock: 156, lowStock: 8, outOfStock: 2 },
  { category: "Oils & Fluids", inStock: 189, lowStock: 15, outOfStock: 1 },
  { category: "Electrical", inStock: 98, lowStock: 5, outOfStock: 0 },
  { category: "Filters", inStock: 134, lowStock: 7, outOfStock: 1 },
  { category: "Accessories", inStock: 32, lowStock: 0, outOfStock: 0 },
];

const lowStockItems = [
  { id: 1, name: "Engine Oil 5W-30", stock: 5, minStock: 20, category: "Oils" },
  {
    id: 2,
    name: "Brake Pads - Front",
    stock: 8,
    minStock: 15,
    category: "Brakes",
  },
  { id: 3, name: "Air Filter", stock: 3, minStock: 10, category: "Engine" },
  { id: 4, name: "Spark Plugs", stock: 12, minStock: 25, category: "Engine" },
  { id: 5, name: "Coolant 5L", stock: 6, minStock: 15, category: "Fluids" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          navigate(`/${page}`);
        }}
        onLogout={() => navigate("/")}
      />

      <main className="flex-1 min-h-screen p-6 space-y-6 overflow-y-auto text-gray-900 bg-gray-50">
        {/* Header */}
        <div>
          <h2 className="mb-1 text-3xl font-bold">Dashboard</h2>
          <p className="text-gray-500">Overview of your garage inventory</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Total Items</CardTitle>
              <Package className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">1,247</div>
              <p className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <TrendingUp className="w-3 h-3 text-green-600" /> +12% from last
                month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Low Stock Items</CardTitle>
              <TrendingDown className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">23</div>
              <p className="mt-1 text-xs text-gray-500">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Monthly Sales</CardTitle>
              <DollarSign className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">$6,800</div>
              <p className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <TrendingUp className="w-3 h-3 text-green-600" /> +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Pending Orders</CardTitle>
              <ShoppingCart className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">7</div>
              <p className="mt-1 text-xs text-gray-500">3 arriving this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Sales Trend</CardTitle>
              <CardDescription className="text-gray-500">
                Monthly sales performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
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
                      backgroundColor: "#ffffff",
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
              Overview of inventory status across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stockLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="category" stroke="#6b7280" tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                    color: "#111827",
                  }}
                />
                <Bar dataKey="inStock" fill="#10b981" name="In Stock" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lowStock" fill="#f59e0b" name="Low Stock" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outOfStock" fill="#ef4444" name="Out of Stock" radius={[4, 4, 0, 0]} />
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
                          width: `${Math.min(100, (item.stock / item.minStock) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
