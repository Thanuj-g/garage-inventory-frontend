import React, { useEffect, useMemo, useState } from "react";

export default function CreatePurchaseOrderModal({
  isOpen,
  onClose,
  onSubmit, // (payload) => void
  supplierOptions = [], // string[]
}) {
  const emptyForm = useMemo(
    () => ({
      supplier: "",
      expectedDate: "", // yyyy-mm-dd
      items: "",
      amount: "",
      notes: "",
    }),
    []
  );

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) return;
    setForm(emptyForm);
  }, [isOpen, emptyForm]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const setField = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      supplier: String(form.supplier || "").trim(),
      expectedDate: String(form.expectedDate || "").trim(),
      items: String(form.items || "").trim(),
      amount: Number(form.amount),
      notes: String(form.notes || "").trim(),
    };

    if (!payload.supplier || !payload.expectedDate || !payload.items) return;
    if (!Number.isFinite(payload.amount) || payload.amount < 0) return;

    onSubmit?.(payload);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl mx-4 bg-white shadow-xl rounded-2xl">
        <div className="flex items-start justify-between p-5 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create Purchase Order
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Submit a new purchase order to a supplier
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            {/* Supplier */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Supplier
              </label>
              <select
                value={form.supplier}
                onChange={setField("supplier")}
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select supplier</option>
                {supplierOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Expected Delivery Date */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Expected Delivery Date
              </label>
              <input
                type="date"
                value={form.expectedDate}
                onChange={setField("expectedDate")}
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Items & Quantities */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Items &amp; Quantities
              </label>
              <textarea
                rows={2}
                value={form.items}
                onChange={setField("items")}
                placeholder="Engine Oil 5W-30 (50 units), Air Filters (30 units)"
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Total Amount */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Total Amount ($)
              </label>
              <input
                inputMode="decimal"
                value={form.amount}
                onChange={setField("amount")}
                placeholder="1299.50"
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={setField("notes")}
                placeholder="Special instructions or notes"
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-white border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}