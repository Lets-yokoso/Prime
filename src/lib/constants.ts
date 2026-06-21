export const ASSET_TYPES = ["MODEL", "STICKER", "EMOTE", "OVERLAY"] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export const PREVIEW_TYPES = ["IMAGE", "VIDEO"] as const;
export type PreviewType = (typeof PREVIEW_TYPES)[number];

export const PLATFORMS = [
  { value: "discord", label: "Discord" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "twitch", label: "Twitch" },
  { value: "tiktok", label: "TikTok" },
  { value: "github", label: "GitHub" },
  { value: "website", label: "Website" },
] as const;

export const TYPES = [
  { value: "MODEL", label: "Model", color: "#8b5cf6" },
  { value: "STICKER", label: "Sticker", color: "#f59e0b" },
  { value: "EMOTE", label: "Emote", color: "#ef4444" },
  { value: "OVERLAY", label: "Overlay", color: "#10b981" },
] as const;

export const NAV_CATEGORIES = ["Models", "Stickers", "Emotes", "Overlays"] as const;
