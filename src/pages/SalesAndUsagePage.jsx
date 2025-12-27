import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/sidebar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/card";
import {
    Plus,
    DollarSign,
    ShoppingCart,
    Package,
    TrendingUp,
    ChevronDown,
    Check,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const weeklyData = [
    { day: "Mon", sales: 280, usage: 40 },
    { day: "Tue", sales: 420, usage: 60 },
    { day: "Wed", sales: 320, usage: 30 },
    { day: "Thu", sales: 560, usage: 50 },
    { day: "Fri", sales: 680, usage: 70 },
    { day: "Sat", sales: 420, usage: 20 },
    { day: "Sun", sales: 180, usage: 10 },
];

const transactionData = [
    {
        id: "TR-001",
        item: "Engine Oil 5W-30",
        qty: 3,
        price: 25.99,
        total: 77.97,
        customer: "John Doe - Honda Civic",
        type: "Sale",
    },
    {
        id: "TR-102",
        item: "Brake Pads - Front",
        qty: 1,
        price: 89.99,
        total: 89.99,
        customer: "Sarah Smith - Toyota Camry",
        type: "Sale",
    },
    {
        id: "TR-015",
        item: "Air Filter",
        qty: 2,
        price: 15.50,
        total: 31.00,
        customer: "Mike Johnson - Ford F-150",
        type: "Sale",
    },
    {
        id: "TR-008",
        item: "Coolant 5L",
        qty: 1,
        price: 18.75,
        total: 18.75,
        customer: "Internal Workshop",
        type: "Usage",
    },
    {
        id: "TR-205",
        item: "Brake Fluid DOT 4",
        qty: 2,
        price: 12.99,
        total: 25.98,
        customer: "Emma Wilson - Mazda CX-5",
        type: "Sale",
    },
    {
        id: "TR-022",
        item: "Spark Plugs Set",
        qty: 1,
        price: 32.99,
        total: 32.99,
        customer: "David Brown - BMW 3 Series",
        type: "Sale",
    },
    {
        id: "TR-101",
        item: "Car Battery 12V",
        qty: 1,
        price: 149.99,
        total: 149.99,
        customer: "Lisa Anderson - Nissan Altima",
        type: "Sale",
    },
    {
        id: "TR-401",
        item: "Tire 205/55R16",
        qty: 4,
        price: 95.00,
        total: 380.00,
        customer: "Robert Taylor - Hyundai Elantra",
        type: "Sale",
    },
];

export default function SalesAndUsagePage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState("sales");
    const [filterType, setFilterType] = useState("All Transactions");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const filteredData = transactionData.filter((item) => {
        if (filterType === "Sales Only") return item.type === "Sale";
        if (filterType === "Usage Only") return item.type === "Usage";
        return true;
    });

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

            <main className="flex-1 bg-slate-800 text-white p-6 space-y-6 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl mb-1 font-bold">Sales & Usage Tracking</h2>
                        <p className="text-blue-200">Monitor sales and internal usage</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Plus className="w-5 h-5" />
                        Record Transaction
                    </button>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-blue-500/20 backdrop-blur-lg border-blue-500/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold flex items-center gap-2">
                                <span className="text-green-400 text-xl font-normal">$</span>787.92
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-500/20 backdrop-blur-lg border-blue-500/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white text-sm font-medium">Today's Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold flex items-center gap-2">
                                <ShoppingCart className="w-6 h-6 text-blue-400" /> 0
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-500/20 backdrop-blur-lg border-blue-500/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white text-sm font-medium">Items Sold</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold flex items-center gap-2">
                                <Package className="w-6 h-6 text-purple-400" /> 14
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-500/20 backdrop-blur-lg border-blue-500/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white text-sm font-medium">Avg Transaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-orange-400" /> $112.56
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart Section */}
                <Card className="bg-blue-500/20 backdrop-blur-lg border-blue-500/30">
                    <CardHeader>
                        <CardTitle className="text-white">Weekly Sales vs Usage</CardTitle>
                        <p className="text-sm text-blue-200">Sales revenue and internal usage over the week</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
                                <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                    itemStyle={{ color: '#f1f5f9' }}
                                    cursor={{ fill: '#ffffff10' }}
                                />
                                <Legend />
                                <Bar dataKey="sales" name="Sales ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                <Bar dataKey="usage" name="Usage ($)" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Transactions Table */}
                <Card className="bg-blue-500/20 backdrop-blur-lg border-blue-500/30">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-white">Transaction History</CardTitle>
                            <p className="text-sm text-blue-200">Recent sales and usage records</p>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-slate-700/50 hover:bg-slate-700 px-3 py-1.5 rounded-md text-sm text-slate-300 border border-slate-600 flex items-center gap-2 transition-colors w-40 justify-between"
                            >
                                <span>{filterType}</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-20 text-sm">
                                    {["All Transactions", "Sales Only", "Usage Only"].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setFilterType(option);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-left hover:bg-slate-700 text-slate-300 flex items-center justify-between"
                                        >
                                            {option}
                                            {filterType === option && <Check className="w-4 h-4 text-blue-400" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-blue-100">
                                <thead className="text-xs uppercase bg-blue-500/10 text-blue-200">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Number</th>
                                        <th className="px-4 py-3">Item Name</th>
                                        <th className="px-4 py-3">Quantity</th>
                                        <th className="px-4 py-3">Unit Price</th>
                                        <th className="px-4 py-3">Total</th>
                                        <th className="px-4 py-3">Customer/Purpose</th>
                                        <th className="px-4 py-3 rounded-r-lg">Type</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-500/10">
                                    {filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-500/5 transition-colors">
                                            <td className="px-4 py-3 font-medium text-white">{item.id}</td>
                                            <td className="px-4 py-3">{item.item}</td>
                                            <td className="px-4 py-3">{item.qty}</td>
                                            <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                                            <td className="px-4 py-3 font-semibold text-white">${item.total.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-slate-300">{item.customer}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.type === 'Sale'
                                                    ? 'bg-black text-white border border-slate-600'
                                                    : 'bg-slate-200 text-slate-800'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
