# Random Walk NFT Frontend

Production-grade frontend for [randomwalknft.com](https://randomwalknft.com), rebuilt as a modern Next.js App Router application with strict TypeScript, a custom design system, typed blockchain adapters, internal API route handlers, and a testable wallet UX.

The codebase is designed for:

- reliable local development
- repeatable CI/CD
- Vercel deployment
- predictable Node and pnpm version management

## Overview

This repo replaces the legacy CRA-era frontend with a stack centered on:

- Next.js 16 App Router
- React 19
- TypeScript 5
- Tailwind CSS v4
- Radix-based UI primitives
- viem + wagmi 3 + MetaMask Connect/WalletConnect
- TanStack Query
- Vitest + React Testing Library
- Playwright + axe accessibility checks

## Why Vercel

Yes, Vercel is the right deployment target for this project.

Reasons:

- it is the best-supported platform for Next.js App Router
- it handles route handlers, dynamic rendering, image optimization, and metadata routes cleanly
- it gives a straightforward Git-based deployment flow for preview and production environments
- it aligns well with the CI/deployment model already set up in this repo

Relevant docs:

- [Vercel Next.js framework docs](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Git deployment docs](https://vercel.com/docs/deployments/git/vercel-for-github)
- [Vercel project settings](https://vercel.com/docs/project-configuration/general-settings)

## Node Version Management

### Recommended approach

Use **Volta**.

Volta is the best fit here because it automatically uses the pinned Node and pnpm versions when you enter the repo and when you run package-manager commands. It avoids the “I forgot to switch versions” problem better than `nvm`.

This repo now pins:

- Node: `22.12.0`
- pnpm: `10.13.1`

Pinning is defined in:

- `[package.json](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/package.json)` via the `volta` field
- `[.nvmrc](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/.nvmrc)`
- `[.node-version](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/.node-version)`

### Install Volta

macOS:

```bash
brew install volta
```

Then install the pinned toolchain:

```bash
volta install node@22.12.0 pnpm@10.13.1
```

After that, entering the repo and running `node`, `pnpm`, or project scripts will automatically use the pinned versions.

### If you prefer nvm or fnm

`nvm`:

```bash
nvm install
nvm use
```

`fnm`:

```bash
fnm use
```

### Why Node 22 and not Node 23

Node 23 is not the right target for production.

- odd-numbered Node releases are short-lived, non-LTS lines
- Node 22 is an LTS line
- Vercel supports configuring Node versions for builds and functions, and stable LTS releases are the correct baseline

Relevant docs:

- [Node.js release schedule](https://nodejs.org/en/about/previous-releases)
- [Vercel Node.js 22 availability](https://vercel.com/changelog/node-js-22-lts-is-now-available)
- [Vercel recommendation to use a Node version file](https://vercel.com/docs/conformance/rules/REQUIRE_NODE_VERSION_FILE)

## Project Structure

- `[src/app](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/src/app)`:
  routes, route handlers, metadata routes, loading/error boundaries
- `[src/features](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/src/features)`:
  domain-oriented UI and route logic
- `[src/components](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/src/components)`:
  layout, shared components, UI primitives
- `[src/lib](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/src/lib)`:
  env parsing, formatting, media builders, mocks, contract adapters, query helpers
- `[src/providers](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/src/providers)`:
  app-wide TanStack Query and wagmi provider composition
- `[tests/e2e](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/tests/e2e)`:
  Playwright smoke, accessibility, screenshot, and mobile wallet tests
- `[docs](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/docs)`:
  architecture, testing, deployment notes

## Public Routes

- `/`
- `/mint`
- `/gallery`
- `/detail/[id]`
- `/marketplace`
- `/redeem`
- `/my-nfts`
- `/my-offers`
- `/faq`
- `/code`
- `/random`
- `/random-video`

## Local Development

### 1. Install the correct toolchain

Preferred:

```bash
volta install node@22.12.0 pnpm@10.13.1
```

Fallback:

```bash
nvm install
nvm use
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Create a local environment file

```bash
cp .env.example .env.local
```

For most local UI/testing work, the defaults are fine.

### 4. Start the dev server

```bash
pnpm dev
```

Local URL:

- `http://127.0.0.1:3000`

## Running the Site Locally for Testing

### Fast local validation

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Browser-level verification

Install Playwright’s browsers once:

```bash
pnpm exec playwright install chromium webkit
```

Then run:

```bash
pnpm test:e2e
```

To point Playwright at an already-running local server:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:54321 PLAYWRIGHT_SKIP_WEBSERVER=1 pnpm test:e2e
```

If screenshot baselines need to be refreshed:

```bash
pnpm test:e2e:update
```

### Full verification command sequence

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## Environment Variables

This repo can boot with safe defaults for local work, but production must set all of these explicitly.

### Public variables

- `NEXT_PUBLIC_NFT_ADDRESS`
- `NEXT_PUBLIC_MARKET_ADDRESS`
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

### Server variables

- `RPC_URL`
- `NFT_API_BASE_URL`
- `MEDIA_BASE_URL`
- `ALLOW_INSECURE_NFT_API`
- `MOCK_APP_DATA`

### Notes

- `MOCK_APP_DATA=1` is useful for deterministic local and E2E runs.
- `NEXT_PUBLIC_CHAIN_ID` must be `42161`.
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` must be a real 32-character Reown project ID in production; the all-zero value is test-only.
- `ALLOW_INSECURE_NFT_API=1` exists because the current NFT API endpoint presents an invalid TLS configuration. This is intentionally confined to server-side proxy code.

## Scripts

- `pnpm dev`: run the local dev server
- `pnpm build`: create a production build
- `pnpm start`: run the production server locally
- `pnpm lint`: run ESLint
- `pnpm typecheck`: run TypeScript without emitting files
- `pnpm test`: run Vitest with coverage
- `pnpm test:watch`: run Vitest in watch mode
- `pnpm test:e2e`: run desktop smoke/accessibility/screenshot tests plus mobile injected-wallet tests
- `pnpm test:e2e:update`: update Playwright screenshots
- `pnpm format`: format the repo with Prettier
- `pnpm format:check`: verify formatting
- `pnpm ci:check`: run the full CI-oriented validation chain

## Quality Standards

This repo includes:

- strict TypeScript
- ESLint flat config
- import sorting and unused import enforcement
- Husky pre-commit and pre-push hooks
- Vitest coverage enforcement on gated modules
- Playwright smoke and screenshot coverage
- GitHub Actions CI
- Renovate config
- issue and PR templates

## Testing Strategy

### Unit and component tests

`pnpm test`

Covers:

- formatting helpers
- env parsing
- media URL generation
- query parameter helpers
- selected API route handlers
- key presentational components
- injected MetaMask selection and connection
- wallet transaction states and mobile-safe multi-step actions
- SSR-safe wallet configuration

### Browser tests

`pnpm test:e2e`

Covers:

- home page smoke and accessibility
- gallery route smoke
- marketplace route smoke
- detail page deep-link route smoke
- screenshot baselines for major public routes
- Pixel/Chromium and iPhone/WebKit wallet connect, reconnect, route persistence, and network switching

Playwright baselines:

- [tests/e2e/smoke.spec.ts-snapshots](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/tests/e2e/smoke.spec.ts-snapshots)

## Deployment to Vercel

### Recommended deployment model

Deploy through Git integration with GitHub.

### Initial setup

1. Push the repo to GitHub.
2. In Vercel, choose **Add New Project**.
3. Import the GitHub repository.
4. Let Vercel detect **Next.js** automatically.
5. In **Project Settings → General**, set the Node.js version to `22.x`.
6. Add the required environment variables.
7. Deploy.

### Required Vercel environment variables

Set these in Vercel Project Settings:

- `NEXT_PUBLIC_NFT_ADDRESS`
- `NEXT_PUBLIC_MARKET_ADDRESS`
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `RPC_URL`
- `NFT_API_BASE_URL`
- `MEDIA_BASE_URL`
- `ALLOW_INSECURE_NFT_API`

Optional:

- `MOCK_APP_DATA`

Production should normally leave `MOCK_APP_DATA` unset or set it to `0`.

### Recommended Vercel settings

- Framework preset: `Next.js`
- Node.js version: `22.x`
- Install command: `pnpm install`
- Build command: `pnpm build`

### Important note on Node version precedence

Keep Vercel Project Settings aligned with the version pinned in source control.

This repo already pins Node in:

- `package.json` `engines`
- `package.json` `volta`
- `.nvmrc`
- `.node-version`

Do not let Vercel drift to a different major version than local development and CI.

### CLI deployment option

If you want to deploy from the terminal instead of Git import:

```bash
pnpm dlx vercel
```

Then for a production deployment:

```bash
pnpm dlx vercel --prod
```

## CI/CD

GitHub Actions is configured in:

- [ci.yml](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/.github/workflows/ci.yml)

The pipeline runs:

1. install
2. Playwright browser install
3. lint
4. typecheck
5. Vitest
6. Playwright
7. production build

## Operational Notes

- Public data-heavy routes are server-rendered on demand where appropriate.
- Wallet-only experiences are isolated behind client-only provider islands.
- The build has been validated locally with lint, typecheck, tests, E2E, and production build.

## Additional Documentation

- [docs/architecture.md](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/docs/architecture.md)
- [docs/testing.md](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/docs/testing.md)
- [docs/deployment.md](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/docs/deployment.md)

## Known Constraints

- The current local desktop environment may still be on Node 23, which will produce warnings because this repo targets Node 22 for stable development and deployment.
- The upstream NFT API currently requires explicit handling for its TLS issue through `ALLOW_INSECURE_NFT_API`.
