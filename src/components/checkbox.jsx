import React from "react";

export function Checkbox({ checked, onCheckedChange, ...props }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      {...props}
      className="w-4 h-4 text-blue-600 rounded border-gray-300"
    />
  );
}
