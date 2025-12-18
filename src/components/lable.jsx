import React from "react";

export function Label({ children, className, ...props }) {
  return (
    <label {...props} className={`block text-gray-700 mb-1 ${className}`}>
      {children}
    </label>
  );
}
