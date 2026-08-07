# Deployment

## Target

The repo is configured for Vercel plus GitHub Actions.

Vercel is the preferred deployment target because this project is a Next.js App Router application with:

- route handlers
- dynamic rendering
- metadata routes
- image optimization
- preview deployment workflows

Official references:

- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel project general settings](https://vercel.com/docs/project-configuration/general-settings)
- [Deploying from GitHub](https://vercel.com/docs/deployments/git/vercel-for-github)

## Node version

Use Node `22.x` on Vercel.

The repo also pins Node in source control:

- `[package.json](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/package.json)` via `engines`
- `[package.json](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/package.json)` via `volta`
- `[.nvmrc](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/.nvmrc)`
- `[.node-version](/Users/tarasbobrovytsky/Dev/randomwalknft-front-end/.node-version)`

Keep Vercel aligned with those pins.

## CI flow

GitHub Actions runs:

1. `pnpm install`
2. `pnpm exec playwright install --with-deps chromium`
3. `pnpm lint`
4. `pnpm typecheck`
5. `pnpm test`
6. `pnpm test:e2e`
7. `pnpm build`

## Vercel setup

### Git-based deployment

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Confirm framework detection as `Next.js`.
4. Set **Node.js Version** to `22.x` in Project Settings.
5. Add the environment variables listed below.
6. Deploy.

### CLI deployment

```bash
pnpm dlx vercel
pnpm dlx vercel --prod
```

## Required production env

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

## Operational notes

- The build is safe under mock mode, but production should use live chain/API configuration.
- `NEXT_PUBLIC_CHAIN_ID` must be `42161`; this deployment supports Arbitrum One only.
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` must be a real 32-character project ID from Reown Cloud. Add every production and preview origin to that project's allowlist.
- A production build fails when the WalletConnect project ID is missing or malformed. The all-zero value is reserved for deterministic tests and must not be deployed.
- Public data-heavy routes render dynamically on demand so deploys are not blocked by live RPC or API hiccups.
- If the NFT API certificate is fixed, set `ALLOW_INSECURE_NFT_API=0` and redeploy.
