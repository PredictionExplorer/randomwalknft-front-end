"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { WalletConnect } from "@/components/layout/wallet-connect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/mint", label: "Mint" },
  { href: "/gallery", label: "Gallery" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/redeem", label: "Redeem" },
  { href: "/faq", label: "FAQ" },
  { href: "/code", label: "Code" },
  { href: "/random", label: "Random" },
  { href: "/random-video", label: "Random Video" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-canvas/65 fixed inset-x-0 top-0 z-40 border-b border-white/6 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            aria-hidden="true"
            className="h-10 w-auto"
            src="/brand/logo.svg"
          />
          <span className="font-display text-muted hidden text-sm tracking-[0.28em] uppercase sm:inline">
            Random Walk NFT
          </span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              className={cn(
                "text-muted hover:text-foreground text-xs tracking-[0.18em] uppercase transition",
                pathname === item.href ? "text-highlight" : undefined,
              )}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <WalletConnect />
          <div className="lg:hidden">
            <Dialog onOpenChange={setOpen} open={open}>
              <DialogTrigger asChild>
                <Button aria-label="Open navigation" variant="ghost">
                  {open ? (
                    <X className="size-4" />
                  ) : (
                    <Menu className="size-4" />
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="top-24 right-4 left-auto w-[min(92vw,22rem)] translate-x-0 translate-y-0 p-0">
                <div className="flex flex-col gap-2 p-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      className={cn(
                        "text-muted hover:text-foreground rounded-2xl px-4 py-3 text-sm tracking-[0.18em] uppercase transition hover:bg-white/5",
                        pathname === item.href
                          ? "bg-accent-soft text-highlight"
                          : undefined,
                      )}
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    className="text-muted hover:text-foreground rounded-2xl px-4 py-3 text-sm tracking-[0.18em] uppercase transition hover:bg-white/5"
                    href="/my-nfts"
                    onClick={() => setOpen(false)}
                  >
                    My NFTs
                  </Link>
                  <Link
                    className="text-muted hover:text-foreground rounded-2xl px-4 py-3 text-sm tracking-[0.18em] uppercase transition hover:bg-white/5"
                    href="/my-offers"
                    onClick={() => setOpen(false)}
                  >
                    My Offers
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
}
