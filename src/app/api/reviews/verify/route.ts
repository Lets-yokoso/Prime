import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeText, validateRating, sanitizeAndValidateReview } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId, username, email, rating, comment, profileImage, socialLinks, code } = body;

    const validationErr = sanitizeAndValidateReview({ username, email, rating, comment, profileImage, socialLinks });
    if (validationErr) {
      return NextResponse.json({ error: validationErr }, { status: 400 });
    }

    if (!code || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    const verification = await prisma.emailVerification.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!verification) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
    }

    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { used: true },
    });

    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        assetId,
        username: sanitizeText(username, 30),
        email: email.toLowerCase().trim(),
        rating: validateRating(rating)!,
        comment: sanitizeText(comment, 1000),
        profileImage: profileImage || null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        verified: true,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
