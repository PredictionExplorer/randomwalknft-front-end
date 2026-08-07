import { type Address, isAddress } from "viem";
import { z } from "zod";

const DEFAULT_CHAIN_ID = 42161;
const DEFAULT_NFT_ADDRESS =
  "0x895a6F444BE4ba9d124F61DF736605792B35D66b" as const;
const DEFAULT_MARKET_ADDRESS =
  "0x47eF85Dfb775aCE0934fBa9EEd09D22e6eC0Cc08" as const;
const DEFAULT_RPC_URL = "https://arb1.arbitrum.io/rpc";
const DEFAULT_MEDIA_BASE_URL =
  "https://randomwalknft.s3.us-east-2.amazonaws.com";
const DEFAULT_API_BASE_URL = "https://randomwalknft-api.com";
const DEVELOPMENT_WALLETCONNECT_PROJECT_ID = "00000000000000000000000000000000";

const addressSchema = z.string().refine((value) => isAddress(value), {
  message: "Expected a valid EVM address.",
});

const walletConnectProjectIdSchema = z
  .string()
  .regex(/^[a-f\d]{32}$/i, "Expected a 32-character WalletConnect project ID.");

const publicEnvSchema = z.object({
  NEXT_PUBLIC_CHAIN_ID: z.coerce
    .number()
    .refine((value) => value === DEFAULT_CHAIN_ID, {
      message: `Only Arbitrum (${DEFAULT_CHAIN_ID}) is supported.`,
    })
    .default(DEFAULT_CHAIN_ID),
  NEXT_PUBLIC_MARKET_ADDRESS: addressSchema.default(DEFAULT_MARKET_ADDRESS),
  NEXT_PUBLIC_NFT_ADDRESS: addressSchema.default(DEFAULT_NFT_ADDRESS),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: walletConnectProjectIdSchema.optional(),
});

const serverEnvSchema = z.object({
  ALLOW_INSECURE_NFT_API: z
    .union([z.literal("1"), z.literal("0")])
    .default("1"),
  MEDIA_BASE_URL: z.url().default(DEFAULT_MEDIA_BASE_URL),
  MOCK_APP_DATA: z.union([z.literal("1"), z.literal("0")]).default("0"),
  NFT_API_BASE_URL: z.url().default(DEFAULT_API_BASE_URL),
  RPC_URL: z.url().default(DEFAULT_RPC_URL),
});

export interface PublicAppConfig {
  chainId: number;
  marketAddress: Address;
  nftAddress: Address;
  walletConnectProjectId: string;
}

export interface ServerAppConfig {
  allowInsecureNftApi: boolean;
  apiBaseUrl: string;
  mediaBaseUrl: string;
  mockAppData: boolean;
  rpcUrl: string;
}

export function getPublicEnv(): PublicAppConfig {
  const walletConnectProjectId =
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

  if (process.env.NODE_ENV === "production" && !walletConnectProjectId) {
    throw new Error(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required in production.",
    );
  }
  if (
    process.env.NODE_ENV === "production" &&
    walletConnectProjectId === DEVELOPMENT_WALLETCONNECT_PROJECT_ID
  ) {
    throw new Error(
      "The all-zero WalletConnect project ID is test-only and cannot be used in production.",
    );
  }

  const parsed = publicEnvSchema.parse({
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_MARKET_ADDRESS: process.env.NEXT_PUBLIC_MARKET_ADDRESS,
    NEXT_PUBLIC_NFT_ADDRESS: process.env.NEXT_PUBLIC_NFT_ADDRESS,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: walletConnectProjectId,
  });

  return {
    chainId: parsed.NEXT_PUBLIC_CHAIN_ID,
    marketAddress: parsed.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    nftAddress: parsed.NEXT_PUBLIC_NFT_ADDRESS as Address,
    walletConnectProjectId:
      parsed.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
      DEVELOPMENT_WALLETCONNECT_PROJECT_ID,
  };
}

export function getServerEnv(): ServerAppConfig {
  const parsed = serverEnvSchema.parse({
    ALLOW_INSECURE_NFT_API: process.env.ALLOW_INSECURE_NFT_API,
    MEDIA_BASE_URL: process.env.MEDIA_BASE_URL,
    MOCK_APP_DATA: process.env.MOCK_APP_DATA,
    NFT_API_BASE_URL: process.env.NFT_API_BASE_URL,
    RPC_URL: process.env.RPC_URL,
  });

  return {
    allowInsecureNftApi: parsed.ALLOW_INSECURE_NFT_API === "1",
    apiBaseUrl: parsed.NFT_API_BASE_URL,
    mediaBaseUrl: parsed.MEDIA_BASE_URL,
    mockAppData: parsed.MOCK_APP_DATA === "1",
    rpcUrl: parsed.RPC_URL,
  };
}

export function isMockMode() {
  return process.env.NODE_ENV === "test" || getServerEnv().mockAppData;
}

export function getDefaultMediaBaseUrl() {
  return DEFAULT_MEDIA_BASE_URL;
}
