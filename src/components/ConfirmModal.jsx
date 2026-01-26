import React, { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  destructive = true,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    const t = setTimeout(() => confirmRef.current?.focus(), 0);

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const confirmBtnClass = destructive
    ? "bg-red-600 hover:bg-red-700"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => (loading ? null : onClose?.())}
        aria-hidden="true"
      />

      {/* modal (small) */}
      <div className="relative w-full max-w-md bg-white border shadow-xl rounded-2xl">
        <button
          className="absolute text-gray-500 right-5 top-5 hover:text-gray-800"
          onClick={() => (loading ? null : onClose?.())}
          aria-label="Close"
          type="button"
        >
          <FiX size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-2 text-gray-600">{message}</p>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => onClose?.()}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-60"
            >
              {cancelText}
            </button>

            <button
              ref={confirmRef}
              type="button"
              onClick={() => onConfirm?.()}
              disabled={loading}
              className={`px-5 py-2.5 rounded-lg text-white disabled:opacity-60 ${confirmBtnClass}`}
            >
              {loading ? "Deleting..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}