import React from 'react';

export function Switch({ checked, onCheckedChange, className, ...props }) {
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`} {...props}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      <div className={`relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-gray-300 rounded-full ${checked ? 'bg-blue-600' : ''}`}>
        <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${checked ? 'translate-x-4' : ''}`}></span>
      </div>
    </label>
  );
}