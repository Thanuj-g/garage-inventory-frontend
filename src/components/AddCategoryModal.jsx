import React, { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { Input } from "./input";

const COLOR_TAGS = [
  { id: "blue", className: "bg-blue-500" },
  { id: "red", className: "bg-red-500" },
  { id: "green", className: "bg-green-500" },
  { id: "yellow", className: "bg-yellow-500" },
  { id: "purple", className: "bg-purple-500" },
  { id: "pink", className: "bg-pink-500" },
  { id: "cyan", className: "bg-cyan-500" },
  { id: "orange", className: "bg-orange-500" },
  { id: "slate", className: "bg-slate-700" },
  { id: "indigo", className: "bg-indigo-500" },
];

function normalizeColor(value, fallback) {
  const v = String(value || "").trim();
  if (!v) return fallback;

  // If user stored the Tailwind class directly
  if (COLOR_TAGS.some((c) => c.className === v)) return v;

  // If user stored the id like "yellow"
  const byId = COLOR_TAGS.find((c) => c.id === v);
  if (byId) return byId.className;

  return fallback;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  mode = "add",
  initialValues = null,
  onSubmit,
}) {
  const defaultColor = useMemo(() => COLOR_TAGS[0].className, []);

  const [form, setForm] = useState({
    name: "",
    desc: "",
    color: defaultColor,
  });

  useEffect(() => {
    if (!isOpen) return;

    const iv = initialValues || {};
    setForm({
      name: iv.name ?? "",
      desc: iv.desc ?? "",
      color: normalizeColor(iv.color, defaultColor),
    });

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, initialValues, onClose, defaultColor]);

  if (!isOpen) return null;

  const title = mode === "edit" ? "Edit Category" : "Add New Category";
  const subTitle =
    mode === "edit"
      ? "Update the category details"
      : "Create a new category for organizing inventory";
  const primaryLabel = mode === "edit" ? "Update Category" : "Add Category";

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: String(form.name || "").trim(),
      desc: String(form.desc || "").trim(),
      color: normalizeColor(form.color, defaultColor),
      items: initialValues?.items ?? 0,
      originalName: initialValues?.name,
    };

    if (!payload.name) return;

    onSubmit?.(payload);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

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
          <p className="mt-1 text-gray-500">{subTitle}</p>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, name: e.target.value }))
                  }
                  placeholder="e.g., Engine Parts"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={form.desc}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, desc: e.target.value }))
                  }
                  placeholder="Brief description of the category"
                  rows={4}
                  className="w-full px-3 py-2 placeholder-gray-400 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-3 text-sm font-medium text-gray-700">
                  Color Tag
                </label>

                <div className="grid grid-cols-5 gap-3">
                  {COLOR_TAGS.map((c) => {
                    const active = form.color === c.className;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() =>
                          setForm((s) => ({ ...s, color: c.className }))
                        }
                        className={[
                          "h-12 rounded-xl",
                          c.className,
                          active
                            ? "ring-2 ring-blue-600 ring-offset-2"
                            : "ring-1 ring-black/5",
                        ].join(" ")}
                        aria-label={`Select ${c.id}`}
                        title={`Select ${c.id}`}
                      />
                    );
                  })}
                </div>
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