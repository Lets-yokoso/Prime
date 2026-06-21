"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    brandName: "PrimeAutomation",
    brandDescription: "",
    socialLinks: [] as { platform: string; url: string }[],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          brandName: data.brandName || "PrimeAutomation",
          brandDescription: data.brandDescription || "",
          socialLinks: typeof data.socialLinks === "string" ? JSON.parse(data.socialLinks) : data.socialLinks || [],
        });
      })
      .catch(() => setError("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { setError("Failed to save"); return; }
      setSuccess("Settings saved!");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => setForm((f) => ({ ...f, socialLinks: [...f.socialLinks, { platform: "", url: "" }] }));
  const updateLink = (i: number, field: string, value: string) => {
    const copy = [...form.socialLinks];
    copy[i] = { ...copy[i], [field]: value };
    setForm({ ...form, socialLinks: copy });
  };
  const removeLink = (i: number) => setForm({ ...form, socialLinks: form.socialLinks.filter((_, idx) => idx !== i) });

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      <form onSubmit={handleSave} className="max-w-xl space-y-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Brand</h2>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Brand Name</label>
            <input
              value={form.brandName}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Brand Description</label>
            <textarea
              value={form.brandDescription}
              onChange={(e) => setForm({ ...form, brandDescription: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px] resize-y"
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Social Links</h2>
            <button type="button" onClick={addLink} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">+ Add Link</button>
          </div>
          {form.socialLinks.length === 0 ? (
            <p className="text-gray-500 text-sm">No social links added yet.</p>
          ) : (
            <div className="space-y-3">
              {form.socialLinks.map((link, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1">
                    <input
                      value={link.platform}
                      onChange={(e) => updateLink(i, "platform", e.target.value)}
                      placeholder="Platform (e.g., Discord)"
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button type="button" onClick={() => removeLink(i)} className="text-red-400 hover:text-red-300 mt-2 px-2">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
