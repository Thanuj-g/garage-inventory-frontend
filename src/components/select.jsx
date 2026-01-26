import React, { useState } from 'react';

export function Select({ children, value, onValueChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      {React.Children.map(children, child =>
        React.cloneElement(child, { selectedValue: value, onSelect: onValueChange, isOpen: open, setOpen })
      )}
    </div>
  );
}

export function SelectTrigger({ children, setOpen, isOpen }) {
  return (
    <button
      type="button"
      onClick={() => setOpen(!isOpen)}
      className="w-full text-left px-2 py-2"
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder, selectedValue }) {
  return <span>{selectedValue || placeholder}</span>;
}

export function SelectContent({ children, isOpen }) {
  return isOpen ? (
    <div className="absolute left-0 mt-1 w-full bg-white border rounded shadow z-50">
      {children}
    </div>
  ) : null;
}

export function SelectItem({ value, children, onSelect, setOpen }) {
  return (
    <div
      onClick={() => {
        onSelect(value);
        setOpen(false);
      }}
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
    >
      {children}
    </div>
  );
}