"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category, Tag } from "@/types";

export function CatalogFilters({
  categories,
  tags,
  currentType,
  currentCategory,
  currentSearch,
}: {
  categories: Category[];
  tags: Tag[];
  currentType: string | null;
  currentCategory: string | null;
  currentSearch: string | null;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch || "");

  const filterBy = (key: string, value: string | null) => {
    const params = new URLSearchParams();
    if (value) params.set(key, value);
    if (key !== "type" && currentType) params.set("type", currentType);
    if (key !== "category" && currentCategory) params.set("category", currentCategory);
    if (key !== "search" && search) params.set("search", search);
    const qs = params.toString();
    router.push(`/catalog${qs ? `?${qs}` : ""}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterBy("search", search || null);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assets..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => filterBy("type", null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            !currentType ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          All
        </button>
        <button
          onClick={() => filterBy("type", "MODEL")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            currentType === "MODEL" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Models
        </button>
        <button
          onClick={() => filterBy("type", "STICKER")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            currentType === "STICKER" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Stickers
        </button>
        <button
          onClick={() => filterBy("type", "EMOTE")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            currentType === "EMOTE" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Emotes
        </button>
        <button
          onClick={() => filterBy("type", "OVERLAY")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            currentType === "OVERLAY" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Overlays
        </button>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => filterBy("category", currentCategory === cat.slug ? null : cat.slug)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                currentCategory === cat.slug
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
