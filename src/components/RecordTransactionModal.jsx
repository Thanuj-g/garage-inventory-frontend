import React, { useEffect, useMemo, useState } from "react";

export default function RecordTransactionModal({ isOpen, onClose, onSubmit }) {
  const emptyForm = useMemo(
    () => ({
      txnType: "Sale", // "Sale" | "Usage"
      partNumber: "",
      itemName: "",
      qty: "1",
      unitPrice: "",
      customerOrPurpose: "",
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

    const qty = Number(form.qty);
    const unitPrice = Number(form.unitPrice);

    const payload = {
      type: form.txnType === "Usage" ? "Usage" : "Sale",
      partNumber: String(form.partNumber || "").trim(),
      item: String(form.itemName || "").trim(),
      qty: Number.isFinite(qty) ? qty : 0,
      price: Number.isFinite(unitPrice) ? unitPrice : 0,
      customer: String(form.customerOrPurpose || "").trim(),
    };

    if (!payload.item) return;
    if (!Number.isFinite(payload.qty) || payload.qty <= 0) return;
    if (!Number.isFinite(payload.price) || payload.price < 0) return;

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
              Record New Transaction
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a sale or internal usage record
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
            {/* Transaction Type */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Transaction Type
              </label>
              <select
                value={form.txnType}
                onChange={setField("txnType")}
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="Sale">Sale to Customer</option>
                <option value="Usage">Internal Usage</option>
              </select>
            </div>

            {/* 2-col inputs */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Part Number
                </label>
                <input
                  value={form.partNumber}
                  onChange={setField("partNumber")}
                  placeholder="ENG-001"
                  className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  value={form.itemName}
                  onChange={setField("itemName")}
                  placeholder="Engine Oil 5W-30"
                  className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  value={form.qty}
                  onChange={setField("qty")}
                  inputMode="numeric"
                  placeholder="1"
                  className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Unit Price ($)
                </label>
                <input
                  value={form.unitPrice}
                  onChange={setField("unitPrice")}
                  inputMode="decimal"
                  placeholder="25.99"
                  className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Customer / Purpose
              </label>
              <input
                value={form.customerOrPurpose}
                onChange={setField("customerOrPurpose")}
                placeholder="John Doe - Honda Civic / Internal Workshop"
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
              Record Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}