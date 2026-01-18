import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/card";
import { Button } from "../components/button";
import { Clock, CheckCircle, Truck, Plus, ChevronDown } from "lucide-react";
import CreatePurchaseOrderModal from "../components/CreatePurchaseOrderModal";

const initialOrders = [
  {
    orderNumber: "PO-2024-001",
    supplier: "LubeTech Industries",
    orderDate: "12/10/2024",
    expectedDate: "12/20/2024",
    items: "Engine Oil 5W-30 (50 units)",
    amount: 1299.50,
    status: "Shipped",
  },
  {
    orderNumber: "PO-2024-002",
    supplier: "BrakeMax Corp",
    orderDate: "12/12/2024",
    expectedDate: "12/22/2024",
    items: "Brake Pads - Front (30 units)",
    amount: 2699.70,
    status: "Approved",
  },
  {
    orderNumber: "PO-2024-003",
    supplier: "FilterMax Solutions",
    orderDate: "12/13/2024",
    expectedDate: "12/18/2024",
    items: "Air Filters (40 units)",
    amount: 620.00,
    status: "Delivered",
  },
  {
    orderNumber: "PO-2024-004",
    supplier: "SparkPlus Distribution",
    orderDate: "12/14/2024",
    expectedDate: "12/25/2024",
    items: "Spark Plugs Set (60 units)",
    amount: 1979.40,
    status: "Pending",
  },
  {
    orderNumber: "PO-2024-005",
    supplier: "PowerCell Batteries",
    orderDate: "12/15/2024",
    expectedDate: "12/28/2024",
    items: "Car Battery 12V (15 units)",
    amount: 2249.85,
    status: "Approved",
  },
];

function formatMMDDYYYY(dateLike) {
  // dateLike: "yyyy-mm-dd"
  if (!dateLike) return "";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return dateLike;

  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function nextPONumber(existing) {
  const year = new Date().getFullYear();
  const prefix = `PO-${year}-`;

  const nums = existing
    .map((o) => String(o.orderNumber || ""))
    .filter((n) => n.startsWith(prefix))
    .map((n) => Number(n.slice(prefix.length)))
    .filter((n) => Number.isFinite(n));

  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

export default function PurchaseOrdersPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("purchase-orders");
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const supplierOptions = useMemo(() => {
    const set = new Set(orders.map((o) => o.supplier).filter(Boolean));
    return Array.from(set).sort();
  }, [orders]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleCreateOrder = (payload) => {
    const newOrder = {
      orderNumber: nextPONumber(orders),
      supplier: payload.supplier,
      orderDate: formatMMDDYYYY(new Date().toISOString().slice(0, 10)),
      expectedDate: formatMMDDYYYY(payload.expectedDate),
      items: payload.items,
      amount: Number(payload.amount) || 0,
      status: "Pending",
      notes: payload.notes,
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  // Calculate statistics
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const approvedCount = orders.filter((o) => o.status === "Approved").length;
  const inTransitCount = orders.filter((o) => o.status === "Shipped").length;
  const totalValue = orders.reduce((sum, order) => sum + order.amount, 0);

  const getStatusBadge = (status) => {
    const badges = {
      Shipped: (
        <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
          <Truck className="w-3 h-3" />
          Shipped
        </span>
      ),
      Approved: (
        <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
          <CheckCircle className="w-3 h-3" />
          Approved
        </span>
      ),
      Delivered: (
        <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full text-emerald-700 bg-emerald-100">
          <CheckCircle className="w-3 h-3" />
          Delivered
        </span>
      ),
      Pending: (
        <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      ),
    };
    return badges[status] || status;
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
            <p className="text-gray-500">Manage supplier orders and restocking</p>
          </div>

          <Button
            type="button"
            className="flex items-center gap-2"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create Order
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Approved Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{approvedCount}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">In Transit</p>
                  <p className="text-3xl font-bold text-gray-900">{inTransitCount}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Order Value</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${totalValue.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Active orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Purchase Orders</CardTitle>
                <CardDescription>
                  Track all purchase orders and their status
                </CardDescription>
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                <ChevronDown className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Order Number
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Supplier
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Order Date
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Expected Date
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Items
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.orderNumber}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {order.supplier}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {order.orderDate}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {order.expectedDate}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {order.items}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                        ${order.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <CreatePurchaseOrderModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateOrder}
          supplierOptions={supplierOptions}
        />
      </main>
    </div>
  );
}
