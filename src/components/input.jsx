import React from "react";

function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      className={`border rounded px-3 py-2 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}

export { Input };
