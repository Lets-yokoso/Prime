"use client";

import { useEffect, useState } from "react";
import { StarRating } from "@/components/StarRating";

interface ReviewItem {
  id: string;
  username: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
  asset: { id: string; title: string; slug: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) setReviews(await res.json());
    } catch {
      console.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) setReviews(reviews.filter((r) => r.id !== id));
    } catch {
      console.error("Failed to delete");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Reviews</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{review.username}</span>
                    <span className="text-gray-500 text-xs">{review.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating value={review.rating} readonly />
                    <span className="text-xs text-gray-500">on <strong>{review.asset.title}</strong></span>
                  </div>
                  <p className="text-gray-300 text-sm">{review.comment}</p>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
