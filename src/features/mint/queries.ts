import { queryOptions } from "@tanstack/react-query";

import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/query-keys";
import type { MintState } from "@/types";

export const mintQueryOptions = () =>
  queryOptions({
    queryFn: () => fetchJson<MintState>("/api/mint"),
    queryKey: queryKeys.mint(),
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
    staleTime: 5_000,
  });
