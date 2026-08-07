import { queryOptions } from "@tanstack/react-query";

import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/query-keys";
import type { GallerySort, GalleryView, PaginatedTokens } from "@/types";

export function getGalleryQueryString(params: {
  address?: string | null;
  page: number;
  pageSize: number;
  sort: GallerySort;
  view: GalleryView;
}) {
  const searchParams = new URLSearchParams();

  if (params.address) {
    searchParams.set("address", params.address);
  }
  searchParams.set("page", params.page.toString());
  searchParams.set("pageSize", params.pageSize.toString());
  searchParams.set("sort", params.sort);
  searchParams.set("view", params.view);

  return searchParams.toString();
}

export const galleryQueryOptions = (params: {
  address?: string | null;
  page: number;
  pageSize: number;
  sort: GallerySort;
  view: GalleryView;
}) => {
  const queryString = getGalleryQueryString(params);

  return queryOptions({
    queryFn: () => fetchJson<PaginatedTokens>(`/api/gallery?${queryString}`),
    queryKey: queryKeys.gallery(queryString),
  });
};
