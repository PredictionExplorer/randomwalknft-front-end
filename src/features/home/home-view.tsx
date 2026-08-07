import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getResultStats } from "@/lib/api/nft-service";
import { getMarketplacePage } from "@/lib/contracts/market";
import { getFeaturedTokens, getHomeStats } from "@/lib/contracts/nft";
import { getQueryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";

import { HomeViewClient } from "./home-view-client";

export async function HomeView() {
  const [stats, result, marketplace] = await Promise.all([
    getHomeStats(),
    getResultStats(),
    getMarketplacePage(1, 12),
  ]);
  const featuredTokens = getFeaturedTokens();
  const queryClient = getQueryClient();
  queryClient.setQueryData(queryKeys.home(), {
    ...stats,
    activeSellOffers: marketplace.totalItems,
    finishedCount: result.finishedCount,
    runningCount: result.runningCount,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeViewClient featuredTokens={featuredTokens} />
    </HydrationBoundary>
  );
}
