import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { authFetch, logout } from "../lib/auth";
import { getPermissions } from "../lib/permissions";

const API_BASE = "http://127.0.0.1:8000";

function unwrapList(json) {
  // FIX: must return values properly
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.results)) return json.results;
  return [];
}

function toMoney(v) {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function toInt(v) {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

function fmtMoney(v, digits = 2) {
  return toMoney(v).toFixed(digits);
}

function normalizeStatus(s) {
  return String(s || "").trim().toLowerCase();
}

function emptyLine() {
  return { part_number: "", item_name: "", qty: 1, unit_price: "" }; // unit_price is supplier quote (optional)
}

function computeFromLines(lines) {
  const cleaned = (lines || []).map((ln) => {
    const qty = Math.max(0, toInt(ln.qty));
    const unit = ln.unit_price === "" || ln.unit_price == null ? null : Math.max(0, toMoney(ln.unit_price));
    const lineTotal = unit == null ? 0 : qty * unit;
    return { ...ln, qty, _unit: unit, _lineTotal: lineTotal };
  });

  const amount = cleaned.reduce((sum, ln) => sum + toMoney(ln._lineTotal), 0);

  const itemsSummary =
    cleaned
      .filter((ln) => ln.qty > 0 && (ln.part_number || ln.item_name))
      .map((ln) => `${ln.part_number || ln.item_name} (${ln.qty})`)
      .join(", ") || "";

  return { cleaned, amount, itemsSummary };
}

function mapFromApi(po) {
  // tolerate camelCase or snake_case
  return {
    id: po.id,
    orderNumber: po.orderNumber ?? po.order_number ?? "",
    supplier: po.supplier ?? po.supplier_name ?? "",
    orderDate: po.orderDate ?? po.order_date ?? "",
    expectedDate: po.expectedDate ?? po.expected_date ?? "",
    items: po.items ?? "",
    amount: toMoney(po.amount),
    status: po.status ?? "Pending",
    notes: po.notes ?? "",
    lines: Array.isArray(po.lines)
      ? po.lines.map((ln) => ({
          id: ln.id,
          part_number: ln.part_number ?? "",
          item_name: ln.item_name ?? "",
          qty: toInt(ln.qty),
          unit_price: ln.unit_price ?? ln.unit_cost ?? null,
        }))
      : [],
  };
}

export default function PurchesOrder() {
  const navigate = useNavigate();
  const { isStaff, canWrite } = getPermissions();

  const [currentPage, setCurrentPage] = useState("purchase-orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [receivingId, setReceivingId] = useState(null);

  const [modalError, setModalError] = useState("");

  const [form, setForm] = useState({
    orderNumber: "",
    supplier: "",
    orderDate: "",
    expectedDate: "",
    status: "Pending",
    notes: "",
    lines: [emptyLine()],
  });

  const [suppliers, setSuppliers] = useState([]);

  const supplierNames = useMemo(() => {
    const names = (suppliers || [])
      .map((s) => String(s?.name || "").trim())
      .filter(Boolean);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [suppliers]);

  const computed = useMemo(() => computeFromLines(form.lines), [form.lines]);

  const totals = useMemo(() => {
    const totalOrders = orders.length;
    const pending = orders.filter((o) => normalizeStatus(o?.status) === "pending").length;
    const delivered = orders.filter((o) => normalizeStatus(o?.status) === "delivered").length;
    const totalAmount = orders.reduce((sum, o) => sum + toMoney(o?.amount), 0);
    return { totalOrders, pending, delivered, totalAmount };
  }, [orders]);

  const loadOrders = async (signal) => {
    const res = await authFetch(`${API_BASE}/api/purchase-orders/`, { signal });
    if (!res.ok) throw new Error(`Failed to load purchase orders (${res.status})`);
    const json = await res.json();
    setOrders(unwrapList(json).map(mapFromApi));
  };

  const loadSuppliers = async (signal) => {
    const res = await authFetch(`${API_BASE}/api/suppliers/`, { signal });
    if (!res.ok) throw new Error(`Failed to load suppliers (${res.status})`);
    const json = await res.json();
    setSuppliers(unwrapList(json));
  };

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setLoadError("");
        await Promise.all([loadOrders(controller.signal), loadSuppliers(controller.signal)]);
      } catch (e) {
        if (e?.name !== "AbortError") setLoadError(e?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  function resetForm() {
    setForm({
      orderNumber: "",
      supplier: "",
      orderDate: "",
      expectedDate: "",
      status: "Pending",
      notes: "",
      lines: [emptyLine()],
    });
    setModalError(""); // ✅ clear modal error when resetting
  }

  const buildPayload = () => {
    const { cleaned, amount, itemsSummary } = computeFromLines(form.lines);

    const linesPayload = cleaned
      .filter((ln) => ln.qty > 0 && (String(ln.part_number || "").trim() || String(ln.item_name || "").trim()))
      .map((ln) => ({
        part_number: String(ln.part_number || "").trim(),
        item_name: String(ln.item_name || "").trim(),
        qty: ln.qty,
        unit_price: ln._unit == null ? 0 : Number(ln._unit.toFixed(2)),
      }));

    const orderDate = form.orderDate || undefined;
    const expectedDate = form.expectedDate || null;

    return {
      orderNumber: form.orderNumber?.trim() || undefined,
      supplier: form.supplier ?? "",

      // ✅ send both versions so backend definitely stores it
      orderDate,
      expectedDate,
      order_date: orderDate,
      expected_date: expectedDate,

      status: "Pending",
      notes: form.notes ?? "",
      items: itemsSummary,
      amount: Number(amount.toFixed(2)),
      lines: linesPayload,
    };
  };

  const validate = () => {
    if (!String(form.supplier || "").trim()) return "Supplier is required.";
    const { cleaned } = computeFromLines(form.lines);
    const hasLine = cleaned.some(
      (ln) => ln.qty > 0 && (String(ln.part_number || "").trim() || String(ln.item_name || "").trim())
    );
    if (!hasLine) return "Add at least 1 line item with a Part # or Name, and Qty > 0.";
    return "";
  };

  const handleCreate = async () => {
    if (!canWrite) return;

    const err = validate();
    if (err) {
      setModalError(err);
      setLoadError(err);
      return;
    }

    try {
      setSaving(true);
      setModalError("");
      setLoadError("");

      const res = await authFetch(`${API_BASE}/api/purchase-orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Failed to create PO (${res.status}) ${t}`.trim());
      }

      const created = mapFromApi(await res.json());
      setOrders((prev) => [created, ...(prev || [])]);
      setIsCreateOpen(false);
      resetForm();
    } catch (e) {
      const msg = e?.message || "Failed to create purchase order";
      setModalError(msg);
      setLoadError(msg);
    } finally {
      setSaving(false);
    }
  };

  const patchOrder = async (id, patch) => {
    if (!canWrite) return null;

    const res = await authFetch(`${API_BASE}/api/purchase-orders/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Failed to update PO (${res.status}) ${t}`.trim());
    }

    const updated = mapFromApi(await res.json());
    setOrders((prev) => (prev || []).map((o) => (o.id === id ? updated : o)));
    return updated;
  };

  const handleMarkStatus = async (id, status) => {
    if (!canWrite) return;
    try {
      setLoadError("");
      await patchOrder(id, { status });
    } catch (e) {
      setLoadError(e?.message || "Failed to update status");
    }
  };

  const handleReceive = async (id) => {
    if (!canWrite) return;

    const row = (orders || []).find((o) => o.id === id);
    const st = normalizeStatus(row?.status);
    if (st === "delivered" || receivingId === id) return;

    try {
      setReceivingId(id);
      setLoadError("");

      const res = await authFetch(`${API_BASE}/api/purchase-orders/${id}/receive/`, {
        method: "POST",
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Failed to receive PO (${res.status}) ${t}`.trim());
      }

      const updated = mapFromApi(await res.json());
      setOrders((prev) => (prev || []).map((o) => (o.id === id ? updated : o)));
    } catch (e) {
      setLoadError(e?.message || "Failed to receive purchase order");
    } finally {
      setReceivingId(null);
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

      <main className="flex-1 min-h-screen p-6 bg-gray-50">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
            <p className="text-gray-500">Create and track supplier purchase orders</p>
            {loading && <div className="mt-2 text-sm text-gray-600">Loading...</div>}
            {loadError && <div className="mt-2 text-sm text-red-600">{loadError}</div>}
            {isStaff && <div className="mt-2 text-sm text-gray-600">Staff account: read-only</div>}
          </div>

          <button
            type="button"
            onClick={() => {
              if (!canWrite) return;
              resetForm();
              setIsCreateOpen(true);
            }}
            disabled={!canWrite}
            className={`px-4 py-2 text-white rounded ${
              canWrite ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
            title={canWrite ? "Create purchase order" : "Read-only (staff)"}
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
            <p className="text-lg font-bold">${fmtMoney(totals.totalAmount)}</p>
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
                {orders.map((o) => {
                  const st = normalizeStatus(o.status);
                  const isDelivered = st === "delivered";
                  const isReceiving = receivingId === o.id;

                  return (
                    <tr key={o.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{o.orderNumber}</td>
                      <td className="p-2">{o.supplier}</td>
                      <td className="p-2">{o.orderDate}</td>
                      <td className="p-2">{o.expectedDate || "-"}</td>
                      <td className="p-2">{o.items}</td>
                      <td className="p-2">${fmtMoney(o.amount)}</td>
                      <td className="p-2">{o.status}</td>
                      <td className="p-2 space-x-2">
                        {canWrite ? (
                          <>
                            <button
                              type="button"
                              className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                              onClick={() => handleMarkStatus(o.id, "Approved")}
                              disabled={isReceiving || isDelivered}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                              onClick={() => handleMarkStatus(o.id, "Shipped")}
                              disabled={isReceiving || isDelivered}
                            >
                              Ship
                            </button>
                            <button
                              type="button"
                              className="px-2 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-green-300"
                              onClick={() => handleReceive(o.id)}
                              disabled={isDelivered || isReceiving}
                              title={isDelivered ? "Already delivered" : "Receive and restock using PO line quantities"}
                            >
                              {isReceiving ? "Receiving..." : "Receive"}
                            </button>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">Read-only</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

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

        {/* Create Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            {/* changed: make modal a flex column so footer never overlays */}
            <div className="w-full max-w-2xl bg-white rounded shadow max-h-[85vh] overflow-hidden flex flex-col">
              {/* header */}
              <div className="flex items-center justify-between p-4 border-b shrink-0">
                <div>
                  <h3 className="text-lg font-semibold">Create Purchase Order</h3>
                  <p className="text-sm text-gray-500">
                    Add quantities per item. Unit price is supplier-provided (optional).
                  </p>
                </div>
                <button
                  type="button"
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                  onClick={() => {
                    if (saving) return;
                    setIsCreateOpen(false);
                  }}
                  disabled={saving}
                >
                  Close
                </button>
              </div>

              {/* body */}
              <div className="flex-1 p-4 overflow-y-auto">
                {/* optional: show modal error here if you use modalError */}
                {modalError && (
                  <div className="p-3 mb-3 text-sm text-red-700 border border-red-200 rounded bg-red-50">
                    {modalError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="text-sm">
                    PO Number (optional)
                    <input
                      className="w-full p-2 mt-1 border rounded"
                      value={form.orderNumber}
                      onChange={(e) => setForm((p) => ({ ...p, orderNumber: e.target.value }))}
                      placeholder="Leave blank to auto-generate"
                      disabled={saving}
                    />
                  </label>

                  <label className="text-sm">
                    Supplier
                    <select
                      className="w-full p-2 mt-1 border rounded"
                      value={form.supplier}
                      onChange={(e) => setForm((p) => ({ ...p, supplier: e.target.value }))}
                      disabled={saving}
                    >
                      <option value="">Select supplier</option>
                      {supplierNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm">
                    Order Date
                    <input
                      type="date"
                      className="w-full p-2 mt-1 border rounded"
                      value={form.orderDate}
                      onChange={(e) => setForm((p) => ({ ...p, orderDate: e.target.value }))}
                      disabled={saving}
                    />
                  </label>

                  <label className="text-sm">
                    Expected Date
                    <input
                      type="date"
                      className="w-full p-2 mt-1 border rounded"
                      value={form.expectedDate}
                      onChange={(e) => setForm((p) => ({ ...p, expectedDate: e.target.value }))}
                      disabled={saving}
                    />
                  </label>

                  <div className="text-sm">
                    <div className="text-gray-600">Computed Total</div>
                    <div className="mt-1 font-bold">${fmtMoney(computed.amount)}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      Total is 0 if supplier unit prices aren’t entered yet.
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Status on create: <span className="font-medium">Pending</span>
                    </div>
                  </div>
                </div>

                {/* Line items */}
                <div className="p-3 mt-4 border rounded">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Line Items</div>
                    <button
                      type="button"
                      className="px-3 py-2 border rounded hover:bg-gray-100"
                      onClick={() => setForm((p) => ({ ...p, lines: [...p.lines, emptyLine()] }))}
                      disabled={saving}
                    >
                      + Add Line
                    </button>
                  </div>

                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-2 text-left">Part #</th>
                          <th className="p-2 text-left">Name</th>
                          <th className="p-2 text-left">Qty</th>
                          <th className="p-2 text-left">Supplier Unit Price (optional)</th>
                          <th className="p-2 text-left">Line Total</th>
                          <th className="p-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {computed.cleaned.map((ln, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-2">
                              <input
                                className="w-40 p-2 border rounded"
                                value={ln.part_number}
                                onChange={(e) =>
                                  setForm((p) => {
                                    const next = [...p.lines];
                                    next[idx] = { ...next[idx], part_number: e.target.value };
                                    return { ...p, lines: next };
                                  })
                                }
                                placeholder="e.g. BRK-001"
                                disabled={saving}
                              />
                            </td>
                            <td className="p-2">
                              <input
                                className="w-64 p-2 border rounded"
                                value={ln.item_name}
                                onChange={(e) =>
                                  setForm((p) => {
                                    const next = [...p.lines];
                                    next[idx] = { ...next[idx], item_name: e.target.value };
                                    return { ...p, lines: next };
                                  })
                                }
                                placeholder="e.g. Brake Pads"
                                disabled={saving}
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="0"
                                className="w-24 p-2 border rounded"
                                value={ln.qty}
                                onChange={(e) =>
                                  setForm((p) => {
                                    const next = [...p.lines];
                                    next[idx] = { ...next[idx], qty: e.target.value };
                                    return { ...p, lines: next };
                                  })
                                }
                                disabled={saving}
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-40 p-2 border rounded"
                                value={ln.unit_price}
                                onChange={(e) =>
                                  setForm((p) => {
                                    const next = [...p.lines];
                                    next[idx] = { ...next[idx], unit_price: e.target.value };
                                    return { ...p, lines: next };
                                  })
                                }
                                placeholder="Leave blank if unknown"
                                disabled={saving}
                              />
                            </td>
                            <td className="p-2">${fmtMoney(ln._lineTotal)}</td>
                            <td className="p-2">
                              <button
                                type="button"
                                className="px-3 py-2 text-sm text-red-700 border rounded hover:bg-red-50"
                                onClick={() =>
                                  setForm((p) => {
                                    const next = [...p.lines];
                                    next.splice(idx, 1);
                                    return { ...p, lines: next.length ? next : [emptyLine()] };
                                  })
                                }
                                disabled={saving}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-2 text-xs text-gray-500">
                      Items summary sent to backend: <span className="font-medium">{computed.itemsSummary || "-"}</span>
                    </div>
                  </div>
                </div>

                <label className="block mt-3 text-sm">
                  Notes
                  <textarea
                    className="w-full p-2 mt-1 border rounded"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                    disabled={saving}
                  />
                </label>
              </div>

              {/* footer (always visible) */}
              <div className="flex justify-end gap-2 p-4 bg-white border-t shrink-0">
                <button
                  type="button"
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-white rounded ${
                    canWrite ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleCreate}
                  disabled={!canWrite || saving}
                  title={canWrite ? "Create" : "Read-only (staff)"}
                >
                  {saving ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
