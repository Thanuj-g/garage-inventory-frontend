import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { FiPlus, FiEdit, FiTrash2, FiFolder } from "react-icons/fi";
import AllCategoriesTable from "../components/AllCategoriesTable";
import AddCategoryModal from "../components/AddCategoryModal";

const initialCategories = [
	{
		name: "Engine Parts",
		items: 156,
		desc: "All engine-related components and parts",
		color: "bg-blue-500",
	},
	{
		name: "Brake System",
		items: 89,
		desc: "Brake pads, discs, calipers, and fluids",
		color: "bg-red-500",
	},
	{
		name: "Oils & Fluids",
		items: 67,
		desc: "Engine oils, transmission fluids, coolants",
		color: "bg-orange-500",
	},
	{
		name: "Electrical",
		items: 102,
		desc: "Batteries, alternators, starters, wiring",
		color: "bg-yellow-500",
	},
	{
		name: "Tires",
		items: 45,
		desc: "Tires and wheel-related components",
		color: "bg-slate-700",
	},
	{
		name: "Suspension",
		items: 78,
		desc: "Shocks, struts, springs, and bushings",
		color: "bg-purple-500",
	},
];

export default function Categories() {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState("categories");

	const [categories, setCategories] = useState(initialCategories);

	const [isCategoryOpen, setIsCategoryOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);

	const openAdd = () => {
		setEditingCategory(null);
		setIsCategoryOpen(true);
	};

	const openEdit = (cat) => {
		setEditingCategory(cat); // cat must include { name, desc, color, items }
		setIsCategoryOpen(true);
	};

	const handleDelete = (cat) => {
		if (!window.confirm(`Delete category "${cat.name}"?`)) return;
		setCategories((prev) => prev.filter((c) => c.name !== cat.name));
	};

	const handleSubmitCategory = (payload) => {
		// edit mode
		if (editingCategory) {
			const originalName = payload.originalName || editingCategory.name;

			setCategories((prev) =>
				prev.map((c) =>
					c.name === originalName
						? {
								...c,
								name: payload.name,
								desc: payload.desc,
								color: payload.color,
						  }
						: c
				)
			);
			return;
		}

		// add mode
		setCategories((prev) => [
			{
				name: payload.name,
				desc: payload.desc,
				color: payload.color,
				items: 0,
			},
			...prev,
		]);
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

			<main className="flex-1 p-6 bg-gray-50">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-3xl font-bold">Category Management</h1>
						<p className="text-gray-500">
							Organize your inventory into categories
						</p>
					</div>

					<button
						onClick={openAdd}
						className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
					>
						<FiPlus size={18} />
						Add Category
					</button>
				</div>

				{/* Category Cards */}
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{categories.map((cat) => (
						<div
							key={cat.name}
							className="p-6 transition bg-white shadow-sm rounded-xl hover:shadow-md"
						>
							<div className="flex items-center gap-4 mb-4">
								<div
									className={`w-12 h-12 flex items-center justify-center rounded-lg text-white ${cat.color}`}
								>
									<FiFolder size={22} />
								</div>

								<div>
									<h2 className="text-lg font-semibold">{cat.name}</h2>
									<span className="px-3 py-1 text-sm bg-gray-100 rounded-full">
										{cat.items} items
									</span>
								</div>
							</div>

							<p className="mb-6 text-gray-600">{cat.desc}</p>

							<div className="flex items-center gap-3">
								<button
									onClick={() => openEdit(cat)}
									className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
								>
									<FiEdit size={16} />
									Edit
								</button>

								<button
									onClick={() => handleDelete(cat)}
									className="p-2 text-red-500 border rounded-lg hover:bg-red-50"
									aria-label="Delete"
								>
									<FiTrash2 size={18} />
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Table below */}
				<AllCategoriesTable
					categories={categories}
					onEdit={openEdit}
					onDelete={handleDelete}
				/>

				{/* Modal */}
				<AddCategoryModal
					isOpen={isCategoryOpen}
					onClose={() => {
						setIsCategoryOpen(false);
						setEditingCategory(null);
					}}
					mode={editingCategory ? "edit" : "add"}
					initialValues={editingCategory}
					onSubmit={handleSubmitCategory}
				/>
			</main>
		</div>
	);
}