import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { sanitizeText, sanitizeAssetDescription } from "@/lib/sanitize";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assets = await prisma.asset.findMany({
    include: { category: true, tags: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(assets);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const slug = body.slug || slugify(body.title);

    const existing = await prisma.asset.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "An asset with this slug already exists" }, { status: 400 });
    }

    const tagIds: string[] = body.tagIds || [];

    const asset = await prisma.asset.create({
      data: {
        title: sanitizeText(body.title, 200),
        slug,
        description: sanitizeAssetDescription(body.description || ""),
        type: body.type,
        previewType: body.previewType,
        previewUrl: body.previewUrl || "",
        videoUrl: body.videoUrl || null,
        googleDriveLink: body.googleDriveLink || "",
        displayPrice: body.displayPrice || null,
        published: body.published ?? false,
        categoryId: body.categoryId || null,
        tags: {
          connect: tagIds.map((id: string) => ({ id })),
        },
      },
      include: { category: true, tags: true },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 });
  }
}
