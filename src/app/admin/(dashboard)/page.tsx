import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [assetCount, categoryCount, tagCount, reviewCount, recentAssets] = await Promise.all([
    prisma.asset.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.review.count(),
    prisma.asset.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, published: true, createdAt: true },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Assets" value={assetCount} color="purple" />
        <StatCard label="Categories" value={categoryCount} color="blue" />
        <StatCard label="Tags" value={tagCount} color="green" />
        <StatCard label="Reviews" value={reviewCount} color="amber" />
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Assets</h2>
        {recentAssets.length === 0 ? (
          <p className="text-gray-500 text-sm">No assets yet.</p>
        ) : (
          <div className="space-y-2">
            {recentAssets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-gray-300">{asset.title}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${asset.published ? "bg-green-600/20 text-green-400" : "bg-gray-700 text-gray-500"}`}>
                    {asset.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    purple: "from-purple-600/20 to-purple-800/10 border-purple-800/30",
    blue: "from-blue-600/20 to-blue-800/10 border-blue-800/30",
    green: "from-green-600/20 to-green-800/10 border-green-800/30",
    amber: "from-amber-600/20 to-amber-800/10 border-amber-800/30",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl border p-4`}>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}
