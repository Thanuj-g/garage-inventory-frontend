import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { authFetch, getUser, logout } from "../lib/auth";
import { getPermissions } from "../lib/permissions";

const API_BASE = "http://127.0.0.1:8000";

export function SettingsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState("settings");

  const { isManager, isAdmin } = getPermissions();
  const isManagerOrAdmin = isManager || isAdmin;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    deliveries: false,
    sales: true,
  });

  const [settings, setSettings] = useState({
    garageName: "",
    email: "",
    phone: "",
    address: "",
    lowStockThreshold: "20",
    currency: "USD",
  });

  // URL-driven tabs
  const validTabs = useMemo(() => new Set(["profile", "notifications", "preferences", "security"]), []);
  const tabFromUrl = (searchParams.get("tab") || "profile").toLowerCase();
  const activeTab = validTabs.has(tabFromUrl) ? tabFromUrl : "profile";

  useEffect(() => {
    if (!validTabs.has(tabFromUrl)) {
      setSearchParams({ tab: "profile" }, { replace: true });
    }
  }, [tabFromUrl, validTabs, setSearchParams]);

  const goTab = (tab) => setSearchParams({ tab });

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setLoadError("");
        setSaveMsg("");

        const [gRes, pRes] = await Promise.all([
          authFetch(`${API_BASE}/api/settings/garage/`, { signal: controller.signal }),
          authFetch(`${API_BASE}/api/settings/me/preferences/`, { signal: controller.signal }),
        ]);

        if (!gRes.ok) throw new Error(`Failed to load garage settings (${gRes.status})`);
        if (!pRes.ok) throw new Error(`Failed to load preferences (${pRes.status})`);

        const g = await gRes.json();
        const p = await pRes.json();

        setSettings({
          garageName: g?.name ?? "",
          email: g?.email ?? "",
          phone: g?.phone ?? "",
          address: g?.address ?? "",
          lowStockThreshold: String(g?.low_stock_threshold ?? 20),
          currency: g?.currency ?? "USD",
        });

        setNotifications({
          lowStock: Boolean(p?.notify_low_stock),
          newOrders: Boolean(p?.notify_new_orders),
          deliveries: Boolean(p?.notify_deliveries),
          sales: Boolean(p?.notify_sales),
        });
      } catch (e) {
        if (e?.name !== "AbortError") setLoadError(e?.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const saveMyNotifications = async () => {
    try {
      setLoadError("");
      setSaveMsg("");

      const res = await authFetch(`${API_BASE}/api/settings/me/preferences/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notify_low_stock: notifications.lowStock,
          notify_new_orders: notifications.newOrders,
          notify_deliveries: notifications.deliveries,
          notify_sales: notifications.sales,
        }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Save failed (${res.status}) ${t}`.trim());
      }

      setSaveMsg("Notification settings saved.");
    } catch (e) {
      setLoadError(e?.message || "Failed to save notifications");
    }
  };

  const saveGarageSettings = async () => {
    if (!isManagerOrAdmin) return;

    try {
      setLoadError("");
      setSaveMsg("");

      const res = await authFetch(`${API_BASE}/api/settings/garage/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: settings.garageName,
          email: settings.email,
          phone: settings.phone,
          address: settings.address,
          low_stock_threshold: Number(settings.lowStockThreshold || 0),
          currency: settings.currency,
        }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Save failed (${res.status}) ${t}`.trim());
      }

      setSaveMsg("Garage settings saved.");
    } catch (e) {
      setLoadError(e?.message || "Failed to save garage settings");
    }
  };

  const exportInventoryCSV = async () => {
    if (!isManagerOrAdmin) return;

    const res = await authFetch(`${API_BASE}/api/settings/export/inventory/`);
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      setLoadError(`Export failed (${res.status}) ${t}`.trim());
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const dangerDeleteAllInventory = async () => {
    if (!isManagerOrAdmin) return;

    const ok = window.confirm("Delete ALL inventory items? This cannot be undone.");
    if (!ok) return;

    const res = await authFetch(`${API_BASE}/api/settings/danger/delete-all-inventory/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: "DELETE" }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      setLoadError(`Delete failed (${res.status}) ${t}`.trim());
      return;
    }

    setSaveMsg("All inventory items deleted.");
  };

  const me = getUser();

  const TabBtn = ({ value, children }) => {
    const active = activeTab === value;
    return (
      <button
        type="button"
        onClick={() => goTab(value)}
        className={[
          "px-4 py-2 text-sm rounded-full border",
          active ? "bg-white border-gray-300" : "bg-transparent border-transparent text-gray-600 hover:text-gray-900",
        ].join(" ")}
      >
        {children}
      </button>
    );
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

      <main className="flex-1 p-6 bg-gray-50">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500">
            {isManagerOrAdmin ? "Manager/Admin view" : "Staff view"} — restricted actions are hidden/disabled.
          </p>
          {loading && <div className="mt-2 text-sm text-gray-600">Loading...</div>}
          {loadError && <div className="mt-2 text-sm text-red-600">{loadError}</div>}
          {saveMsg && <div className="mt-2 text-sm text-green-700">{saveMsg}</div>}
        </div>

        <div className="p-3 mb-6 bg-white border border-gray-200 rounded-xl">
          <div className="flex gap-2">
            <TabBtn value="profile">Profile</TabBtn>
            <TabBtn value="notifications">Notifications</TabBtn>
            <TabBtn value="preferences">Preferences</TabBtn>
            <TabBtn value="security">Security</TabBtn>
          </div>
        </div>

        {activeTab === "profile" && (
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <h2 className="text-xl font-semibold">User Profile</h2>
            <div className="mt-3 space-y-1 text-sm text-gray-700">
              <div><span className="font-medium">Name:</span> {me?.name ?? "-"}</div>
              <div><span className="font-medium">Email:</span> {me?.email ?? "-"}</div>
              <div><span className="font-medium">Role:</span> {me?.role ?? "-"}</div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <h2 className="text-xl font-semibold">My Notifications</h2>

            <div className="mt-4 space-y-3">
              {[
                ["lowStock", "Low Stock Alerts"],
                ["newOrders", "New Purchase Orders"],
                ["deliveries", "Delivery Updates"],
                ["sales", "Sales Summary"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">{label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(notifications[key])}
                    onChange={(e) => setNotifications((p) => ({ ...p, [key]: e.target.checked }))}
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={saveMyNotifications}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Notifications
              </button>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <h2 className="text-xl font-semibold">Garage Preferences</h2>

            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-gray-600">Garage Name</label>
                <input
                  className="w-full px-3 py-2 mt-1 border rounded-lg"
                  disabled={!isManagerOrAdmin}
                  value={settings.garageName}
                  onChange={(e) => setSettings((p) => ({ ...p, garageName: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Currency</label>
                <select
                  className="w-full px-3 py-2 mt-1 border rounded-lg"
                  disabled={!isManagerOrAdmin}
                  value={settings.currency}
                  onChange={(e) => setSettings((p) => ({ ...p, currency: e.target.value }))}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="LKR">LKR</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Low Stock Threshold</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 mt-1 border rounded-lg"
                  disabled={!isManagerOrAdmin}
                  value={settings.lowStockThreshold}
                  onChange={(e) => setSettings((p) => ({ ...p, lowStockThreshold: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  className="w-full px-3 py-2 mt-1 border rounded-lg"
                  disabled={!isManagerOrAdmin}
                  value={settings.email}
                  onChange={(e) => setSettings((p) => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  className="w-full px-3 py-2 mt-1 border rounded-lg"
                  disabled={!isManagerOrAdmin}
                  value={settings.phone}
                  onChange={(e) => setSettings((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Address</label>
                <input
                  className="w-full px-3 py-2 mt-1 border rounded-lg"
                  disabled={!isManagerOrAdmin}
                  value={settings.address}
                  onChange={(e) => setSettings((p) => ({ ...p, address: e.target.value }))}
                />
              </div>
            </div>

            {isManagerOrAdmin ? (
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={exportInventoryCSV}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Export Inventory CSV
                </button>
                <button
                  type="button"
                  onClick={saveGarageSettings}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save Preferences
                </button>
              </div>
            ) : (
              <div className="mt-3 text-sm text-gray-500">Staff cannot edit garage preferences.</div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            <div className="p-6 bg-white border border-gray-200 rounded-xl">
              <h2 className="text-xl font-semibold">Security</h2>
              <p className="mt-2 text-sm text-gray-600">
                Password change is not wired yet (no backend endpoint in your workspace).
              </p>
            </div>

            {isManagerOrAdmin && (
              <div className="p-6 bg-white border border-red-200 rounded-xl">
                <h2 className="text-xl font-semibold text-red-700">Danger Zone</h2>
                <p className="mt-2 text-sm text-gray-600">Manager/Admin only.</p>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={dangerDeleteAllInventory}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Delete All Inventory Items
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default SettingsPage;