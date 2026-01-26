import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/card";
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

const weeklyData = [
  { day: "Mon", sales: 280, usage: 40 },
  { day: "Tue", sales: 420, usage: 60 },
  { day: "Wed", sales: 320, usage: 30 },
  { day: "Thu", sales: 560, usage: 50 },
  { day: "Fri", sales: 680, usage: 70 },
  { day: "Sat", sales: 420, usage: 20 },
  { day: "Sun", sales: 180, usage: 10 },
];

const initialTransactionData = [
  {
    id: "TR-001",
    item: "Engine Oil 5W-30",
    qty: 3,
    price: 25.99,
    total: 77.97,
    customer: "John Doe - Honda Civic",
    type: "Sale",
  },
  {
    id: "TR-102",
    item: "Brake Pads - Front",
    qty: 1,
    price: 89.99,
    total: 89.99,
    customer: "Sarah Smith - Toyota Camry",
    type: "Sale",
  },
  {
    id: "TR-015",
    item: "Air Filter",
    qty: 2,
    price: 15.5,
    total: 31.0,
    customer: "Mike Johnson - Ford F-150",
    type: "Sale",
  },
  {
    id: "TR-008",
    item: "Coolant 5L",
    qty: 1,
    price: 18.75,
    total: 18.75,
    customer: "Internal Workshop",
    type: "Usage",
  },
  {
    id: "TR-205",
    item: "Brake Fluid DOT 4",
    qty: 2,
    price: 12.99,
    total: 25.98,
    customer: "Emma Wilson - Mazda CX-5",
    type: "Sale",
  },
  {
    id: "TR-022",
    item: "Spark Plugs Set",
    qty: 1,
    price: 32.99,
    total: 32.99,
    customer: "David Brown - BMW 3 Series",
    type: "Sale",
  },
  {
    id: "TR-101",
    item: "Car Battery 12V",
    qty: 1,
    price: 149.99,
    total: 149.99,
    customer: "Lisa Anderson - Nissan Altima",
    type: "Sale",
  },
  {
    id: "TR-401",
    item: "Tire 205/55R16",
    qty: 4,
    price: 95.0,
    total: 380.0,
    customer: "Robert Taylor - Hyundai Elantra",
    type: "Sale",
  },
];

function nextTxnId(existing) {
  const nums = existing
    .map((t) => String(t.id || ""))
    .filter((id) => id.startsWith("TR-"))
    .map((id) => Number(id.slice(3)))
    .filter((n) => Number.isFinite(n));

  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `TR-${String(next).padStart(3, "0")}`;
}

export default function SalesAndUsagePage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("sales");
  const [filterType, setFilterType] = useState("All Transactions");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactionData);

  const filteredData = useMemo(() => {
    return transactions.filter((item) => {
      if (filterType === "Sales Only") return item.type === "Sale";
      if (filterType === "Usage Only") return item.type === "Usage";
      return true;
    });
  }, [transactions, filterType]);

  const handleRecordTransaction = (payload) => {
    const newTxn = {
      id: nextTxnId(transactions),
      item: payload.item,
      qty: payload.qty,
      price: payload.price,
      total: Number((payload.qty * payload.price).toFixed(2)),
      customer: payload.customer || (payload.type === "Usage" ? "Internal Workshop" : ""),
      type: payload.type,
      partNumber: payload.partNumber, // optional (kept for later)
    };

    setTransactions((prev) => [newTxn, ...prev]);
  };

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
        <div className="flex items-start justify-between">
          <div>
            <h2 className="mb-1 text-3xl font-bold">Sales &amp; Usage Tracking</h2>
            <p className="text-gray-500">Monitor sales and internal usage</p>
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

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-3xl font-bold">
                <span className="text-xl font-normal text-green-600">$</span>787.92
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
                <ShoppingCart className="w-6 h-6 text-blue-600" /> 0
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
                <Package className="w-6 h-6 text-purple-600" /> 14
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
                <TrendingUp className="w-5 h-5 text-orange-600" /> $112.56
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Weekly Sales vs Usage</CardTitle>
            <p className="text-sm text-gray-500">
              Sales revenue and internal usage over the week
            </p>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
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
                <Bar dataKey="sales" name="Sales ($)" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="usage" name="Usage ($)" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Transactions Table */}
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
                      <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        ${item.total.toFixed(2)}
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
