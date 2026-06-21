import { AssetForm } from "../../AssetForm";

export default async function EditAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Edit Asset</h1>
      <AssetForm assetId={id} />
    </div>
  );
}
