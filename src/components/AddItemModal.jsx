import React, { useEffect, useMemo, useState } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import { Input } from "./input";

function formatPrice(value) {
  const v = String(value ?? "").trim();
  if (!v) return "";
  if (v.startsWith("$")) return v;
  return `$${v}`;
}

export default function AddItemModal({
  isOpen,
  onClose,

  // NEW
  mode = "add", // "add" | "edit"
  initialValues = null, // item to edit
  onSubmit, // (payload) => void

  categoryOptions = [],
}) {
  const options = useMemo(
    () => categoryOptions.map((c) => String(c || "").trim()).filter(Boolean),
    [categoryOptions]
  );

  const [form, setForm] = useState({
    part: "",
    name: "",
    category: "",
    supplier: "",
    qty: "",
    min: "",
    price: "",
    location: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    const iv = initialValues || {};
    setForm({
      part: iv.part ?? "",
      name: iv.name ?? "",
      category: iv.category ?? "",
      supplier: iv.supplier ?? "",
      qty: iv.qty ?? "",
      min: iv.min ?? "",
      price: String(iv.price ?? "").replace(/^\$/, ""), // show without $ in input
      location: iv.location ?? "",
    });

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, initialValues, onClose]);

  if (!isOpen) return null;

  const setField =
    (key) =>
    (e) =>
      setForm((s) => ({ ...s, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      part: String(form.part || "").trim(),
      name: String(form.name || "").trim(),
      category: form.category || "Uncategorized",
      qty: Number(form.qty || 0),
      min: Number(form.min || 0),
      price: formatPrice(form.price || "0.00"),
      location: String(form.location || "").trim(),
      supplier: String(form.supplier || "").trim(),
      // for updates: keep a reference to the original item key
      originalPart: initialValues?.part,
    };

    if (!payload.part || !payload.name) return;

    onSubmit?.(payload);
    onClose?.();
  };

  const title = mode === "edit" ? "Edit Item" : "Add New Item";
  const subtitle =
    mode === "edit"
      ? "Update the selected inventory item"
      : "Add a new spare part or consumable to inventory";
  const primaryLabel = mode === "edit" ? "Update Item" : "Add Item";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* modal */}
      <div className="relative w-full max-w-3xl bg-white border shadow-xl rounded-2xl">
        <button
          className="absolute text-gray-500 right-5 top-5 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <FiX size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="mt-1 text-gray-500">{subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Part Number
                </label>
                <Input
                  value={form.part}
                  onChange={setField("part")}
                  placeholder="ENG-001"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <Input
                  value={form.name}
                  onChange={setField("name")}
                  placeholder="Engine Oil 5W-30"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Category
                </label>

                <div className="relative">
                  <select
                    value={form.category}
                    onChange={setField("category")}
                    className="w-full px-3 py-2 bg-white border rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {options.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Supplier
                </label>
                <Input
                  value={form.supplier}
                  onChange={setField("supplier")}
                  placeholder="LubeTech"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <Input
                  type="number"
                  value={form.qty}
                  onChange={setField("qty")}
                  placeholder="0"
                  min={0}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Minimum Stock
                </label>
                <Input
                  type="number"
                  value={form.min}
                  onChange={setField("min")}
                  placeholder="0"
                  min={0}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <Input
                  value={form.price}
                  onChange={setField("price")}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Storage Location
                </label>
                <Input
                  value={form.location}
                  onChange={setField("location")}
                  placeholder="Shelf A1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border bg-white hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {primaryLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}