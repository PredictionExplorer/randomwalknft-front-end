"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useRef, useState } from "react";
import { useConnectors, WagmiProvider } from "wagmi";
import { reconnect } from "wagmi/actions";

import { getQueryClient } from "@/lib/query/query-client";
import { walletConfig } from "@/lib/wallet/config";

function ReconnectRecentWallet() {
  const connectors = useConnectors();
  const reconnectComplete = useRef(false);
  const reconnectInFlight = useRef(false);
  const retryDeadline = useRef(0);

  useEffect(() => {
    if (reconnectComplete.current) return;

    let active = true;

    function setDisconnected() {
      walletConfig.setState((state) => ({
        ...state,
        status: "disconnected",
      }));
    }

    function scheduleRetry(attemptReconnect: () => Promise<void>) {
      if (!active || Date.now() >= retryDeadline.current) return;
      window.setTimeout(() => void attemptReconnect(), 100);
    }

    async function attemptReconnect() {
      if (!active || reconnectComplete.current || reconnectInFlight.current) {
        return;
      }

      reconnectInFlight.current = true;
      walletConfig.setState((state) => ({
        ...state,
        status: state.current ? "reconnecting" : "connecting",
      }));

      try {
        const recentConnectorId =
          await walletConfig.storage?.getItem("recentConnectorId");
        if (!active) return;
        if (!recentConnectorId) {
          reconnectComplete.current = true;
          setDisconnected();
          return;
        }
        if (retryDeadline.current === 0) {
          retryDeadline.current = Date.now() + 2_000;
        }

        const connector = connectors.find(
          (candidate) => candidate.id === recentConnectorId,
        );
        if (!connector) {
          setDisconnected();
          scheduleRetry(attemptReconnect);
          return;
        }

        const connections = await reconnect(walletConfig, {
          connectors: [connector],
        });
        if (connections.length > 0) {
          reconnectComplete.current = true;
        } else {
          setDisconnected();
          scheduleRetry(attemptReconnect);
        }
      } catch {
        if (active) setDisconnected();
      } finally {
        reconnectInFlight.current = false;
      }
    }

    const timeout = window.setTimeout(() => void attemptReconnect(), 0);
    const handleProviderAvailable = () => {
      void attemptReconnect();
    };
    window.addEventListener("ethereum#initialized", handleProviderAvailable);
    window.addEventListener(
      "eip6963:announceProvider",
      handleProviderAvailable as EventListener,
    );
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => {
      active = false;
      window.clearTimeout(timeout);
      window.removeEventListener(
        "ethereum#initialized",
        handleProviderAvailable,
      );
      window.removeEventListener(
        "eip6963:announceProvider",
        handleProviderAvailable as EventListener,
      );
    };
  }, [connectors]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <WagmiProvider config={walletConfig} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <ReconnectRecentWallet />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
