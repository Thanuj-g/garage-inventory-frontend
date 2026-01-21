import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Header from "../components/Header";
import SearchFilter from "../components/SearchFilter";
import ActionButtons from "../components/ActionButtons";
import AddItemModal from "../components/AddItemModal";

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
    supplier: payload.supplier || "",
  };
}

export default function InventoryPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("inventory");
  const [data, setData] = useState([]); // was initialData
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // NEW
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadItems = async (signal) => {
    const res = await fetch(`${API_BASE}/api/items/`, { signal });
    if (!res.ok) throw new Error(`Failed to load items (${res.status})`);
    const items = await res.json();
    setData(items.map(mapFromApi));
  };

  
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setLoadError("");
        await loadItems(controller.signal);
      } catch (e) {
        if (e?.name !== "AbortError") {
          setLoadError(e?.message || "Failed to load items");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const categoryOptions = useMemo(() => {
    const normalize = (v) => String(v || "").trim().toLowerCase();

    const fromData = data
      .map((d) => (d.category || "").trim())
      .filter(Boolean);

    // Keep DEFAULT_CATEGORIES order, then append any new categories coming from API
    const defaultNorm = new Set(DEFAULT_CATEGORIES.map(normalize));
    const extras = Array.from(
      new Set(
        fromData
          .filter((c) => !defaultNorm.has(normalize(c)))
          .map((c) => c.trim())
      )
    ).sort((a, b) => a.localeCompare(b));

    return [...DEFAULT_CATEGORIES, ...extras];
  }, [data]);

  const handleAdd = () => {
    setEditingItem(null);
    setIsAddOpen(true);
  };

  const handleSearch = (q) => setQuery(q || "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return data.filter((d) => {
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.part.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "all" || d.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [data, query, selectedCategory]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsAddOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete ${item.part}?`)) return;
    if (!item?.id) {
      setLoadError("Cannot delete: item has no id from server.");
      return;
    }

    try {
      setLoadError("");
      const res = await fetch(`${API_BASE}/api/items/${item.id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete (${res.status})`);
      setData((prev) => prev.filter((p) => p.id !== item.id));
    } catch (e) {
      setLoadError(e?.message || "Failed to delete item");
    }
  };

  const handleSubmitModal = async (payload) => {
    try {
      setLoadError("");
      const body = JSON.stringify(mapToApi(payload));

      // edit
      if (editingItem?.id) {
        const res = await fetch(`${API_BASE}/api/items/${editingItem.id}/`, {
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

      // add
      const res = await fetch(`${API_BASE}/api/items/`, {
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
        onLogout={() => navigate("/")}
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
        />
      </main>
    </div>
  );
}