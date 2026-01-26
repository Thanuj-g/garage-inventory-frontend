import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import Categories from "./pages/Categories";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import SalesAndUsagePage from "./pages/SalesAndUsagePage";
import { SettingsPage } from "./pages/SettingsPage";
import PurchaseOrdersPage from "./pages/purchesOrder";
import StockTrackingPage from "./pages/StockTrackingPage";
import SupplierManagementPage from "./pages/SupplierManagementPage";

import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated } from "./lib/auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated() ? "/dashboard" : "/login"}
              replace
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
        <Route path="/sales" element={<ProtectedRoute><SalesAndUsagePage /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrdersPage /></ProtectedRoute>} />
        <Route path="/stock-tracking" element={<ProtectedRoute><StockTrackingPage /></ProtectedRoute>} />
        <Route path="/suppliers" element={<ProtectedRoute><SupplierManagementPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
