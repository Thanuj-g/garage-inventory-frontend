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
      {/* Sidebar with vertical divider */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onLogout={() => alert("Logged out")}
        className="bg-blue-900 border-r border-white/30"
      />

      {/* Main dashboard content */}
      <main className="flex-1 bg-slate-800 text-white p-6 space-y-6 overflow-y-auto">
        {/* Header */}
        <div>
          <h2 className="text-3xl mb-1">Dashboard</h2>
          <p className="text-blue-200">Overview of your garage inventory</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-500/20 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-sm">Total Items</CardTitle>
              <Package className="w-4 h-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">1,247</div>
              <p className="text-blue-100 text-xs mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-400" /> +12% from last
                month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/20 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-sm">
                Low Stock Items
              </CardTitle>
              <TrendingDown className="w-4 h-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">23</div>
              <p className="text-blue-100 text-xs mt-1">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/20 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-sm">
                Monthly Sales
              </CardTitle>
              <DollarSign className="w-4 h-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">$6,800</div>
              <p className="text-blue-100 text-xs mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-400" /> +8% from last
                month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/20 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-sm">
                Pending Orders
              </CardTitle>
              <ShoppingCart className="w-4 h-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">7</div>
              <p className="text-blue-100 text-xs mt-1">3 arriving this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-blue-500/20 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-white">Sales Trend</CardTitle>
              <CardDescription className="text-blue-100">
                Monthly sales performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                  <XAxis dataKey="month" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", color: "#fff" }}
                  />
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

          <Card className="bg-blue-500/20 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-white">
                Inventory by Category
              </CardTitle>
              <CardDescription className="text-blue-100">
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
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Stock Levels */}
        <Card className="bg-blue-500/20 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white">
              Stock Levels by Category
            </CardTitle>
            <CardDescription className="text-blue-100">
              Overview of inventory status across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stockLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                <XAxis dataKey="category" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", color: "#fff" }}
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
        <Card className="bg-blue-600/20 backdrop-blur-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-orange-400" />
              <CardTitle className="text-white">Low Stock Alerts</CardTitle>
            </div>
            <CardDescription className="text-blue-100">
              Items that need restocking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-blue-100">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-blue-100">
                        Current:{" "}
                        <span className="font-medium text-orange-400">
                          {item.stock}
                        </span>
                      </p>
                      <p className="text-sm text-blue-100">
                        Min: {item.minStock}
                      </p>
                    </div>
                    <div className="w-24 bg-blue-500/20 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-400 h-full rounded-full"
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
