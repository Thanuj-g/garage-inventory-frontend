import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaBuilding,
  FaUsers,
  FaEnvelope,
  FaPhone,
  FaStar,
} from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

import Sidebar from "../components/sidebar";
import AddSupplierModal from "../components/AddSupplierModal";
import ConfirmModal from "../components/ConfirmModal";
import { authFetch, logout } from "../lib/auth";
import { getPermissions } from "../lib/permissions";

const API_BASE = "http://127.0.0.1:8000";

function mapFromApi(s) {
  return {
    id: s.id,
    name: s.name,
    contact: s.contact ?? "",
    email: s.email ?? "",
    phone: s.phone ?? "",
    products: s.products ?? "",
    rating: Number(s.rating ?? 0),
    orders: Number(s.orders ?? 0),
    address: s.address ?? "",
  };
}

function mapToApi(payload) {
  return {
    name: payload.name,
    contact: payload.contact ?? "",
    email: payload.email ?? "",
    phone: payload.phone ?? "",
    products: payload.products ?? "",
    address: payload.address ?? "",
  };
}

export default function SupplierManagementPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("suppliers");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const { canWrite, canDelete } = getPermissions();

  // delete confirm state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadSuppliers = async (signal) => {
    const res = await authFetch(`${API_BASE}/api/suppliers/`, { signal });
    if (!res.ok) throw new Error(`Failed to load suppliers (${res.status})`);
    const json = await res.json();
    setSuppliers(Array.isArray(json) ? json.map(mapFromApi) : []);
  };

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setLoadError("");
        await loadSuppliers(controller.signal);
      } catch (e) {
        if (e?.name !== "AbortError") {
          setLoadError(e?.message || "Failed to load suppliers");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const totalSuppliers = suppliers.length;
  const activeSuppliers = Math.max(0, suppliers.length - 1); // example
  const totalOrders = suppliers.reduce((sum, s) => sum + (Number(s.orders) || 0), 0);
  const averageRating =
    suppliers.length > 0
      ? (
          suppliers.reduce((sum, s) => sum + (Number(s.rating) || 0), 0) / suppliers.length
        ).toFixed(1)
      : "0.0";

  const handleAddSupplier = async (payload) => {
    if (!canWrite) return; // staff safety
    try {
      setLoadError("");

      const res = await authFetch(`${API_BASE}/api/suppliers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapToApi(payload)),
      });

      if (!res.ok) throw new Error(`Failed to create supplier (${res.status})`);
      const created = mapFromApi(await res.json());

      setSuppliers((prev) => [created, ...prev]);
      setIsAddOpen(false);
    } catch (e) {
      setLoadError(e?.message || "Failed to create supplier");
    }
  };

  const handleDeleteClick = (supplier) => {
    if (!canDelete) return; // staff cannot
    setLoadError("");
    setDeleteTarget(supplier);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    const s = deleteTarget;
    if (!s?.id) {
      setLoadError("Cannot delete: supplier has no id.");
      setIsDeleteOpen(false);
      setDeleteTarget(null);
      return;
    }

    try {
      setDeleting(true);
      setLoadError("");

      const res = await authFetch(`${API_BASE}/api/suppliers/${s.id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete supplier (${res.status})`);

      setSuppliers((prev) => prev.filter((x) => x.id !== s.id));
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    } catch (e) {
      setLoadError(e?.message || "Failed to delete supplier");
    } finally {
      setDeleting(false);
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
        onLogout={() => {
          logout();
          navigate("/login", { replace: true });
        }}
      />

      <main className="flex-1 min-h-screen p-6 overflow-y-auto bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
            <p className="text-gray-500">Manage your suppliers and contacts</p>

            {loading && <div className="mt-2 text-sm text-gray-600">Loading suppliers...</div>}
            {loadError && <div className="mt-2 text-sm text-red-600">{loadError}</div>}
          </div>

          {canWrite && (
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="flex items-center px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
            >
              <FaPlus className="mr-2" /> Add Supplier
            </button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
          <div className="flex items-center p-4 space-x-4 bg-white rounded shadow">
            <FaBuilding className="text-2xl text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Suppliers</p>
              <p className="text-lg font-bold">{totalSuppliers}</p>
            </div>
          </div>

          <div className="flex items-center p-4 space-x-4 bg-white rounded shadow">
            <FaUsers className="text-2xl text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Active Suppliers</p>
              <p className="text-lg font-bold">{activeSuppliers}</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-lg font-bold">{totalOrders}</p>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="text-lg font-bold">{averageRating} / 5.0</p>
          </div>
        </div>

        {/* Supplier Table */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="mb-4 text-lg font-semibold">All Suppliers</h2>
          <p className="mb-4 text-gray-500">Complete list of your supplier network</p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Company Name</th>
                  <th className="p-2 text-left">Contact Person</th>
                  <th className="p-2 text-left">Contact Info</th>
                  <th className="p-2 text-left">Products</th>
                  <th className="p-2 text-left">Rating</th>
                  <th className="p-2 text-left">Orders</th>
                  {(canDelete) && <th className="p-2 text-left">Actions</th>}
                </tr>
              </thead>

              <tbody>
                {suppliers.map((s, idx) => (
                  <tr
                    key={s.id ?? `${s.name}-${idx}`}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-2 font-medium">{s.name}</td>
                    <td className="p-2">{s.contact}</td>
                    <td className="p-2 space-y-1">
                      <div className="flex items-center space-x-2">
                        <FaEnvelope className="text-gray-400" />
                        <span>{s.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaPhone className="text-gray-400" />
                        <span>{s.phone}</span>
                      </div>
                    </td>
                    <td className="p-2">{s.products}</td>
                    <td className="p-2">
                      <span className="inline-flex items-center">
                        <FaStar className="mr-1 text-yellow-400" />
                        {Number(s.rating || 0).toFixed(1)}
                      </span>
                    </td>
                    <td className="p-2">{s.orders}</td>

                    {canDelete && (
                      <td className="p-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(s)}
                          className="p-2 text-red-600 border rounded hover:bg-red-50"
                          aria-label={`Delete ${s.name}`}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}

                {!loading && !loadError && suppliers.length === 0 && (
                  <tr>
                    <td colSpan={canDelete ? 7 : 6} className="p-4 text-sm text-gray-500">
                      No suppliers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {canWrite && (
          <AddSupplierModal
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            onSubmit={handleAddSupplier}
          />
        )}

        <ConfirmModal
          isOpen={isDeleteOpen}
          loading={deleting}
          title="Delete Supplier"
          message={`Delete supplier "${deleteTarget?.name ?? ""}"? This cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          destructive
          onClose={() => {
            if (deleting) return;
            setIsDeleteOpen(false);
            setDeleteTarget(null);
          }}
          onConfirm={confirmDelete}
        />
      </main>
    </div>
  );
}