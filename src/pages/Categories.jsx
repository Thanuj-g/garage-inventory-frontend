import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { FiPlus, FiEdit, FiTrash2, FiFolder } from "react-icons/fi";
import AllCategoriesTable from "../components/AllCategoriesTable";
import AddCategoryModal from "../components/AddCategoryModal";

const API_BASE = "http://127.0.0.1:8000";

function mapFromApi(cat) {
	return {
		id: cat.id,
		name: cat.name,
		desc: cat.desc ?? "",
		color: cat.color ?? "bg-blue-500",
		items: Number(cat.items ?? 0),
	};
}

function mapToApi(payload) {
	return {
		name: payload.name,
		desc: payload.desc ?? "",
		color: payload.color ?? "bg-blue-500",
	};
}

export default function Categories() {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState("categories");

	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");

	const [isCategoryOpen, setIsCategoryOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);

	const loadCategories = async (signal) => {
		const res = await fetch(`${API_BASE}/api/categories/`, { signal });
		if (!res.ok) throw new Error(`Failed to load categories (${res.status})`);
		const json = await res.json();
		setCategories(Array.isArray(json) ? json.map(mapFromApi) : []);
	};

	useEffect(() => {
		const controller = new AbortController();

		(async () => {
			try {
				setLoading(true);
				setLoadError("");
				await loadCategories(controller.signal);
			} catch (e) {
				if (e?.name !== "AbortError")
					setLoadError(
						e?.message || "Failed to load categories"
					);
			} finally {
				setLoading(false);
			}
		})();

		return () => controller.abort();
	}, []);

	const openAdd = () => {
		setEditingCategory(null);
		setIsCategoryOpen(true);
	};

	const openEdit = (cat) => {
		// cat should include { id, name, desc, color, items }
		setEditingCategory(cat);
		setIsCategoryOpen(true);
	};

	const handleDelete = async (cat) => {
		if (!window.confirm(`Delete category "${cat.name}"?`)) return;

		if (!cat?.id) {
			setLoadError("Cannot delete: category has no id from server.");
			return;
		}

		try {
			setLoadError("");
			const res = await fetch(`${API_BASE}/api/categories/${cat.id}/`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(`Failed to delete (${res.status})`);

			setCategories((prev) => prev.filter((c) => c.id !== cat.id));
		} catch (e) {
			setLoadError(e?.message || "Failed to delete category");
		}
	};

	const handleSubmitCategory = async (payload) => {
		try {
			setLoadError("");
			const body = JSON.stringify(mapToApi(payload));

			// edit
			if (editingCategory?.id) {
				const res = await fetch(
					`${API_BASE}/api/categories/${editingCategory.id}/`,
					{
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body,
					}
				);
				if (!res.ok) throw new Error(`Failed to update (${res.status})`);
				const updated = mapFromApi(await res.json());

				setCategories((prev) =>
					prev.map((c) => (c.id === updated.id ? updated : c))
				);
				setIsCategoryOpen(false);
				setEditingCategory(null);
				return;
			}

			// add
			const res = await fetch(`${API_BASE}/api/categories/`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body,
			});
			if (!res.ok) throw new Error(`Failed to create (${res.status})`);
			const created = mapFromApi(await res.json());

			setCategories((prev) => [created, ...prev]);
			setIsCategoryOpen(false);
			setEditingCategory(null);
		} catch (e) {
			setLoadError(e?.message || "Failed to save category");
		}
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

						{loading && (
							<div className="mt-2 text-sm text-gray-600">
								Loading categories...
							</div>
						)}
						{loadError && (
							<div className="mt-2 text-sm text-red-600">
								{loadError}
							</div>
						)}
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
							key={cat.id ?? cat.name}
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