import React, { useState } from 'react';

export function Tabs({ defaultValue, children, className }) {
  const [value, setValue] = useState(defaultValue);
  const handleValueChange = (newValue) => setValue(newValue);
  return (
    <div className={className}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeValue: value, onValueChange: handleValueChange })
      )}
    </div>
  );
}

export function TabsList({ children, className }) {
  return <div className={`flex ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, children, className, activeValue, onValueChange }) {
  return <button onClick={() => onValueChange(value)} className={`${className} ${activeValue === value ? 'active' : ''}`}>{children}</button>;
}

export function TabsContent({ value, children, activeValue }) {
  return activeValue === value ? <div>{children}</div> : null;
}