import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import AddSupplierModal from "../components/AddSupplierModal";
import { FaBuilding, FaUsers, FaStar, FaPlus, FaPhone, FaEnvelope } from "react-icons/fa";

export default function SupplierManagementPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("suppliers");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [suppliers, setSuppliers] = useState([
    {
      name: "LubeTech Industries",
      contact: "John Smith",
      email: "john@lubetech.com",
      phone: "+1 555-0101",
      products: "Oils, Lubricants, Fluids",
      rating: 4.8,
      orders: 145,
    },
    {
      name: "AutoParts Co",
      contact: "Sarah Johnson",
      email: "sarah@autoparts.com",
      phone: "+1 555-0102",
      products: "Brake Systems, Suspension",
      rating: 4.6,
      orders: 98,
    },
    {
      name: "FilterMax Solutions",
      contact: "Mike Davis",
      email: "mike@filtermax.com",
      phone: "+1 555-0103",
      products: "Filters, Air Systems",
      rating: 4.9,
      orders: 167,
    },
    {
      name: "SparkPlus Distribution",
      contact: "Emma Wilson",
      email: "emma@sparkplus.com",
      phone: "+1 555-0104",
      products: "Ignition Parts, Engine Components",
      rating: 4.5,
      orders: 76,
    },
  ]);

  const totalSuppliers = suppliers.length;
  const activeSuppliers = Math.max(0, suppliers.length - 1); // example
  const totalOrders = suppliers.reduce((sum, s) => sum + (Number(s.orders) || 0), 0);
  const averageRating =
    suppliers.length > 0
      ? (
          suppliers.reduce((sum, s) => sum + (Number(s.rating) || 0), 0) /
          suppliers.length
        ).toFixed(1)
      : "0.0";

  const handleAddSupplier = (payload) => {
    setSuppliers((prev) => [
      {
        name: payload.name,
        contact: payload.contact,
        email: payload.email,
        phone: payload.phone,
        products: payload.products,
        rating: 0,
        orders: 0,
        // keep address if you want later in table/cards
        address: payload.address,
      },
      ...prev,
    ]);
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          navigate(`/${page}`);
        }}
        onLogout={() => navigate("/")}
      />

      <main className="flex-1 min-h-screen p-6 overflow-y-auto bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
            <p className="text-gray-500">Manage your suppliers and contacts</p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
          >
            <FaPlus className="mr-2" /> Add Supplier
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
          <div className="flex items-center p-4 space-x-4 bg-white rounded shadow">
            <FaBuilding className="text-2xl text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Suppliers</p>
              <p className="text-lg font-bold">{totalSuppliers}</p>
            </div>
          </div>

          <div className="flex items-center p-4 space-x-4 bg-white rounded shadow">
            <FaUsers className="text-2xl text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Active Suppliers</p>
              <p className="text-lg font-bold">{activeSuppliers}</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-lg font-bold">{totalOrders}</p>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="text-lg font-bold">{averageRating} / 5.0</p>
          </div>
        </div>

        {/* Supplier Table */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="mb-4 text-lg font-semibold">All Suppliers</h2>
          <p className="mb-4 text-gray-500">Complete list of your supplier network</p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Company Name</th>
                  <th className="p-2 text-left">Contact Person</th>
                  <th className="p-2 text-left">Contact Info</th>
                  <th className="p-2 text-left">Products</th>
                  <th className="p-2 text-left">Rating</th>
                  <th className="p-2 text-left">Orders</th>
                </tr>
              </thead>

              <tbody>
                {suppliers.map((s, idx) => (
                  <tr key={`${s.name}-${idx}`} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{s.name}</td>
                    <td className="p-2">{s.contact}</td>
                    <td className="p-2 space-y-1">
                      <div className="flex items-center space-x-2">
                        <FaEnvelope className="text-gray-400" /> <span>{s.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaPhone className="text-gray-400" /> <span>{s.phone}</span>
                      </div>
                    </td>
                    <td className="p-2">{s.products}</td>
                    <td className="p-2">
                      <span className="inline-flex items-center">
                        <FaStar className="mr-1 text-yellow-400" />{" "}
                        {Number(s.rating || 0).toFixed(1)}
                      </span>
                    </td>
                    <td className="p-2">{s.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AddSupplierModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddSupplier}
        />
      </main>
    </div>
  );
}