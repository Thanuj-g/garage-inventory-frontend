import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";

const API_BASE = "http://127.0.0.1:8000";

function mapFromApi(po) {
  return {
    id: po.id,
    orderNumber: po.orderNumber ?? "",
    supplier: po.supplier ?? "",
    orderDate: po.orderDate ?? "",
    expectedDate: po.expectedDate ?? "",
    items: po.items ?? "",
    amount: Number(po.amount ?? 0),
    status: po.status ?? "Pending",
    notes: po.notes ?? "",
  };
}

function mapToApi(payload) {
  return {
    orderNumber: payload.orderNumber || undefined, // backend auto-generates if missing
    supplier: payload.supplier ?? "",
    orderDate: payload.orderDate || undefined,
    expectedDate: payload.expectedDate || null,
    items: payload.items ?? "",
    amount: Number(payload.amount ?? 0),
    status: payload.status ?? "Pending",
    notes: payload.notes ?? "",
  };
}

export default function PurchesOrder() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("purchase-orders"); // <-- change this

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    orderNumber: "",
    supplier: "",
    orderDate: "",
    expectedDate: "",
    items: "",
    amount: "",
    status: "Pending",
    notes: "",
  });

  const totals = useMemo(() => {
    const totalOrders = orders.length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const totalValue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    return { totalOrders, pending, delivered, totalValue };
  }, [orders]);

  const loadOrders = async (signal) => {
    const res = await fetch(`${API_BASE}/api/purchase-orders/`, { signal });
    if (!res.ok) throw new Error(`Failed to load purchase orders (${res.status})`);
    const json = await res.json();
    setOrders(Array.isArray(json) ? json.map(mapFromApi) : []);
  };

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setLoadError("");
        await loadOrders(controller.signal);
      } catch (e) {
        if (e?.name !== "AbortError") setLoadError(e?.message || "Failed to load purchase orders");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const handleCreate = async () => {
    try {
      setLoadError("");
      const res = await fetch(`${API_BASE}/api/purchase-orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapToApi(form)),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to create PO (${res.status}) ${text}`.trim());
      }
      const created = mapFromApi(await res.json());
      setOrders((prev) => [created, ...prev]);
      setIsCreateOpen(false);
      setForm({
        orderNumber: "",
        supplier: "",
        orderDate: "",
        expectedDate: "",
        items: "",
        amount: "",
        status: "Pending",
        notes: "",
      });
    } catch (e) {
      setLoadError(e?.message || "Failed to create purchase order");
    }
  };

  const patchOrder = async (id, patch) => {
    const res = await fetch(`${API_BASE}/api/purchase-orders/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Update failed (${res.status}) ${text}`.trim());
    }
    return mapFromApi(await res.json());
  };

  const handleMarkStatus = async (id, status) => {
    try {
      setLoadError("");
      const updated = await patchOrder(id, { status });
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch (e) {
      setLoadError(e?.message || "Failed to update status");
    }
  };

  const handleReceive = async (id) => {
    try {
      setLoadError("");
      const res = await fetch(`${API_BASE}/api/purchase-orders/${id}/receive/`, { method: "POST" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Receive failed (${res.status}) ${text}`.trim());
      }
      const updated = mapFromApi(await res.json());
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch (e) {
      setLoadError(e?.message || "Failed to receive purchase order");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          navigate(`/${page}`);
        }}
        onLogout={() => navigate("/")}
      />

      <main className="flex-1 min-h-screen p-6 overflow-y-auto bg-gray-50">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
            <p className="text-gray-500">Create and track supplier purchase orders</p>
            {loading && <div className="mt-2 text-sm text-gray-600">Loading...</div>}
            {loadError && <div className="mt-2 text-sm text-red-600">{loadError}</div>}
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Create PO
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
          <div className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-lg font-bold">{totals.totalOrders}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-lg font-bold">{totals.pending}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-500">Delivered</p>
            <p className="text-lg font-bold">{totals.delivered}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="text-lg font-bold">${totals.totalValue.toFixed(2)}</p>
          </div>
        </div>

        {/* Table */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="mb-1 text-lg font-semibold">Orders</h2>
          <p className="mb-4 text-gray-500">Latest purchase orders</p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">PO Number</th>
                  <th className="p-2 text-left">Supplier</th>
                  <th className="p-2 text-left">Order Date</th>
                  <th className="p-2 text-left">Expected</th>
                  <th className="p-2 text-left">Items</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{o.orderNumber}</td>
                    <td className="p-2">{o.supplier}</td>
                    <td className="p-2">{o.orderDate}</td>
                    <td className="p-2">{o.expectedDate || "-"}</td>
                    <td className="p-2">{o.items}</td>
                    <td className="p-2">${Number(o.amount || 0).toFixed(2)}</td>
                    <td className="p-2">{o.status}</td>
                    <td className="p-2 space-x-2">
                      <button
                        type="button"
                        className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                        onClick={() => handleMarkStatus(o.id, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                        onClick={() => handleMarkStatus(o.id, "Shipped")}
                      >
                        Ship
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                        onClick={() => handleReceive(o.id)}
                        disabled={o.status === "Delivered"}
                        title={o.status === "Delivered" ? "Already delivered" : "Receive and restock"}
                      >
                        Receive
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && !loadError && orders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-4 text-sm text-gray-500">
                      No purchase orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simple Create Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-xl p-4 bg-white rounded shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Create Purchase Order</h3>
                <button
                  type="button"
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="text-sm">
                  PO Number (optional)
                  <input
                    className="w-full p-2 mt-1 border rounded"
                    value={form.orderNumber}
                    onChange={(e) => setForm((p) => ({ ...p, orderNumber: e.target.value }))}
                    placeholder="Leave blank to auto-generate"
                  />
                </label>

                <label className="text-sm">
                  Supplier
                  <input
                    className="w-full p-2 mt-1 border rounded"
                    value={form.supplier}
                    onChange={(e) => setForm((p) => ({ ...p, supplier: e.target.value }))}
                    placeholder="Supplier name"
                  />
                </label>

                <label className="text-sm">
                  Order Date
                  <input
                    type="date"
                    className="w-full p-2 mt-1 border rounded"
                    value={form.orderDate}
                    onChange={(e) => setForm((p) => ({ ...p, orderDate: e.target.value }))}
                  />
                </label>

                <label className="text-sm">
                  Expected Date
                  <input
                    type="date"
                    className="w-full p-2 mt-1 border rounded"
                    value={form.expectedDate}
                    onChange={(e) => setForm((p) => ({ ...p, expectedDate: e.target.value }))}
                  />
                </label>

                <label className="text-sm md:col-span-2">
                  Items (summary)
                  <input
                    className="w-full p-2 mt-1 border rounded"
                    value={form.items}
                    onChange={(e) => setForm((p) => ({ ...p, items: e.target.value }))}
                    placeholder="e.g. Engine Oil 5W-30 (50 units)"
                  />
                </label>

                <label className="text-sm">
                  Amount
                  <input
                    type="number"
                    className="w-full p-2 mt-1 border rounded"
                    value={form.amount}
                    onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </label>

                <label className="text-sm">
                  Status
                  <select
                    className="w-full p-2 mt-1 border rounded"
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  >
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Canceled</option>
                  </select>
                </label>

                <label className="text-sm md:col-span-2">
                  Notes
                  <textarea
                    className="w-full p-2 mt-1 border rounded"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  onClick={handleCreate}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
