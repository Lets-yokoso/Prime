"use client";

import { useEffect, useState } from "react";
import { StarRating } from "./StarRating";
import { validateEmail, validateUsername } from "@/lib/sanitize";

export function ReviewForm({ assetId }: { assetId: string }) {
  const [step, setStep] = useState<"form" | "code" | "done">("form");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [code, setCode] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    setError("");
    const emailErr = validateEmail(email);
    if (emailErr) { setError(emailErr); return; }
    const userErr = validateUsername(username);
    if (userErr) { setError(userErr); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setStep("code");
    } catch {
      setError("Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    if (!/^\d{6}$/.test(code)) { setError("Enter a valid 6-digit code"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId,
          username,
          email,
          rating,
          comment,
          profileImage: profileImage || undefined,
          socialLinks: socialLinks.filter((l) => l.url),
          code,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setStep("done");
    } catch {
      setError("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const addSocialLink = () => {
    if (socialLinks.length >= 2) return;
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const updateSocialLink = (i: number, field: "platform" | "url", value: string) => {
    const copy = [...socialLinks];
    copy[i] = { ...copy[i], [field]: value };
    setSocialLinks(copy);
  };

  const removeSocialLink = (i: number) => {
    setSocialLinks(socialLinks.filter((_, idx) => idx !== i));
  };

  if (step === "done") {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center">
        <p className="text-2xl mb-2">✓</p>
        <p className="text-gray-300 text-lg">Review submitted! Thank you.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>

      {step === "form" ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username *</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={30}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Rating *</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Comment *</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-y"
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{comment.length}/1000</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Profile Image URL (optional)</label>
            <input
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://..."
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-gray-400">Social Links (optional, max 2)</label>
              {socialLinks.length < 2 && (
                <button type="button" onClick={addSocialLink} className="text-sm text-purple-400 hover:text-purple-300">
                  + Add
                </button>
              )}
            </div>
            {socialLinks.map((link, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={link.platform}
                  onChange={(e) => updateSocialLink(i, "platform", e.target.value)}
                  placeholder="Platform"
                  className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={50}
                />
                <input
                  value={link.url}
                  onChange={(e) => updateSocialLink(i, "url", e.target.value)}
                  placeholder="https://..."
                  className="flex-[2] bg-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button type="button" onClick={() => removeSocialLink(i)} className="text-red-400 hover:text-red-300 px-2">
                  ×
                </button>
              </div>
            ))}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleSendCode}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white rounded-lg px-4 py-2 transition-colors font-medium"
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Enter the 6-digit code sent to <strong>{email}</strong></p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white text-center text-2xl tracking-widest outline-none focus:ring-2 focus:ring-purple-500"
            maxLength={6}
            placeholder="000000"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={handleVerify}
            disabled={loading || code.length !== 6}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white rounded-lg px-4 py-2 transition-colors font-medium"
          >
            {loading ? "Verifying..." : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
}
