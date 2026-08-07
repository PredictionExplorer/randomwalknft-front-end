import { queryOptions } from "@tanstack/react-query";

import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/query-keys";
import type { TokenMarketSnapshot } from "@/types";

export const detailQueryOptions = (tokenId: number) =>
  queryOptions({
    queryFn: () => fetchJson<TokenMarketSnapshot>(`/api/detail/${tokenId}`),
    queryKey: queryKeys.detail(tokenId),
  });
