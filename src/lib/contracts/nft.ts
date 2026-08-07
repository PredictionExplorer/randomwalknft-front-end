import "server-only";

import type { Address } from "viem";

import { nftAbi } from "@/lib/abis";
import { getPublicClient } from "@/lib/contracts/clients";
import { getPublicEnv, isMockMode } from "@/lib/env";
import { secondsFromNow } from "@/lib/format";
import { buildTokenMedia } from "@/lib/media";
import {
  getMockGallery,
  mockHomeStats,
  mockMintState,
  mockRedeemState,
  mockTokenDetails,
  mockTokens,
} from "@/lib/mock-data";
import type {
  GallerySort,
  GalleryView,
  HomeStats,
  MintState,
  PaginatedTokens,
  RedeemState,
  TokenDetail,
  TokenSummary,
} from "@/types";

function withMarkup(mintPrice: bigint) {
  return ((mintPrice * 101n) / 100n).toString();
}

async function getNamesForIds(tokenIds: number[]) {
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

export async function getGalleryPage(params: {
  ownerAddress?: Address | null;
  page?: number;
  pageSize?: number;
  sort?: GallerySort;
  view?: GalleryView;
}): Promise<PaginatedTokens> {
  const ownerAddress = params.ownerAddress ?? null;
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 24;
  const sort = params.sort ?? "latest";
  const view = params.view ?? "grid";

  if (isMockMode()) {
    return getMockGallery({
      ownerAddress,
      page,
      pageSize,
      sort,
      view,
    });
  }

  const client = getPublicClient();
  const { nftAddress } = getPublicEnv();
  const tokenIds = ownerAddress
    ? (
        (await client.readContract({
          abi: nftAbi,
          address: nftAddress,
          functionName: "walletOfOwner",
          args: [ownerAddress],
        })) as bigint[]
      ).map(Number)
    : Array.from(
        {
          length: Number(
            await client.readContract({
              abi: nftAbi,
              address: nftAddress,
              functionName: "totalSupply",
            }),
          ),
        },
        (_, index) => index,
      );
  const orderedIds =
    sort === "latest"
      ? [...tokenIds].reverse()
      : [...tokenIds].sort((a, b) => a - b);
  const start = (page - 1) * pageSize;
  const pageIds = orderedIds.slice(start, start + pageSize);
  const names = await getNamesForIds(pageIds);
  const items: TokenSummary[] = pageIds.map((id, index) => ({
    id,
    media: buildTokenMedia(id),
    name: names[index],
  }));

  return {
    items,
    ownerAddress,
    page,
    pageSize,
    sort,
    totalItems: orderedIds.length,
    totalPages: Math.max(1, Math.ceil(orderedIds.length / pageSize)),
    view,
  };
}

export async function getTokenDetail(
  tokenId: number,
): Promise<TokenDetail | null> {
  if (isMockMode()) {
    return mockTokenDetails.find((token) => token.id === tokenId) ?? null;
  }

  const client = getPublicClient();
  const { nftAddress } = getPublicEnv();

  try {
    const [owner, seed, name, totalSupply] = (await Promise.all([
      client.readContract({
        abi: nftAbi,
        address: nftAddress,
        functionName: "ownerOf",
        args: [BigInt(tokenId)],
      }),
      client.readContract({
        abi: nftAbi,
        address: nftAddress,
        functionName: "seeds",
        args: [BigInt(tokenId)],
      }),
      client.readContract({
        abi: nftAbi,
        address: nftAddress,
        functionName: "tokenNames",
        args: [BigInt(tokenId)],
      }),
      client.readContract({
        abi: nftAbi,
        address: nftAddress,
        functionName: "totalSupply",
      }),
    ])) as [Address, string, string, bigint];

    return {
      id: tokenId,
      media: buildTokenMedia(tokenId),
      name,
      nextTokenId: tokenId < Number(totalSupply) - 1 ? tokenId + 1 : null,
      owner,
      previousTokenId: tokenId > 0 ? tokenId - 1 : null,
      seed,
    };
  } catch {
    return null;
  }
}

export async function getHomeStats(): Promise<HomeStats> {
  if (isMockMode()) {
    return mockHomeStats;
  }

  const client = getPublicClient();
  const { nftAddress } = getPublicEnv();
  const [totalSupply, mintPrice] = (await Promise.all([
    client.readContract({
      abi: nftAbi,
      address: nftAddress,
      functionName: "totalSupply",
    }),
    client.readContract({
      abi: nftAbi,
      address: nftAddress,
      functionName: "getMintPrice",
    }),
  ])) as [bigint, bigint];

  return {
    activeSellOffers: 0,
    displayMintPriceWei: withMarkup(mintPrice),
    finishedCount: 0,
    mintPriceWei: mintPrice.toString(),
    runningCount: 0,
    totalSupply: Number(totalSupply),
  };
}

export async function getMintState(): Promise<MintState> {
  if (isMockMode()) {
    return mockMintState;
  }

  const client = getPublicClient();
  const { nftAddress } = getPublicEnv();
  const [mintPrice, totalSupply, timeUntilSale] = (await Promise.all([
    client.readContract({
      abi: nftAbi,
      address: nftAddress,
      functionName: "getMintPrice",
    }),
    client.readContract({
      abi: nftAbi,
      address: nftAddress,
      functionName: "totalSupply",
    }),
    client.readContract({
      abi: nftAbi,
      address: nftAddress,
      functionName: "timeUntilSale",
    }),
  ])) as [bigint, bigint, bigint];

  return {
    displayMintPriceWei: withMarkup(mintPrice),
    mintPriceWei: mintPrice.toString(),
    saleOpensAt:
      Number(timeUntilSale) > 0 ? secondsFromNow(Number(timeUntilSale)) : null,
    timeUntilSaleSeconds: Number(timeUntilSale),
    totalSupply: Number(totalSupply),
  };
}

export async function getRedeemState(): Promise<RedeemState> {
  if (isMockMode()) {
    return mockRedeemState;
  }

  const client = getPublicClient();
  const { nftAddress } = getPublicEnv();
  const [timeUntilWithdrawal, lastMinter, withdrawalAmount] =
    (await Promise.all([
      client.readContract({
        abi: nftAbi,
        address: nftAddress,
        functionName: "timeUntilWithdrawal",
      }),
      client.readContract({
        abi: nftAbi,
        address: nftAddress,
        functionName: "lastMinter",
      }),
      client.readContract({
        abi: nftAbi,
        address: nftAddress,
        functionName: "withdrawalAmount",
      }),
    ])) as [bigint, Address, bigint];

  return {
    lastMinter,
    timeUntilWithdrawalSeconds: Number(timeUntilWithdrawal),
    withdrawalAmountWei: withdrawalAmount.toString(),
    withdrawalOpensAt:
      Number(timeUntilWithdrawal) > 0
        ? secondsFromNow(Number(timeUntilWithdrawal))
        : null,
  };
}

export async function getWalletTokens(
  address: Address,
): Promise<TokenSummary[]> {
  if (isMockMode()) {
    return mockTokenDetails
      .filter((token) => token.owner.toLowerCase() === address.toLowerCase())
      .map((token) => ({ id: token.id, media: token.media, name: token.name }));
  }

  const client = getPublicClient();
  const { nftAddress } = getPublicEnv();
  const tokenIds = (
    (await client.readContract({
      abi: nftAbi,
      address: nftAddress,
      functionName: "walletOfOwner",
      args: [address],
    })) as bigint[]
  ).map(Number);
  const names = await getNamesForIds(tokenIds);

  return tokenIds.map((tokenId, index) => ({
    id: tokenId,
    media: buildTokenMedia(tokenId),
    name: names[index],
  }));
}

export function getFeaturedTokens() {
  return mockTokens.slice(0, 4);
}
