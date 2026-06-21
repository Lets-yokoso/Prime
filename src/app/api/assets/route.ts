import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = { published: true };

  if (type) where.type = type;
  if (category) where.category = { slug: category };
  if (tag) where.tags = { some: { slug: tag } };
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const assets = await prisma.asset.findMany({
    where,
    include: { category: true, tags: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assets);
}
