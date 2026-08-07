import { queryOptions } from "@tanstack/react-query";

import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/query-keys";
import type { RedeemState } from "@/types";

export const redeemQueryOptions = () =>
  queryOptions({
    queryFn: () => fetchJson<RedeemState>("/api/redeem"),
    queryKey: queryKeys.redeem(),
  });
