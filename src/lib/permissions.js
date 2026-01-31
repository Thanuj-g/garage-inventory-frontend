import { getUser } from "./auth";

export function getRole() {
  return String(getUser()?.role || "staff").toLowerCase();
}

export function getPermissions() {
  const role = getRole();
  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isStaff = role === "staff";

  // General rule (keep for pages that are manager/admin-only)
  const canWrite = isAdmin || isManager;
  const canDelete = isAdmin || isManager;

  // Inventory rule (staff can add/edit, cannot delete)
  const canWriteInventory = isAdmin || isManager || isStaff;
  const canDeleteInventory = isAdmin || isManager;

  // Categories rule (NEW: staff can add/edit, cannot delete)
  const canWriteCategories = isAdmin || isManager || isStaff;
  const canDeleteCategories = isAdmin || isManager;

  return {
    role,
    isAdmin,
    isManager,
    isStaff,
    canWrite,
    canDelete,
    canWriteInventory,
    canDeleteInventory,
    canWriteCategories,
    canDeleteCategories,
  };
}