import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeText, sanitizeAssetDescription } from "@/lib/sanitize";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const asset = await prisma.asset.findUnique({
    where: { id },
    include: { category: true, tags: true },
  });
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(asset);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.asset.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const tagIds: string[] = body.tagIds || [];

    const asset = await prisma.asset.update({
      where: { id },
      data: {
        title: body.title !== undefined ? sanitizeText(body.title, 200) : undefined,
        description: body.description !== undefined ? sanitizeAssetDescription(body.description) : undefined,
        type: body.type !== undefined ? body.type : undefined,
        previewType: body.previewType !== undefined ? body.previewType : undefined,
        previewUrl: body.previewUrl !== undefined ? body.previewUrl : undefined,
        videoUrl: body.videoUrl !== undefined ? (body.videoUrl || null) : undefined,
        googleDriveLink: body.googleDriveLink !== undefined ? body.googleDriveLink : undefined,
        displayPrice: body.displayPrice !== undefined ? (body.displayPrice || null) : undefined,
        published: body.published !== undefined ? body.published : undefined,
        categoryId: body.categoryId !== undefined ? (body.categoryId || null) : undefined,
        tags: tagIds.length > 0
          ? { set: tagIds.map((id: string) => ({ id })) }
          : { set: [] },
      },
      include: { category: true, tags: true },
    });

    return NextResponse.json(asset);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.asset.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
  }
}
