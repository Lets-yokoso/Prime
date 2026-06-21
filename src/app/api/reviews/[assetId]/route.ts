import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;

  const reviews = await prisma.review.findMany({
    where: { assetId, verified: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      rating: true,
      comment: true,
      profileImage: true,
      socialLinks: true,
      createdAt: true,
    },
  });

  const parsed = reviews.map((r) => ({
    ...r,
    socialLinks: r.socialLinks ? JSON.parse(r.socialLinks) : [],
  }));

  return NextResponse.json(parsed);
}
