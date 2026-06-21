import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let settings = await prisma.siteSetting.findUnique({ where: { id: "default" } });
  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: { id: "default" },
    });
  }
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    const settings = await prisma.siteSetting.upsert({
      where: { id: "default" },
      update: {
        brandName: body.brandName !== undefined ? sanitizeText(body.brandName, 100) : undefined,
        brandDescription: body.brandDescription !== undefined ? sanitizeText(body.brandDescription, 500) : undefined,
        socialLinks: body.socialLinks !== undefined ? JSON.stringify(body.socialLinks) : undefined,
      },
      create: {
        id: "default",
        brandName: sanitizeText(body.brandName || "PrimeAutomation", 100),
        brandDescription: sanitizeText(body.brandDescription || "", 500),
        socialLinks: JSON.stringify(body.socialLinks || []),
      },
    });

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
