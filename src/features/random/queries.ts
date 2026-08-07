import { queryOptions } from "@tanstack/react-query";

import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/query-keys";
import type { RandomSelection } from "@/types";

export const randomSelectionQueryOptions = () =>
  queryOptions({
    queryFn: () => fetchJson<RandomSelection>("/api/random"),
    queryKey: queryKeys.random(),
    staleTime: 0,
  });
