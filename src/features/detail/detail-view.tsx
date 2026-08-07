import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { getTokenMarketSnapshot } from "@/lib/contracts/market";
import { getQueryClient } from "@/lib/query/query-client";

import { DetailViewClient } from "./detail-view-client";
import { detailQueryOptions } from "./queries";

export async function DetailView({ tokenId }: { tokenId: number }) {
  const snapshot = await getTokenMarketSnapshot(tokenId);

  if (!snapshot) {
    notFound();
  }

  const queryClient = getQueryClient();
  queryClient.setQueryData(detailQueryOptions(tokenId).queryKey, snapshot);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DetailViewClient tokenId={tokenId} />
    </HydrationBoundary>
  );
}
