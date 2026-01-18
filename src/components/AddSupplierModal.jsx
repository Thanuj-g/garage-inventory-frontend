import React, { useEffect, useMemo, useState } from "react";

export default function AddSupplierModal({
  isOpen,
  onClose,
  onSubmit, // (payload) => void
}) {
  const emptyForm = useMemo(
    () => ({
      name: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      products: "",
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
      name: form.name.trim(),
      contact: form.contact.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      products: form.products.trim(),
    };

    // minimal validation
    if (!payload.name || !payload.contact) return;

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
      <div className="relative w-full max-w-2xl mx-4 bg-white shadow-xl rounded-2xl">
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Supplier
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a new supplier to your network
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                value={form.name}
                onChange={setField("name")}
                placeholder="LubeTech Industries"
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Contact Person
              </label>
              <input
                value={form.contact}
                onChange={setField("contact")}
                placeholder="John Smith"
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                value={form.email}
                onChange={setField("email")}
                placeholder="contact@supplier.com"
                type="email"
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                value={form.phone}
                onChange={setField("phone")}
                placeholder="+1 555-0100"
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                value={form.address}
                onChange={setField("address")}
                placeholder="123 Industrial Ave, Detroit, MI"
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Products Supplied
              </label>
              <textarea
                value={form.products}
                onChange={setField("products")}
                placeholder="Oils, Lubricants, Fluids"
                rows={3}
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
              Add Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}