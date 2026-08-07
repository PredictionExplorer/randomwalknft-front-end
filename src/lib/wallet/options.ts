import type { Connector } from "wagmi";

export interface WalletOption {
  connector: Connector;
  description: string;
  label: string;
}

export function resolveWalletOptions(
  connectors: readonly Connector[],
  availableConnectorUids: ReadonlySet<string>,
): WalletOption[] {
  const directMetaMask = connectors.find(
    (connector) =>
      connector.id === "metaMask" && availableConnectorUids.has(connector.uid),
  );
  const metaMaskConnect = connectors.find(
    (connector) => connector.id === "metaMaskSDK",
  );
  const walletConnectConnector = connectors.find(
    (connector) => connector.id === "walletConnect",
  );
  const baseConnector = connectors.find(
    (connector) => connector.id === "baseAccount",
  );
  const safeConnector = connectors.find(
    (connector) =>
      connector.id === "safe" && availableConnectorUids.has(connector.uid),
  );
  const genericInjected = connectors.find(
    (connector) =>
      connector.id === "injected" && availableConnectorUids.has(connector.uid),
  );

  const options: WalletOption[] = [];
  const metaMaskConnector = directMetaMask ?? metaMaskConnect;

  if (metaMaskConnector) {
    options.push({
      connector: metaMaskConnector,
      description: directMetaMask
        ? "Use MetaMask directly in this browser."
        : "Open MetaMask Connect on mobile or desktop.",
      label: "MetaMask",
    });
  }

  const installed = connectors.filter(
    (connector) =>
      connector.type === "injected" &&
      connector.id !== "metaMask" &&
      connector.id !== "injected" &&
      availableConnectorUids.has(connector.uid),
  );

  for (const connector of installed) {
    options.push({
      connector,
      description: "Installed browser wallet",
      label: connector.name,
    });
  }

  if (genericInjected && !directMetaMask && installed.length === 0) {
    options.push({
      connector: genericInjected,
      description: "Use the wallet provided by this browser.",
      label: "Browser wallet",
    });
  }

  if (baseConnector) {
    options.push({
      connector: baseConnector,
      description: "Connect with Base Account.",
      label: "Base Account",
    });
  }

  if (walletConnectConnector) {
    options.push({
      connector: walletConnectConnector,
      description: "Rainbow and other WalletConnect wallets.",
      label: "Rainbow & other wallets",
    });
  }

  if (safeConnector) {
    options.push({
      connector: safeConnector,
      description: "Use the current Safe app.",
      label: "Safe",
    });
  }

  const seen = new Set<string>();
  return options.filter((option) => {
    const key = option.label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
