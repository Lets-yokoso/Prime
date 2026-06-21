"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Asset } from "@/types";

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    try {
      const res = await fetch("/api/admin/assets");
      if (res.ok) setAssets(await res.json());
    } catch {
      console.error("Failed to fetch assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssets(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this asset?")) return;
    try {
      const res = await fetch(`/api/admin/assets/${id}`, { method: "DELETE" });
      if (res.ok) setAssets(assets.filter((a) => a.id !== id));
    } catch {
      console.error("Failed to delete");
    }
  };

  const togglePublish = async (asset: Asset) => {
    try {
      await fetch(`/api/admin/assets/${asset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !asset.published }),
      });
      fetchAssets();
    } catch {
      console.error("Failed to toggle");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Assets</h1>
        <Link
          href="/admin/assets/new"
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Asset
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : assets.length === 0 ? (
        <p className="text-gray-500">No assets yet. Create your first one!</p>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-left">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-white">{asset.title}</td>
                  <td className="px-4 py-3 text-gray-400">{asset.type}</td>
                  <td className="px-4 py-3 text-gray-400">{asset.category?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(asset)}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        asset.published ? "bg-green-600/20 text-green-400" : "bg-gray-700 text-gray-500"
                      }`}
                    >
                      {asset.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/assets/${asset.id}/edit`}
                        className="text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(asset.id)}
                        className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
