import { useState } from "react";
import { Sidebar } from "../components/sidebar";
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
  AlertTriangle,
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
  { name: "Others", value: 8, color: "#6b7280" },
];

const stockLevelData = [
  { category: "Engine Parts", inStock: 245, lowStock: 12, outOfStock: 3 },
  { category: "Brake System", inStock: 156, lowStock: 8, outOfStock: 2 },
  { category: "Oils & Fluids", inStock: 189, lowStock: 15, outOfStock: 1 },
  { category: "Electrical", inStock: 98, lowStock: 5, outOfStock: 0 },
  { category: "Filters", inStock: 134, lowStock: 7, outOfStock: 1 },
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

export function DashboardPage() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onLogout={() => alert("Logged out")}
      />

      {/* Dashboard content */}
      <main className="flex-1 p-6 bg-slate-100 space-y-6 overflow-y-auto">
        {/* Header */}
        <div>
          <h2 className="text-3xl mb-1">Dashboard</h2>
          <p className="text-slate-500">Overview of your garage inventory</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Items</CardTitle>
              <Package className="w-4 h-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">1,247</div>
              <p className="text-xs text-slate-500 mt-1">
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Low Stock Items</CardTitle>
              <TrendingDown className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">23</div>
              <p className="text-xs text-slate-500 mt-1">
                <span className="text-orange-600">Requires attention</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Monthly Sales</CardTitle>
              <DollarSign className="w-4 h-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">$6,800</div>
              <p className="text-xs text-slate-500 mt-1">
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +8% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Pending Orders</CardTitle>
              <ShoppingCart className="w-4 h-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">7</div>
              <p className="text-xs text-slate-500 mt-1">
                <span className="text-slate-600">3 arriving this week</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>Monthly sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Inventory by Category</CardTitle>
              <CardDescription>Distribution of spare parts</CardDescription>
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
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Stock Levels */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Stock Levels by Category</CardTitle>
            <CardDescription>
              Overview of inventory status across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stockLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
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

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-600">In Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-slate-600">Low Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-slate-600">Out of Stock</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <CardTitle>Low Stock Alerts</CardTitle>
            </div>
            <CardDescription>Items that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm">
                        Current:{" "}
                        <span className="font-medium text-orange-600">
                          {item.stock}
                        </span>
                      </p>
                      <p className="text-sm text-slate-500">
                        Min: {item.minStock}
                      </p>
                    </div>
                    <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full"
                        style={{
                          width: `${(item.stock / item.minStock) * 100}%`,
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

export default DashboardPage;
