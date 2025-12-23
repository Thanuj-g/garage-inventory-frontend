import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Header from "../components/Header";
import SearchFilter from "../components/SearchFilter";
import ActionButtons from "../components/ActionButtons";

const initialData = [
  { part: "ENG-001", name: "Engine Oil 5W-30", category: "Oils & Fluids", qty: 45, min: 20, price: "$25.99", location: "Shelf A1" },
  { part: "BRK-102", name: "Brake Pads - Front", category: "Brake System", qty: 28, min: 15, price: "$89.99", location: "Shelf B3" },
  { part: "ENG-015", name: "Air Filter", category: "Engine Parts", qty: 34, min: 10, price: "$15.50", location: "Shelf A2" },
  { part: "ENG-022", name: "Spark Plugs Set", category: "Engine Parts", qty: 67, min: 25, price: "$32.99", location: "Shelf A3" },
  { part: "FLD-008", name: "Coolant 5L", category: "Oils & Fluids", qty: 22, min: 15, price: "$18.75", location: "Shelf A1" },
  { part: "BRK-205", name: "Brake Fluid DOT 4", category: "Brake System", qty: 31, min: 12, price: "$12.99", location: "Shelf B1" },
  { part: "ELC-101", name: "Car Battery 12V", category: "Electrical", qty: 8, min: 5, price: "$149.99", location: "Storage C" },
  { part: "TYR-401", name: "Tire 205/55R16", category: "Tires", qty: 16, min: 8, price: "$95.00", location: "Tire Rack" },
];

export default function InventoryPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("inventory");
  const [data, setData] = useState(initialData);
  const [query, setQuery] = useState("");

  const handleAdd = () => alert("Add item (implement form)");
  const handleSearch = (q) => setQuery(q || "");

  const filtered = data.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.part.toLowerCase().includes(query.toLowerCase())
  );

  const handleEdit = (item) => alert(`Edit ${item.part} (implement)`);
  const handleDelete = (item) => {
    if (!window.confirm(`Delete ${item.part}?`)) return;
    setData((prev) => prev.filter((p) => p.part !== item.part));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          navigate(`/${page}`);
        }}
        onLogout={() => navigate("/")}
      />

      <main className="flex-1 min-h-screen p-6 bg-gray-50">
        <Header onAdd={handleAdd} />
        <SearchFilter onSearch={handleSearch} onFilter={() => alert("Filter")} />

        <div className="overflow-x-auto bg-white shadow-sm rounded-xl">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="p-4">Part Number</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Min Stock</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Location</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, index) => (
                <tr key={index} className="transition border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{item.part}</td>
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">{item.qty}</td>
                  <td className="p-4">{item.min}</td>
                  <td className="p-4">{item.price}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 text-sm text-white bg-black rounded-full">In Stock</span>
                  </td>
                  <td className="p-4">{item.location}</td>
                  <td className="p-4">
                    <ActionButtons onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}