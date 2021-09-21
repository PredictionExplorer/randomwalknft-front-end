import { Web3Provider } from "@ethersproject/providers";
import { SafeAppConnector } from "@gnosis.pm/safe-apps-web3-react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import {
  ALL_SUPPORTED_CHAIN_IDS,
  DEFAULT_CHAIN_ID,
  SupportedChainId,
} from "../constants/chains";
import getLibrary from "../utils/getLibrary";
import { NetworkConnector } from "./NetworkConnector";

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;

if (typeof INFURA_KEY === "undefined") {
  throw new Error(
    `REACT_APP_INFURA_KEY must be a defined environment variable`
  );
}

const NETWORK_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.ARBITRUM_ONE]: `https://198.58.105.159:8545`,
  [SupportedChainId.ARBITRUM_RINKEBY]: `https://arbitrum-rinkeby.infura.io/v3/${INFURA_KEY}`,
};

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: DEFAULT_CHAIN_ID,
});

let networkLibrary: Web3Provider | undefined;
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(network.provider));
}

export const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
});

export const gnosisSafe = new SafeAppConnector();

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  rpc: NETWORK_URLS,
  qrcode: true,
});
