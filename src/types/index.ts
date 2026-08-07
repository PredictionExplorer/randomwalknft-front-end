import type { Address } from "viem";

export type MediaHash =
  | "#black_image"
  | "#white_image"
  | "#black_single_video"
  | "#white_single_video"
  | "#black_triple_video"
  | "#white_triple_video";

export type OfferType = "buy" | "sell";
export type GallerySort = "latest" | "earliest";
export type GalleryView = "grid" | "spotlight";

export interface TokenMedia {
  blackImage: string;
  blackImageThumb: string;
  blackSingleVideo: string;
  blackTripleVideo: string;
  whiteImage: string;
  whiteImageThumb: string;
  whiteSingleVideo: string;
  whiteTripleVideo: string;
}

export interface TokenSummary {
  id: number;
  name: string;
  media: TokenMedia;
}

export interface TokenDetail extends TokenSummary {
  owner: Address;
  seed: string;
  previousTokenId: number | null;
  nextTokenId: number | null;
}

export interface Offer {
  id: number;
  active: boolean;
  buyer: Address;
  imageThumb: string;
  priceEth: string;
  priceWei: string;
  seller: Address;
  tokenId: number;
  tokenName: string;
  type: OfferType;
}

export interface PaginatedTokens {
  items: TokenSummary[];
  ownerAddress: Address | null;
  page: number;
  pageSize: number;
  sort: GallerySort;
  totalItems: number;
  totalPages: number;
  view: GalleryView;
}

export interface PaginatedOffers {
  items: Offer[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface HomeStats {
  finishedCount: number;
  runningCount: number;
  totalSupply: number;
  mintPriceWei: string;
  displayMintPriceWei: string;
  activeSellOffers: number;
}

export interface MintState {
  totalSupply: number;
  mintPriceWei: string;
  displayMintPriceWei: string;
  timeUntilSaleSeconds: number;
  saleOpensAt: string | null;
}

export interface RedeemState {
  timeUntilWithdrawalSeconds: number;
  lastMinter: Address;
  withdrawalAmountWei: string;
  withdrawalOpensAt: string | null;
}

export interface TokenMarketSnapshot {
  token: TokenDetail;
  activeBuyOffers: Offer[];
  activeSellOffer: Offer | null;
}

export interface WalletOffers {
  buyOffers: Offer[];
  sellOffers: Offer[];
}

export interface GiveawayEntry {
  id: number;
  owner: Address;
  seed: string;
}

export interface ResultStats {
  finishedCount: number;
  runningCount: number;
}

export interface RandomSelection {
  ids: number[];
}
