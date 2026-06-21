import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: "default" } });
  const socialLinks = settings?.socialLinks ? JSON.parse(settings.socialLinks) : [];
  return NextResponse.json(socialLinks);
}
