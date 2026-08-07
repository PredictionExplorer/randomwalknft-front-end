import { MarketplaceView } from "@/features/marketplace/marketplace-view";
import { clamp, parsePositiveInt } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePositiveInt(
    Array.isArray(params.page) ? params.page[0] : params.page,
    1,
  );
  const pageSize = clamp(
    parsePositiveInt(
      Array.isArray(params.pageSize) ? params.pageSize[0] : params.pageSize,
      24,
    ),
    12,
    48,
  );

  return <MarketplaceView page={page} pageSize={pageSize} />;
}
