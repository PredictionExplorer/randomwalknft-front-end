export const queryKeys = {
  detail: (tokenId: number) => ["detail", tokenId] as const,
  gallery: (params: string) => ["gallery", params] as const,
  home: () => ["home"] as const,
  marketplace: (page: number, pageSize: number) =>
    ["marketplace", page, pageSize] as const,
  mint: () => ["mint"] as const,
  random: () => ["random"] as const,
  redeem: () => ["redeem"] as const,
  tokenMarket: (tokenId: number) => ["token-market", tokenId] as const,
  walletOffers: (address: string) => ["wallet-offers", address] as const,
  walletTokens: (address: string) => ["wallet-tokens", address] as const,
};
