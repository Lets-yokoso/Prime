export type AssetType = "MODEL" | "STICKER" | "EMOTE" | "OVERLAY";
export type PreviewType = "IMAGE" | "VIDEO";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Asset {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: AssetType;
  previewType: PreviewType;
  previewUrl: string;
  videoUrl: string | null;
  googleDriveLink: string;
  displayPrice: string | null;
  published: boolean;
  categoryId: string | null;
  category: Category | null;
  tags: Tag[];
  reviews: Review[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  showOnHome: boolean;
  sortOrder: number;
  assets?: Asset[];
  _count?: { assets: number };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  _count?: { assets: number };
}

export interface Review {
  id: string;
  assetId: string;
  username: string;
  email?: string;
  rating: number;
  comment: string;
  profileImage: string | null;
  socialLinks: SocialLink[] | string | null;
  verified: boolean;
  createdAt: string | Date;
}

export interface SiteSettings {
  id: string;
  brandName: string;
  brandDescription: string;
  socialLinks: SocialLink[] | string;
}
