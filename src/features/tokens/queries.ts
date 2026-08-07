import { queryOptions } from "@tanstack/react-query";
import type { Address } from "viem";

import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/query-keys";
import type { TokenSummary } from "@/types";

export const walletTokensQueryOptions = (address: Address) =>
  queryOptions({
    queryFn: () =>
      fetchJson<TokenSummary[]>(`/api/wallet/tokens?address=${address}`),
    queryKey: queryKeys.walletTokens(address),
  });
