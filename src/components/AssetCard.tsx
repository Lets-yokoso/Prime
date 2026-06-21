import Link from "next/link";
import type { Asset } from "@/types";

const typeColors: Record<string, string> = {
  MODEL: "bg-purple-600",
  STICKER: "bg-amber-500",
  EMOTE: "bg-red-500",
  OVERLAY: "bg-emerald-500",
};

const typeLabels: Record<string, string> = {
  MODEL: "Model",
  STICKER: "Sticker",
  EMOTE: "Emote",
  OVERLAY: "Overlay",
};

export function AssetCard({ asset }: { asset: Asset }) {
  return (
    <Link
      href={`/assets/${asset.slug}`}
      className="group bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
    >
      <div className="aspect-[4/3] bg-gray-700 relative overflow-hidden">
        {asset.previewUrl ? (
          <img
            src={asset.previewUrl}
            alt={asset.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">
            ?
          </div>
        )}
        <span
          className={`absolute top-2 left-2 text-xs font-medium text-white px-2 py-1 rounded-md ${typeColors[asset.type] || "bg-gray-600"}`}
        >
          {typeLabels[asset.type] || asset.type}
        </span>
        {asset.displayPrice && (
          <span className="absolute top-2 right-2 text-xs font-medium bg-black/60 text-white px-2 py-1 rounded-md backdrop-blur">
            {asset.displayPrice}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors truncate">
          {asset.title}
        </h3>
        {asset.category && (
          <p className="text-xs text-gray-500 mt-1">{asset.category.name}</p>
        )}
        {asset.tags && asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {asset.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: tag.color + "22", color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
