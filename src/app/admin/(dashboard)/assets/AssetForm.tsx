"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Tag } from "@/types";

export function AssetForm({ assetId }: { assetId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    type: "MODEL",
    previewType: "IMAGE",
    previewUrl: "",
    videoUrl: "",
    googleDriveLink: "",
    displayPrice: "",
    description: "",
    published: false,
    categoryId: "",
  });

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then(setCategories).catch(() => {});
    fetch("/api/admin/tags").then((r) => r.json()).then(setTags).catch(() => {});
    if (assetId) {
      setLoading(true);
      fetch(`/api/admin/assets/${assetId}`)
        .then((r) => r.json())
        .then((asset) => {
          setForm({
            title: asset.title,
            slug: asset.slug,
            type: asset.type,
            previewType: asset.previewType,
            previewUrl: asset.previewUrl,
            videoUrl: asset.videoUrl || "",
            googleDriveLink: asset.googleDriveLink,
            displayPrice: asset.displayPrice || "",
            description: asset.description,
            published: asset.published,
            categoryId: asset.categoryId || "",
          });
          setSelectedTags(asset.tags.map((t: Tag) => t.id));
        })
        .catch(() => setError("Failed to load asset"))
        .finally(() => setLoading(false));
    }
  }, [assetId]);

  const generateSlug = (title: string) => {
    setForm((f) => ({ ...f, slug: title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = assetId ? `/api/admin/assets/${assetId}` : "/api/admin/assets";
      const method = assetId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tagIds: selectedTags }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save"); return; }
      router.push("/admin/assets");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) setForm((f) => ({ ...f, previewUrl: data.url }));
    } catch {
      setError("Upload failed");
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Title *</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
            required
            maxLength={200}
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
            <button type="button" onClick={() => generateSlug(form.title)} className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 rounded-lg transition-colors">Auto</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Type *</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="MODEL">Model</option>
            <option value="STICKER">Sticker</option>
            <option value="EMOTE">Emote</option>
            <option value="OVERLAY">Overlay</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Preview Type</label>
          <select
            value={form.previewType}
            onChange={(e) => setForm({ ...form, previewType: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Video Embed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Preview Image *</label>
        <div className="flex gap-2">
          <input
            value={form.previewUrl}
            onChange={(e) => setForm({ ...form, previewUrl: e.target.value })}
            className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://..."
            required
          />
          <label className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors">
            Upload
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      {form.previewType === "VIDEO" && (
        <div>
          <label className="block text-sm text-gray-400 mb-1">Video Embed URL</label>
          <input
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://www.youtube.com/embed/..."
          />
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-400 mb-1">Google Drive Link *</label>
        <input
          value={form.googleDriveLink}
          onChange={(e) => setForm({ ...form, googleDriveLink: e.target.value })}
          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="https://drive.google.com/..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Display Price (optional)</label>
          <input
            value={form.displayPrice}
            onChange={(e) => setForm({ ...form, displayPrice: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="$15"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">None</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px] resize-y"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setSelectedTags((prev) => prev.includes(tag.id) ? prev.filter((t) => t !== tag.id) : [...prev, tag.id])}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                selectedTags.includes(tag.id) ? "text-white ring-2 ring-offset-1 ring-offset-gray-900" : "text-gray-400 hover:text-white"
              }`}
              style={{ backgroundColor: selectedTags.includes(tag.id) ? tag.color : tag.color + "22" }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
          className="w-4 h-4 rounded accent-purple-600"
        />
        <span className="text-sm text-gray-300">Published</span>
      </label>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {saving ? "Saving..." : assetId ? "Update Asset" : "Create Asset"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/assets")}
          className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
