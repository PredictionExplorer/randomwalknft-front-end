import { expect, type Page, test } from "@playwright/test";

const ACCOUNT = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

async function installMetaMaskMobileMock(
  page: Page,
  options: { authorized?: boolean; chainId?: `0x${string}` } = {},
) {
  await page.addInitScript(
    ({ account, authorized, initialChainId }) => {
      const listeners = new Map<string, Set<(...args: unknown[]) => void>>();
      const requestLog: string[] = [];
      const authorizationKey = "e2e.metamask.authorized";
      const chainKey = "e2e.metamask.chain";

      if (authorized) localStorage.setItem(authorizationKey, "1");
      if (!localStorage.getItem(chainKey)) {
        localStorage.setItem(chainKey, initialChainId);
      }

      const provider = {
        isMetaMask: true,
        on(event: string, listener: (...args: unknown[]) => void) {
          const eventListeners = listeners.get(event) ?? new Set();
          eventListeners.add(listener);
          listeners.set(event, eventListeners);
        },
        removeListener(event: string, listener: (...args: unknown[]) => void) {
          listeners.get(event)?.delete(listener);
        },
        async request({
          method,
          params,
        }: {
          method: string;
          params?: unknown[];
        }) {
          requestLog.push(method);

          if (method === "wallet_requestPermissions") {
            throw Object.assign(new Error("Method not found"), {
              code: -32601,
            });
          }
          if (method === "eth_requestAccounts") {
            localStorage.setItem(authorizationKey, "1");
            return [account];
          }
          if (method === "eth_accounts") {
            return localStorage.getItem(authorizationKey) === "1"
              ? [account]
              : [];
          }
          if (method === "eth_chainId") {
            return localStorage.getItem(chainKey) ?? initialChainId;
          }
          if (method === "wallet_switchEthereumChain") {
            const [{ chainId }] = params as [{ chainId: string }];
            localStorage.setItem(chainKey, chainId);
            for (const listener of listeners.get("chainChanged") ?? []) {
              listener(chainId);
            }
            return null;
          }
          if (method === "wallet_revokePermissions") {
            localStorage.removeItem(authorizationKey);
            return null;
          }

          throw new Error(`Unsupported E2E wallet method: ${method}`);
        },
      };

      Object.defineProperty(window, "__walletRequestLog", {
        configurable: true,
        value: requestLog,
      });

      const installProvider = () => {
        Object.defineProperty(window, "ethereum", {
          configurable: true,
          value: provider,
        });
        window.dispatchEvent(new Event("ethereum#initialized"));
      };

      if (localStorage.getItem("e2e.metamask.delayInjection") === "1") {
        window.setTimeout(installProvider, 300);
      } else {
        installProvider();
      }
    },
    {
      account: ACCOUNT,
      authorized: options.authorized ?? false,
      initialChainId: options.chainId ?? "0xa4b1",
    },
  );
}

test("connects through injected MetaMask and restores across routes", async ({
  page,
}) => {
  await installMetaMaskMobileMock(page);
  await page.goto("/");

  await page.getByRole("button", { name: /connect wallet/i }).click();
  await page.getByRole("button", { name: /use metamask directly/i }).click();

  await expect(page.getByText(/0x6b17/i).first()).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (
          window as unknown as Window & { __walletRequestLog: string[] }
        ).__walletRequestLog.includes("eth_requestAccounts"),
      ),
    )
    .toBe(true);

  await page.goto("/my-nfts");
  await expect(page.getByRole("heading", { name: /my nfts/i })).toBeVisible();

  await page.evaluate(() => {
    localStorage.setItem("e2e.metamask.delayInjection", "1");
  });
  await page.reload();
  await expect(page.getByText(/0x6b17/i).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /my nfts/i })).toBeVisible();
});

test("requires and completes an explicit Arbitrum switch", async ({ page }) => {
  await installMetaMaskMobileMock(page, {
    chainId: "0x1",
  });
  await page.goto("/");
  await page.getByRole("button", { name: /connect wallet/i }).click();
  await page.getByRole("button", { name: /use metamask directly/i }).click();

  const switchButton = page.getByRole("button", {
    name: /switch to arbitrum/i,
  });
  await expect(switchButton).toBeVisible();
  await switchButton.click();

  await expect(page.getByText(/0x6b17/i).first()).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (
          window as unknown as Window & { __walletRequestLog: string[] }
        ).__walletRequestLog.includes("wallet_switchEthereumChain"),
      ),
    )
    .toBe(true);
});
