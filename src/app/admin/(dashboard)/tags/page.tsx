"use client";

import { useEffect, useState } from "react";
import type { Tag } from "@/types";

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", color: "#6366f1" });
  const [error, setError] = useState("");

  const fetchTags = async () => {
    const res = await fetch("/api/admin/tags");
    if (res.ok) setTags(await res.json());
  };

  useEffect(() => { fetchTags(); }, []);

  const generateSlug = (name: string) => {
    setForm((f) => ({ ...f, slug: name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const url = editing ? `/api/admin/tags/${editing.id}` : "/api/admin/tags";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      setForm({ name: "", slug: "", color: "#6366f1" });
      setEditing(null);
      fetchTags();
    } catch {
      setError("Failed to save");
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditing(tag);
    setForm({ name: tag.name, slug: tag.slug, color: tag.color });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tag?")) return;
    await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
    fetchTags();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Tags</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">{editing ? "Edit Tag" : "New Tag"}</h2>
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
              <label className="block text-sm text-gray-400 mb-1">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-gray-800 border-0"
                />
                <input
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                {editing ? "Update" : "Create"}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ name: "", slug: "", color: "#6366f1" }); }} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            {tags.length === 0 ? (
              <p className="text-gray-500 text-sm p-6">No tags yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-left">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Color</th>
                    <th className="px-4 py-3 font-medium">Assets</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag) => (
                    <tr key={tag.id} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-white">{tag.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: tag.color }} />
                          <span className="text-gray-400 font-mono text-xs">{tag.color}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{tag._count?.assets || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(tag)} className="text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors">Edit</button>
                          <button onClick={() => handleDelete(tag.id)} className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors">Delete</button>
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
