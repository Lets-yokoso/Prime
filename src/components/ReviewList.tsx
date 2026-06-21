import { StarRating } from "./StarRating";
import type { Review } from "@/types";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const links = typeof review.socialLinks === "string"
          ? JSON.parse(review.socialLinks || "[]")
          : review.socialLinks || [];

        return (
          <div key={review.id} className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              {review.profileImage ? (
                <img
                  src={review.profileImage}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg flex-shrink-0">
                  {review.username[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-white">{review.username}</span>
                  <StarRating value={review.rating} readonly />
                </div>
                <p className="text-gray-300 mt-2 text-sm">{review.comment}</p>
                {links.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {links.map((link: { platform: string; url: string }, i: number) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full px-3 py-1 transition-colors"
                      >
                        {link.platform}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
