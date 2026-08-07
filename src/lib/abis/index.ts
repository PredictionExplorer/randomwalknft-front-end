import type { Abi } from "viem";

import marketAbiJson from "@/lib/abis/market.json";
import nftAbiJson from "@/lib/abis/nft.json";

export const nftAbi = nftAbiJson as Abi;
export const marketAbi = marketAbiJson as Abi;
