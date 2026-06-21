import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reviews = await prisma.review.findMany({
    include: { asset: { select: { id: true, title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

