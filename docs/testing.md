# Testing

## Layers

- Vitest:
  - formatting and env helpers
  - media URL helpers
  - query param helpers
  - API route handlers
  - component rendering for FAQ, token cards, and wallet guards
  - wallet option selection and error mapping
  - injected MetaMask connection behavior, including the iOS permissions fallback
  - transaction phases, wrong-network blocking, and explicit marketplace approval/listing
  - Node-environment wallet config import without `window`, `localStorage`, or `indexedDB`
- Playwright:
  - home, gallery, marketplace, and detail smoke coverage
  - axe-based accessibility check on the home page
  - macOS screenshot baselines for the major public routes; Linux CI still runs functional and accessibility assertions
  - Pixel/Chromium and iPhone/WebKit injected-wallet connection, reconnect, route persistence, and chain switching

## Commands

```bash
pnpm test
pnpm test:e2e
pnpm exec playwright test tests/e2e/wallet-mobile.spec.ts
pnpm test:e2e:update
```

## Mock mode

Playwright and a number of route handlers support `MOCK_APP_DATA=1`. In that mode:

- contract reads come from local fixtures
- the external NFT API proxy resolves from local mock values
- the browser suite is deterministic and does not depend on live chain/API state
- wallet-mobile tests inject an EIP-1193/EIP-6963-compatible provider before application code runs

The injected provider exercises application and wagmi behavior, not the native
MetaMask application. It intentionally models MetaMask iOS not supporting
`wallet_requestPermissions`, then verifies fallback to `eth_requestAccounts`.

To aim Playwright at a server you already started manually:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:54321 PLAYWRIGHT_SKIP_WEBSERVER=1 pnpm test:e2e
```

## Coverage policy

Vitest coverage is enforced on the modules currently under direct unit/component test. The threshold favors statement/function confidence while keeping branch coverage realistic for heavily presentational files.

## Real-device wallet acceptance

Before a wallet release, test the production HTTPS deployment on a current
iPhone and Android device:

1. Open the site in MetaMask's built-in browser.
2. Connect and verify that the native account approval appears.
3. Reject once, retry, then approve.
4. Reload and navigate between Mint, My NFTs, My Offers, and a token detail page; the same account must remain connected.
5. Start on a non-Arbitrum network, use the explicit switch action, and verify that no transaction is submitted during the switch.
6. Mint or submit an offer, background MetaMask, return, and verify pending/confirmed feedback.
7. For listing, approve the marketplace and list with two separate taps and confirmations.
8. Repeat connection from Safari/Chrome with MetaMask Connect and with the generic WalletConnect option.

Native app handoff is not a PR-CI gate because Playwright cannot automate the
MetaMask iOS/Android application faithfully.
