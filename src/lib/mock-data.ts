import { secondsFromNow } from "@/lib/format";
import { buildTokenMedia } from "@/lib/media";
import type {
  GiveawayEntry,
  HomeStats,
  MintState,
  Offer,
  PaginatedOffers,
  PaginatedTokens,
  RandomSelection,
  RedeemState,
  ResultStats,
  TokenDetail,
  TokenMarketSnapshot,
  TokenSummary,
  WalletOffers,
} from "@/types";

const OWNER = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const SECOND_OWNER = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
const THIRD_OWNER = "0x90f79bf6eb2c4f870365e785982e1f101e93b906";

function getMockMedia(tokenId: number) {
  const liveMedia = buildTokenMedia(tokenId);

  return {
    ...liveMedia,
    blackImage: "/brand/back.png",
    blackImageThumb: "/brand/back.png",
    whiteImage: "/brand/back.png",
    whiteImageThumb: "/brand/back.png",
  };
}

export const mockTokens: TokenSummary[] = Array.from(
  { length: 12 },
  (_, index) => {
    const id = 1088 - index;

    return {
      id,
      name: `Random Walk ${id}`,
      media: getMockMedia(id),
    };
  },
);

export const mockTokenDetails: TokenDetail[] = mockTokens.map(
  (token, index) => ({
    ...token,
    owner: (index % 2 === 0 ? OWNER : SECOND_OWNER) as `0x${string}`,
    previousTokenId: mockTokens[index + 1]?.id ?? null,
    nextTokenId: mockTokens[index - 1]?.id ?? null,
    seed: `0x${`${token.id}`.padStart(64, "0")}`,
  }),
);

export const mockOffers: Offer[] = [
  {
    id: 1,
    active: true,
    buyer: "0x0000000000000000000000000000000000000000",
    imageThumb: mockTokens[0].media.blackImageThumb,
    priceEth: "0.42",
    priceWei: "420000000000000000",
    seller: OWNER as `0x${string}`,
    tokenId: mockTokens[0].id,
    tokenName: mockTokens[0].name,
    type: "sell",
  },
  {
    id: 2,
    active: true,
    buyer: THIRD_OWNER as `0x${string}`,
    imageThumb: mockTokens[1].media.blackImageThumb,
    priceEth: "0.33",
    priceWei: "330000000000000000",
    seller: OWNER as `0x${string}`,
    tokenId: mockTokens[1].id,
    tokenName: mockTokens[1].name,
    type: "buy",
  },
  {
    id: 3,
    active: true,
    buyer: "0x0000000000000000000000000000000000000000",
    imageThumb: mockTokens[2].media.blackImageThumb,
    priceEth: "0.57",
    priceWei: "570000000000000000",
    seller: SECOND_OWNER as `0x${string}`,
    tokenId: mockTokens[2].id,
    tokenName: mockTokens[2].name,
    type: "sell",
  },
];

export const mockHomeStats: HomeStats = {
  activeSellOffers: 2,
  displayMintPriceWei: "10100000000000000",
  finishedCount: 7037,
  mintPriceWei: "10000000000000000",
  runningCount: 270,
  totalSupply: 1088,
};

export const mockMintState: MintState = {
  displayMintPriceWei: "10100000000000000",
  mintPriceWei: "10000000000000000",
  saleOpensAt: secondsFromNow(0),
  timeUntilSaleSeconds: 0,
  totalSupply: 1088,
};

export const mockRedeemState: RedeemState = {
  lastMinter: SECOND_OWNER as `0x${string}`,
  timeUntilWithdrawalSeconds: 172_800,
  withdrawalAmountWei: "18250000000000000000",
  withdrawalOpensAt: secondsFromNow(172_800),
};

export const mockResultStats: ResultStats = {
  finishedCount: 7037,
  runningCount: 270,
};

export const mockGiveawayEntries: GiveawayEntry[] = mockTokenDetails
  .slice(0, 4)
  .map((token) => ({
    id: token.id,
    owner: token.owner,
    seed: token.seed,
  }));

export const mockRandomSelection: RandomSelection = {
  ids: [mockTokens[0].id, mockTokens[3].id],
};

export function getMockGallery({
  ownerAddress = null,
  page,
  pageSize,
  sort,
  view,
}: Pick<
  PaginatedTokens,
  "ownerAddress" | "page" | "pageSize" | "sort" | "view"
>): PaginatedTokens {
  const filtered = ownerAddress
    ? mockTokenDetails.filter(
        (token) => token.owner.toLowerCase() === ownerAddress.toLowerCase(),
      )
    : mockTokenDetails;
  const ordered = sort === "earliest" ? [...filtered].reverse() : filtered;
  const start = (page - 1) * pageSize;
  const items = ordered.slice(start, start + pageSize);

  return {
    items,
    ownerAddress,
    page,
    pageSize,
    sort,
    totalItems: ordered.length,
    totalPages: Math.max(1, Math.ceil(ordered.length / pageSize)),
    view,
  };
}

export function getMockMarketplace(
  page: number,
  pageSize: number,
): PaginatedOffers {
  const sellOffers = mockOffers.filter(
    (offer) => offer.type === "sell" && offer.active,
  );
  const start = (page - 1) * pageSize;

  return {
    items: sellOffers.slice(start, start + pageSize),
    page,
    pageSize,
    totalItems: sellOffers.length,
    totalPages: Math.max(1, Math.ceil(sellOffers.length / pageSize)),
  };
}

export function getMockTokenMarketSnapshot(
  tokenId: number,
): TokenMarketSnapshot {
  const token =
    mockTokenDetails.find((item) => item.id === tokenId) ?? mockTokenDetails[0];
  const tokenOffers = mockOffers.filter(
    (offer) => offer.tokenId === token.id && offer.active,
  );

  return {
    activeBuyOffers: tokenOffers.filter((offer) => offer.type === "buy"),
    activeSellOffer: tokenOffers.find((offer) => offer.type === "sell") ?? null,
    token,
  };
}

export function getMockWalletOffers(): WalletOffers {
  return {
    buyOffers: mockOffers.filter((offer) => offer.type === "buy"),
    sellOffers: mockOffers.filter((offer) => offer.type === "sell"),
  };
}
