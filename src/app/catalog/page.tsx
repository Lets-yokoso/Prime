import { prisma } from "@/lib/prisma";
import { AssetCard } from "@/components/AssetCard";
import { CatalogFilters } from "./CatalogFilters";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; tag?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const { type, category, search } = sp;

  const where: Record<string, unknown> = { published: true };
  if (type) where.type = type;
  if (category) where.category = { slug: category };
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const [assets, categories, tags] = await Promise.all([
    prisma.asset.findMany({
      where,
      include: { category: true, tags: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Catalog</h1>
        <p className="text-gray-400 mt-2">Browse all available assets.</p>
      </div>

      <CatalogFilters
        categories={categories}
        tags={tags}
        currentType={type || null}
        currentCategory={category || null}
        currentSearch={search || null}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
        {assets.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500">
            <p className="text-lg">No assets found</p>
            <p className="text-sm mt-2">Try adjusting your filters.</p>
          </div>
        ) : (
          assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset as unknown as import("@/types").Asset} />
          ))
        )}
      </div>
    </div>
  );
}
