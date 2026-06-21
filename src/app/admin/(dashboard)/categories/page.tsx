"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", showOnHome: false, sortOrder: 0 });
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
  };

  useEffect(() => { fetchCategories(); }, []);

  const generateSlug = (name: string) => {
    setForm((f) => ({ ...f, slug: name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      setForm({ name: "", slug: "", description: "", showOnHome: false, sortOrder: 0 });
      setEditing(null);
      fetchCategories();
    } catch {
      setError("Failed to save");
    }
  };

  const handleEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, showOnHome: cat.showOnHome, sortOrder: cat.sortOrder });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", showOnHome: false, sortOrder: 0 });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">{editing ? "Edit Category" : "New Category"}</h2>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Slug</label>
              <div className="flex gap-2">
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <button type="button" onClick={() => generateSlug(form.name)} className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 rounded-lg transition-colors">Auto</button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px] resize-y"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showOnHome}
                  onChange={(e) => setForm({ ...form, showOnHome: e.target.checked })}
                  className="w-4 h-4 rounded accent-purple-600"
                />
                <span className="text-sm text-gray-300">Show on Homepage</span>
              </label>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                {editing ? "Update" : "Create"}
              </button>
              {editing && (
                <button type="button" onClick={handleCancel} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            {categories.length === 0 ? (
              <p className="text-gray-500 text-sm p-6">No categories yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-left">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Home</th>
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Assets</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-white">{cat.name}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${cat.showOnHome ? "bg-green-600/20 text-green-400" : "bg-gray-700 text-gray-500"}`}>
                          {cat.showOnHome ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{cat.sortOrder}</td>
                      <td className="px-4 py-3 text-gray-400">{cat._count?.assets || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(cat)} className="text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors">Edit</button>
                          <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
