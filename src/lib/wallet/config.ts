import {
  createConfig,
  createConnector,
  type CreateConnectorFn,
  http,
} from "wagmi";
import { arbitrum } from "wagmi/chains";
import {
  baseAccount,
  injected,
  metaMask,
  safe,
  walletConnect,
  type WalletConnectParameters,
} from "wagmi/connectors";

import { getPublicEnv } from "@/lib/env";

const appMetadata = {
  description:
    "Programmatically generated Random Walk image and video NFTs on Arbitrum.",
  iconUrl: "https://randomwalknft.com/brand/logo.svg",
  name: "Random Walk NFT",
  url: "https://randomwalknft.com",
} as const;

/**
 * WalletConnect eagerly initializes its IndexedDB-backed provider from
 * connector.setup(). Deferring setup keeps this config safe to import during
 * Next.js server rendering; connect/reconnect initializes it in the browser.
 */
function lazyWalletConnect(
  parameters: WalletConnectParameters,
): CreateConnectorFn {
  const connector = walletConnect(parameters);

  return createConnector((config) => ({
    ...connector(config),
    async setup() {},
  }));
}

const publicEnv = getPublicEnv();

export const appChain = arbitrum;

export const walletConfig = createConfig({
  chains: [appChain],
  connectors: [
    injected({
      target: "metaMask",
      unstable_shimAsyncInject: 2_000,
    }),
    metaMask({
      dapp: {
        iconUrl: appMetadata.iconUrl,
        name: appMetadata.name,
      },
    }),
    injected({
      unstable_shimAsyncInject: 2_000,
    }),
    lazyWalletConnect({
      metadata: {
        description: appMetadata.description,
        icons: [appMetadata.iconUrl],
        name: appMetadata.name,
        url: appMetadata.url,
      },
      projectId: publicEnv.walletConnectProjectId,
      qrModalOptions: {
        themeMode: "dark",
      },
      showQrModal: true,
    }),
    baseAccount({
      appLogoUrl: appMetadata.iconUrl,
      appName: appMetadata.name,
    }),
    safe({
      shimDisconnect: true,
    }),
  ],
  ssr: true,
  transports: {
    [appChain.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof walletConfig;
  }
}
