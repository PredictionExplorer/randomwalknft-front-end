# Architecture

## Overview

The frontend is organized around a clean split:

- `src/app`: routes, metadata routes, and API route handlers
- `src/features`: route-level and domain-specific UI/features
- `src/components`: reusable layout and primitive UI building blocks
- `src/lib`: env parsing, formatting, media URL generation, query helpers, API proxy logic, and contract adapters
- `src/providers`: app-wide query and wallet provider composition

## Data flow

1. Server routes and route handlers call typed contract/API modules in `src/lib`.
2. Public pages seed React Query data from the server.
3. Client components hydrate that data and refetch through internal `/api/*` endpoints when needed.
4. Wallet writes happen client-side with wagmi/viem and invalidate React Query keys after success.

## Wallet architecture

The application has one SSR-safe wagmi provider in `src/providers/app-providers.tsx`.
All wallet surfaces share that connection:

- header wallet connect button
- mint
- redeem
- my NFTs
- my offers
- detail page action panel

`src/lib/wallet/config.ts` uses wagmi 3 with explicit connectors:

- targeted injected MetaMask for the MetaMask in-app browser
- MetaMask Connect when no injected provider is available
- EIP-6963/browser wallets
- WalletConnect for Rainbow and other wallets
- Base Account
- Safe

The WalletConnect connector defers its setup until browser connection or
reconnection. This prevents its IndexedDB-backed provider from initializing
during Next.js server rendering.

Contract actions never switch chains and submit a transaction in one click.
Connect/network gates resolve first, writes start directly from a user action,
and multi-step operations such as marketplace approval plus listing require
separate confirmations.

## Decision log

- Chose Next.js App Router over a Vite SPA so public routes can remain server-rendered.
- Kept route slugs stable to preserve existing links and hashes.
- Used internal API routes for client refetches so browser code does not import server-only contract modules.
- Switched high-churn public data routes to dynamic server rendering to avoid build-time dependency on live chain/API availability.
- Chose a custom wallet dialog over a wallet UI framework so the application can use wagmi 3 and MetaMask Connect while retaining installed, WalletConnect, Base, and Safe options.
- Scoped Vitest coverage gates to core logic and exercised components; browser coverage lives in Playwright.
