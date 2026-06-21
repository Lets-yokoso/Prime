"use client";

import Link from "next/link";
import { StarRating } from "@/components/StarRating";
import { ReviewList } from "@/components/ReviewList";
import { ReviewForm } from "@/components/ReviewForm";
import type { Asset, Review } from "@/types";

const typeLabels: Record<string, string> = {
  MODEL: "Model",
  STICKER: "Sticker",
  EMOTE: "Emote",
  OVERLAY: "Overlay",
};

export function AssetDetailClient({ asset, reviews }: { asset: Asset; reviews: Review[] }) {
  const avgRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link href="/catalog" className="text-gray-500 hover:text-gray-300 text-sm mb-6 inline-block transition-colors">
        ← Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="aspect-[4/3] bg-gray-800 rounded-xl overflow-hidden">
            {asset.previewType === "VIDEO" && asset.videoUrl ? (
              <iframe
                src={asset.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={asset.previewUrl}
                alt={asset.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium bg-purple-600 text-white px-2 py-1 rounded-md">
              {typeLabels[asset.type] || asset.type}
            </span>
            {asset.category && (
              <span className="text-xs text-gray-500">{asset.category.name}</span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">{asset.title}</h1>

          {asset.displayPrice && (
            <p className="text-xl text-purple-400 font-semibold mb-4">{asset.displayPrice}</p>
          )}

          {asset.description && (
            <p className="text-gray-300 mb-6 leading-relaxed">{asset.description}</p>
          )}

          {asset.tags && asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {asset.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/catalog?tag=${tag.slug}`}
                  className="text-xs px-3 py-1 rounded-full transition-colors hover:opacity-80"
                  style={{ backgroundColor: tag.color + "22", color: tag.color }}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <StarRating value={Math.round(avgRating)} readonly />
              <span className="text-gray-400 text-sm">{avgRating} ({reviews.length} reviews)</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={asset.googleDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-center px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Download Asset
            </a>
            <a
              href="https://discord.gg/primeautomation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#5865F2] hover:bg-[#4752c4] text-white text-center px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Inquire on Discord
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-6">
            Reviews ({reviews.length})
          </h2>
          <ReviewList reviews={reviews} />
        </div>
        <div>
          <ReviewForm assetId={asset.id} />
        </div>
      </div>
    </div>
  );
}
