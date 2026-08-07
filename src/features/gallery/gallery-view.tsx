import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Address } from "viem";

import { getGalleryPage } from "@/lib/contracts/nft";
import { getQueryClient } from "@/lib/query/query-client";
import type { GallerySort, GalleryView as GalleryViewMode } from "@/types";

import { GalleryViewClient } from "./gallery-view-client";
import { galleryQueryOptions } from "./queries";

export async function GalleryView({
  address,
  page,
  pageSize,
  sort,
  view,
}: {
  address?: Address | null;
  page: number;
  pageSize: number;
  sort: GallerySort;
  view: GalleryViewMode;
}) {
  const data = await getGalleryPage({
    ownerAddress: address,
    page,
    pageSize,
    sort,
    view,
  });
  const queryClient = getQueryClient();
  queryClient.setQueryData(
    galleryQueryOptions({ address, page, pageSize, sort, view }).queryKey,
    data,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GalleryViewClient
        address={address ?? null}
        page={page}
        pageSize={pageSize}
        sort={sort}
        view={view}
      />
    </HydrationBoundary>
  );
}
