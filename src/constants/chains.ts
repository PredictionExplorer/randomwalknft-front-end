import arbitrumLogoUrl from "assets/svg/arbitrum_logo.svg";
import optimismLogoUrl from "assets/svg/optimism_logo.svg";

export enum SupportedChainId {
  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
}

export const DEFAULT_CHAIN_ID = SupportedChainId.ARBITRUM_RINKEBY;

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
];

export const L2_CHAIN_IDS = [
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
] as const;

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number];

interface L1ChainInfo {
  readonly docs: string;
  readonly explorer: string;
  readonly infoLink: string;
  readonly label: string;
}
export interface L2ChainInfo extends L1ChainInfo {
  readonly bridge: string;
  readonly logoUrl: string;
}

type ChainInfo = { readonly [chainId: number]: L1ChainInfo | L2ChainInfo } & {
  readonly [chainId in SupportedL2ChainId]: L2ChainInfo;
};

export const CHAIN_INFO: ChainInfo = {
  [SupportedChainId.ARBITRUM_ONE]: {
    bridge: "https://bridge.arbitrum.io/",
    docs: "https://offchainlabs.com/",
    explorer: "https://arbiscan.io/",
    infoLink: "https://info.uniswap.org/#/arbitrum",
    label: "Arbitrum",
    logoUrl: arbitrumLogoUrl,
  },
  [SupportedChainId.ARBITRUM_RINKEBY]: {
    bridge: "https://bridge.arbitrum.io/",
    docs: "https://offchainlabs.com/",
    explorer: "https://rinkeby-explorer.arbitrum.io/",
    infoLink: "https://info.uniswap.org/#/arbitrum/",
    label: "Arbitrum Rinkeby",
    logoUrl: arbitrumLogoUrl,
  },
};
