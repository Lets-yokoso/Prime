import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AssetDetailClient } from "./AssetDetailClient";

export const dynamic = "force-dynamic";

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const asset = await prisma.asset.findUnique({
    where: { slug, published: true },
    include: { category: true, tags: true },
  });

  if (!asset) notFound();

  const reviews = await prisma.review.findMany({
    where: { assetId: asset.id, verified: true },
    orderBy: { createdAt: "desc" },
  });

  return <AssetDetailClient asset={asset as unknown as import("@/types").Asset} reviews={reviews} />;
}
