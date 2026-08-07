import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getMarketplacePage } from "@/lib/contracts/market";
import { getQueryClient } from "@/lib/query/query-client";

import { MarketplaceViewClient } from "./marketplace-view-client";
import { marketplaceQueryOptions } from "./queries";

export async function MarketplaceView({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const data = await getMarketplacePage(page, pageSize);
  const queryClient = getQueryClient();
  queryClient.setQueryData(
    marketplaceQueryOptions({ page, pageSize }).queryKey,
    data,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MarketplaceViewClient page={page} pageSize={pageSize} />
    </HydrationBoundary>
  );
}
