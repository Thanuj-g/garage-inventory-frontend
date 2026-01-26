import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Header from "../components/Header";
import SearchFilter from "../components/SearchFilter";
import ActionButtons from "../components/ActionButtons";
import AddItemModal from "../components/AddItemModal";
import ConfirmModal from "../components/ConfirmModal"; // <-- add
import { authFetch, logout } from "../lib/auth";

const API_BASE = "http://127.0.0.1:8000";

const DEFAULT_CATEGORIES = [
  "Engine Parts",
  "Brake System",
  "Oils & Fluids",
  "Electrical",
  "Tires",
  "Suspension",
  "Transmission",
];

function mapFromApi(it) {
  return {
    id: it.id,
    part: it.part_number,
    name: it.name,
    category: it.category || "",
    qty: it.qty ?? 0,
    min: it.min_stock ?? 0,
    price: it.price != null && it.price !== "" ? `$${Number(it.price).toFixed(2)}` : "",
    location: it.location || "",
    supplier: it.supplier || "",
    supplierId: it.supplier_id ?? null,
  };
}

function parsePriceToNumber(price) {
  if (price == null) return null;
  const s = String(price).trim();
  if (!s) return null;
  const cleaned = s.replace(/[$,\s]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function mapToApi(payload) {
  return {
    part_number: payload.part,
    name: payload.name,
    category: payload.category || "",
    qty: Number(payload.qty ?? 0),
    min_stock: Number(payload.min ?? 0),
    price: parsePriceToNumber(payload.price),
    location: payload.location || "",
    supplier_id: payload.supplierId ?? null,
  };
}

export default function InventoryPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("inventory");

  const [data, setData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // --- delete confirm modal state (add) ---
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadItems = async (signal) => {
    const res = await authFetch(`${API_BASE}/api/items/`, { signal });
    if (!res.ok) throw new Error(`Failed to load items (${res.status})`);
    const items = await res.json();
    setData(items.map(mapFromApi));
  };

  const loadSuppliers = async (signal) => {
    const res = await authFetch(`${API_BASE}/api/suppliers/`, { signal });
    if (!res.ok) throw new Error(`Failed to load suppliers (${res.status})`);
    const json = await res.json();
    setSuppliers(Array.isArray(json) ? json.map((s) => ({ id: s.id, name: s.name })) : []);
  };

  const loadCategories = async (signal) => {
    const res = await authFetch(`${API_BASE}/api/categories/`, { signal });
    if (!res.ok) throw new Error(`Failed to load categories (${res.status})`);
    const json = await res.json();
    // CategorySerializer returns { id, name, desc, color, ... }
    setCategories(Array.isArray(json) ? json.map((c) => ({ id: c.id, name: c.name })) : []);
  };

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setLoadError("");
        await Promise.all([
          loadItems(controller.signal),
          loadSuppliers(controller.signal),
          loadCategories(controller.signal), // <-- add
        ]);
      } catch (e) {
        if (e?.name !== "AbortError") setLoadError(e?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  // Use backend categories for dropdown; fallback to DEFAULT_CATEGORIES if backend empty.
  const categoryOptions = useMemo(() => {
    const names = categories
      .map((c) => String(c?.name || "").trim())
      .filter(Boolean);

    // unique + alpha sort
    const uniqueSorted = Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));

    return uniqueSorted.length ? uniqueSorted : DEFAULT_CATEGORIES;
  }, [categories]);

  const handleAdd = () => {
    setEditingItem(null);
    setIsAddOpen(true);
  };

  const handleSearch = (q) => setQuery(q || "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return data.filter((d) => {
      const matchesQuery =
        !q || d.name.toLowerCase().includes(q) || d.part.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "all" || d.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [data, query, selectedCategory]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsAddOpen(true);
  };

  // Replace window.confirm flow with modal open
  const handleDelete = (item) => {
    setLoadError("");
    setDeleteTarget(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    const item = deleteTarget;

    if (!item?.id) {
      setLoadError("Cannot delete: item has no id from server.");
      setIsDeleteOpen(false);
      setDeleteTarget(null);
      return;
    }

    try {
      setDeleting(true);
      setLoadError("");

      const res = await authFetch(`${API_BASE}/api/items/${item.id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete (${res.status})`);

      setData((prev) => prev.filter((p) => p.id !== item.id));
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    } catch (e) {
      setLoadError(e?.message || "Failed to delete item");
      // keep modal open so user can retry or cancel
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmitModal = async (payload) => {
    try {
      setLoadError("");
      const body = JSON.stringify(mapToApi(payload));

      if (editingItem?.id) {
        const res = await authFetch(`${API_BASE}/api/items/${editingItem.id}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body,
        });
        if (!res.ok) throw new Error(`Failed to update (${res.status})`);
        const updated = await res.json();

        setData((prev) => prev.map((it) => (it.id === editingItem.id ? mapFromApi(updated) : it)));
        setIsAddOpen(false);
        setEditingItem(null);
        return;
      }

      const res = await authFetch(`${API_BASE}/api/items/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!res.ok) throw new Error(`Failed to create (${res.status})`);
      const created = await res.json();

      setData((prev) => [mapFromApi(created), ...prev]);
      setIsAddOpen(false);
      setEditingItem(null);
    } catch (e) {
      setLoadError(e?.message || "Failed to save item");
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
        <Header onAdd={handleAdd} />

        {loading && <div className="mb-3 text-sm text-gray-600">Loading inventory...</div>}
        {loadError && <div className="mb-3 text-sm text-red-600">{loadError}</div>}

        <SearchFilter
          onSearch={handleSearch}
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="overflow-x-auto bg-white shadow-sm rounded-xl">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="p-4">Part Number</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Min Stock</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Location</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr key={item.id ?? item.part} className="transition border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{item.part}</td>
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">{item.qty}</td>
                  <td className="p-4">{item.min}</td>
                  <td className="p-4">{item.price}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 text-sm text-white bg-black rounded-full">
                      In Stock
                    </span>
                  </td>
                  <td className="p-4">{item.location}</td>
                  <td className="p-4">
                    <ActionButtons
                      onEdit={() => handleEdit(item)}
                      onDelete={() => handleDelete(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AddItemModal
          isOpen={isAddOpen}
          onClose={() => {
            setIsAddOpen(false);
            setEditingItem(null);
          }}
          mode={editingItem ? "edit" : "add"}
          initialValues={editingItem}
          onSubmit={handleSubmitModal}
          categoryOptions={categoryOptions}
          supplierOptions={suppliers}
        />

        {/* Delete confirmation modal (add) */}
        <ConfirmModal
          isOpen={isDeleteOpen}
          loading={deleting}
          title="Delete Item"
          message={`Are you sure you want to delete "${deleteTarget?.part ?? ""}"? This cannot be undone.`}
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