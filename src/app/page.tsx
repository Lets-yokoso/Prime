import { prisma } from "@/lib/prisma";
import { AssetCard } from "@/components/AssetCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredAssets] = await Promise.all([
    prisma.category.findMany({
      where: { showOnHome: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.asset.findMany({
      where: { published: true },
      include: { category: true, tags: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const categoryAssets = await Promise.all(
    categories.map(async (cat) => {
      const assets = await prisma.asset.findMany({
        where: { published: true, categoryId: cat.id },
        include: { category: true, tags: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      });
      return { category: cat, assets };
    })
  );

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Premium{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Streaming Assets
              </span>
            </h1>
            <p className="text-gray-400 text-lg mt-4 max-w-xl">
              High-quality VTuber models, stickers, emotes, and overlays for content creators. Elevate your stream with PrimeAutomation.
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                href="/catalog"
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Assets
              </Link>
              <Link
                href="/catalog?type=MODEL"
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-gray-700"
              >
                View Models
              </Link>
            </div>
          </div>
        </div>
      </section>

      {featuredAssets.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Latest Assets</h2>
            <Link href="/catalog" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featuredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset as unknown as import("@/types").Asset} />
            ))}
          </div>
        </section>
      )}

      {categoryAssets.map(({ category, assets }) =>
        assets.length > 0 ? (
          <section key={category.id} className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                {category.description && (
                  <p className="text-gray-500 text-sm mt-1">{category.description}</p>
                )}
              </div>
              <Link
                href={`/catalog?category=${category.slug}`}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <AssetCard key={asset.id} asset={asset as unknown as import("@/types").Asset} />
              ))}
            </div>
          </section>
        ) : null
      )}

      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Interested in something?</h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-8">
          Reach out to us on social media to inquire about custom work, commissions, or asset requests.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://discord.gg/primeautomation"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Join Discord
          </a>
          <a
            href="https://twitter.com/primeautomation"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-gray-700"
          >
            Follow on X
          </a>
        </div>
      </section>
    </div>
  );
}
