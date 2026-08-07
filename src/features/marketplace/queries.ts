import { queryOptions } from "@tanstack/react-query";

import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/query-keys";
import type { PaginatedOffers } from "@/types";

export const marketplaceQueryOptions = (params: {
  page: number;
  pageSize: number;
}) => {
  const queryString = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
  }).toString();

  return queryOptions({
    queryFn: () =>
      fetchJson<PaginatedOffers>(`/api/marketplace?${queryString}`),
    queryKey: queryKeys.marketplace(params.page, params.pageSize),
  });
};
