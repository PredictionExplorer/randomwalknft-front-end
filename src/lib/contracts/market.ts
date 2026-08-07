import "server-only";

import type { Address } from "viem";
import { zeroAddress } from "viem";

import { marketAbi, nftAbi } from "@/lib/abis";
import { getPublicClient } from "@/lib/contracts/clients";
import { getTokenDetail } from "@/lib/contracts/nft";
import { getPublicEnv, isMockMode } from "@/lib/env";
import { buildTokenMedia } from "@/lib/media";
import {
  getMockMarketplace,
  getMockTokenMarketSnapshot,
  getMockWalletOffers,
  mockOffers,
} from "@/lib/mock-data";
import type {
  Offer,
  PaginatedOffers,
  TokenMarketSnapshot,
  WalletOffers,
} from "@/types";

interface RawOffer {
  active: boolean;
  buyer: Address;
  nftAddress: Address;
  price: bigint;
  seller: Address;
  tokenId: bigint;
}

async function getOfferNames(tokenIds: number[]) {
  if (tokenIds.length === 0) {
    return [];
  }

  const client = getPublicClient();
  const { nftAddress } = getPublicEnv();
  const results = await client.multicall({
    allowFailure: true,
    contracts: tokenIds.map((tokenId) => ({
      abi: nftAbi,
      address: nftAddress,
      functionName: "tokenNames",
      args: [BigInt(tokenId)],
    })),
  });

  return results.map((result, index) =>
    result.status === "success" && result.result
      ? String(result.result)
      : `Random Walk ${tokenIds[index]}`,
  );
}

function normalizeOffer(
  rawOffer: RawOffer,
  offerId: number,
  tokenName: string,
): Offer {
  const tokenId = Number(rawOffer.tokenId);

  return {
    active: rawOffer.active,
    buyer: rawOffer.buyer,
    id: offerId,
    imageThumb: buildTokenMedia(tokenId).blackImageThumb,
    priceEth: rawOffer.price.toString(),
    priceWei: rawOffer.price.toString(),
    seller: rawOffer.seller,
    tokenId,
    tokenName,
    type: rawOffer.buyer === zeroAddress ? "sell" : "buy",
  };
}

async function getOfferById(offerId: number) {
  const client = getPublicClient();
  const { marketAddress, nftAddress } = getPublicEnv();
  const tuple = (await client.readContract({
    abi: marketAbi,
    address: marketAddress,
    functionName: "offers",
    args: [BigInt(offerId)],
  })) as [Address, bigint, bigint, Address, Address, boolean];
  const rawOffer: RawOffer = {
    active: tuple[5],
    buyer: tuple[4],
    nftAddress: tuple[0],
    price: tuple[2],
    seller: tuple[3],
    tokenId: tuple[1],
  };

  if (rawOffer.nftAddress.toLowerCase() !== nftAddress.toLowerCase()) {
    return null;
  }

  const [tokenName] = await getOfferNames([Number(rawOffer.tokenId)]);
  return normalizeOffer(rawOffer, offerId, tokenName);
}

export async function getMarketplacePage(
  page = 1,
  pageSize = 24,
): Promise<PaginatedOffers> {
  if (isMockMode()) {
    return getMockMarketplace(page, pageSize);
  }

  const client = getPublicClient();
  const { marketAddress } = getPublicEnv();
  const offerCount = Number(
    await client.readContract({
      abi: marketAbi,
      address: marketAddress,
      functionName: "numOffers",
    }),
  );
  const offerIds = Array.from({ length: offerCount }, (_, index) => index);
  const offers = (
    await Promise.all(offerIds.map((offerId) => getOfferById(offerId)))
  ).filter((offer): offer is Offer =>
    Boolean(offer?.active && offer.type === "sell"),
  );
  const ordered = offers.sort(
    (left, right) => Number(left.priceWei) - Number(right.priceWei),
  );
  const start = (page - 1) * pageSize;

  return {
    items: ordered.slice(start, start + pageSize),
    page,
    pageSize,
    totalItems: ordered.length,
    totalPages: Math.max(1, Math.ceil(ordered.length / pageSize)),
  };
}

export async function getTokenMarketSnapshot(
  tokenId: number,
): Promise<TokenMarketSnapshot | null> {
  if (isMockMode()) {
    return getMockTokenMarketSnapshot(tokenId);
  }

  const client = getPublicClient();
  const { marketAddress, nftAddress } = getPublicEnv();
  const [buyOfferIds, sellOfferIds] = await Promise.all([
    client.readContract({
      abi: marketAbi,
      address: marketAddress,
      functionName: "getBuyOffers",
      args: [nftAddress, BigInt(tokenId)],
    }),
    client.readContract({
      abi: marketAbi,
      address: marketAddress,
      functionName: "getSellOffers",
      args: [nftAddress, BigInt(tokenId)],
    }),
  ]);
  const [token, buyOffers, sellOffers] = await Promise.all([
    getTokenDetail(tokenId),
    Promise.all(
      (buyOfferIds as bigint[]).map((offerId) => getOfferById(Number(offerId))),
    ),
    Promise.all(
      (sellOfferIds as bigint[]).map((offerId) =>
        getOfferById(Number(offerId)),
      ),
    ),
  ]);

  if (!token) {
    return null;
  }

  return {
    activeBuyOffers: buyOffers.filter((offer): offer is Offer =>
      Boolean(offer?.active),
    ),
    activeSellOffer:
      sellOffers.find((offer): offer is Offer => Boolean(offer?.active)) ??
      null,
    token,
  };
}

export async function getWalletOffers(address: Address): Promise<WalletOffers> {
  if (isMockMode()) {
    return getMockWalletOffers();
  }

  const client = getPublicClient();
  const { marketAddress, nftAddress } = getPublicEnv();
  const [buyOfferIds, sellOfferIds] = await Promise.all([
    client.readContract({
      abi: marketAbi,
      address: marketAddress,
      functionName: "getBuyOffersBy",
      args: [nftAddress, address],
    }),
    client.readContract({
      abi: marketAbi,
      address: marketAddress,
      functionName: "getSellOffersBy",
      args: [nftAddress, address],
    }),
  ]);
  const [buyOffers, sellOffers] = await Promise.all([
    Promise.all(
      (buyOfferIds as bigint[]).map((offerId) => getOfferById(Number(offerId))),
    ),
    Promise.all(
      (sellOfferIds as bigint[]).map((offerId) =>
        getOfferById(Number(offerId)),
      ),
    ),
  ]);

  return {
    buyOffers: buyOffers.filter((offer): offer is Offer =>
      Boolean(offer?.active),
    ),
    sellOffers: sellOffers.filter((offer): offer is Offer =>
      Boolean(offer?.active),
    ),
  };
}

export function getMockOffers() {
  return mockOffers;
}
