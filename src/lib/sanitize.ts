import sanitizeHtml from "sanitize-html";

const defaultOptions: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
  allowedSchemes: [],
};

export function sanitize(input: string): string {
  return sanitizeHtml(input, defaultOptions).trim();
}

export function sanitizeText(input: string, maxLength = 1000): string {
  const cleaned = sanitize(input);
  return cleaned.slice(0, maxLength);
}

export function validateUsername(username: string): string | null {
  const cleaned = sanitize(username);
  if (cleaned.length < 3 || cleaned.length > 30) return "Username must be 3-30 characters";
  if (!/^[a-zA-Z0-9 _-]+$/.test(cleaned)) return "Username can only contain letters, numbers, spaces, hyphens, and underscores";
  return null;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email address";
  if (email.length > 254) return "Email too long";
  return null;
}

export function validateUrl(url: string, allowedHostnames?: string[]): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return "Only HTTPS URLs are allowed";
    if (allowedHostnames && allowedHostnames.length > 0) {
      const hostname = parsed.hostname.replace("www.", "");
      const match = allowedHostnames.some((h) => hostname === h || hostname.endsWith("." + h));
      if (!match) return "URL hostname not allowed";
    }
    return null;
  } catch {
    return "Invalid URL";
  }
}

export function validateRating(rating: number): number | null {
  const num = Math.round(rating);
  if (num < 1 || num > 5) return null;
  return num;
}

export function sanitizeAndValidateReview(data: {
  username: string;
  email: string;
  rating: number;
  comment: string;
  profileImage?: string;
  socialLinks?: { platform: string; url: string }[];
}): string | null {
  const usernameErr = validateUsername(data.username);
  if (usernameErr) return usernameErr;

  const emailErr = validateEmail(data.email);
  if (emailErr) return emailErr;

  if (!validateRating(data.rating)) return "Rating must be between 1 and 5";

  if (data.comment.length < 10 || data.comment.length > 1000) return "Comment must be 10-1000 characters";

  if (data.profileImage) {
    const urlErr = validateUrl(data.profileImage);
    if (urlErr) return "Profile image: " + urlErr;
  }

  if (data.socialLinks) {
    if (data.socialLinks.length > 2) return "Maximum 2 social links allowed";
    for (const link of data.socialLinks) {
      const urlErr = validateUrl(link.url);
      if (urlErr) return `Social link "${link.platform}": ${urlErr}`;
      if (link.platform.length > 50) return "Platform name too long";
    }
  }

  return null;
}

export function sanitizeAssetDescription(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: ["b", "i", "em", "strong", "a", "br", "p", "ul", "ol", "li"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["https"],
  });
}
