import { queryOptions } from "@tanstack/react-query";

import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/query-keys";
import type { HomeStats } from "@/types";

export const homeQueryOptions = () =>
  queryOptions({
    queryFn: () => fetchJson<HomeStats>("/api/home"),
    queryKey: queryKeys.home(),
  });
