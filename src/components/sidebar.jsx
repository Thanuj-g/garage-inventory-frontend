import React from "react";
import {
  MdDashboard,
  MdInventory,
  MdTrendingDown,
  MdFolder,
  MdPeople,
  MdShoppingCart,
  MdArticle,
  MdLogout,
  MdSettings,
  MdBuild,
} from "react-icons/md";
import { NavLink } from "react-router-dom";
import { cn } from "./util";

export function Sidebar({ currentPage, onNavigate, onLogout }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: MdDashboard, to: "/dashboard" },
    { id: "inventory", label: "Inventory", icon: MdInventory, to: "/inventory" },
    { id: "stock-tracking", label: "Stock Tracking", icon: MdTrendingDown, to: "/stock-tracking" },
    { id: "categories", label: "Categories", icon: MdFolder, to: "/categories" },
    { id: "suppliers", label: "Suppliers", icon: MdPeople, to: "/suppliers" },
    { id: "sales", label: "Sales & Usage", icon: MdShoppingCart, to: "/sales" },
    { id: "purchase-orders", label: "Purchase Orders", icon: MdArticle, to: "/purchase-orders" },
  ];

  return (
    <aside className="sticky top-0 flex flex-col w-64 h-screen text-white bg-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <MdBuild className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold">Garage Inventory</h1>
            <p className="text-xs text-slate-400">Management System</p>
            <p className="mt-1 text-xs break-all text-slate-300">
              {window?.location?.href}
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.to}
              onClick={() => onNavigate && onNavigate(item.id)}
              className={({ isActive }) =>
                cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 space-y-1 border-t border-slate-700">
        <NavLink
          to="/settings"
          onClick={() => onNavigate && onNavigate("settings")}
          className={({ isActive }) =>
            cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )
          }
        >
          <MdSettings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>

        <button
          onClick={onLogout}
          className="flex items-center w-full gap-3 px-4 py-3 transition-colors rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <MdLogout className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
