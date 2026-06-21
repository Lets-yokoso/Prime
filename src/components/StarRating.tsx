"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readonly ? "button" : "button"}
          disabled={readonly}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => onChange?.(star)}
          className={`text-2xl transition-colors ${
            readonly ? "cursor-default" : "cursor-pointer"
          } ${
            star <= (hover || value) ? "text-yellow-400" : "text-gray-600"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
