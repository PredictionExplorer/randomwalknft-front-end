import Link from "next/link";

import { Separator } from "@/components/ui/separator";

const nftContract = "0x895a6F444BE4ba9d124F61DF736605792B35D66b";
const marketContract = "0x47eF85Dfb775aCE0934fBa9EEd09D22e6eC0Cc08";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/6 bg-black/25">
      <div className="text-muted mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 text-sm sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="font-display text-foreground tracking-[0.18em] uppercase">
              Random Walk NFT
            </p>
            <p>
              Generative art, minting, and fee-free market activity on Arbitrum.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 tracking-[0.18em] uppercase">
            <Link href="/faq">FAQ</Link>
            <Link href="/code">Generation Code</Link>
            <Link href="/marketplace">Marketplace</Link>
            <a
              href={`https://arbiscan.io/address/${nftContract}`}
              rel="noreferrer"
              target="_blank"
            >
              NFT Contract
            </a>
            <a
              href={`https://arbiscan.io/address/${marketContract}`}
              rel="noreferrer"
              target="_blank"
            >
              Market Contract
            </a>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <p>Built for a complete Next.js, TypeScript, and modern EVM stack.</p>
          <p className="tracking-[0.16em] uppercase">
            Vercel-ready. Test-heavy. Typed end to end.
          </p>
        </div>
      </div>
    </footer>
  );
}
