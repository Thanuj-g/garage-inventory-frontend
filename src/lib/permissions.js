import { getUser } from "./auth";

export function getRole() {
  return String(getUser()?.role || "staff").toLowerCase();
}

export function getPermissions() {
  const role = getRole();
  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isStaff = role === "staff";

  // Your rule: manager/admin can do everything; staff read-only
  const canWrite = isAdmin || isManager;
  const canDelete = isAdmin || isManager;

  return { role, isAdmin, isManager, isStaff, canWrite, canDelete };
}