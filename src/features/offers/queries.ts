import { queryOptions } from "@tanstack/react-query";
import type { Address } from "viem";

import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/query-keys";
import type { WalletOffers } from "@/types";

export const walletOffersQueryOptions = (address: Address) =>
  queryOptions({
    queryFn: () =>
      fetchJson<WalletOffers>(`/api/wallet/offers?address=${address}`),
    queryKey: queryKeys.walletOffers(address),
  });
