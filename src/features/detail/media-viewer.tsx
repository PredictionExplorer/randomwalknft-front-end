"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTokenId } from "@/lib/format";
import { getMediaUrlFromHash, parseMediaHash } from "@/lib/media";
import type { MediaHash, TokenDetail } from "@/types";

const themeTabs = [
  { label: "Black", value: "black" },
  { label: "White", value: "white" },
] as const;

const modeTabs = [
  { hash: "#black_image", label: "Image", mode: "image" },
  { hash: "#black_single_video", label: "Single Video", mode: "single_video" },
  { hash: "#black_triple_video", label: "Triple Video", mode: "triple_video" },
] as const;

export function MediaViewer({ token }: { token: TokenDetail }) {
  const initialHash =
    typeof window === "undefined" ? null : parseMediaHash(window.location.hash);
  const [theme, setTheme] = useState<"black" | "white">(
    initialHash?.includes("white") ? "white" : "black",
  );
  const [mode, setMode] = useState<"image" | "single_video" | "triple_video">(
    initialHash?.includes("triple")
      ? "triple_video"
      : initialHash?.includes("single")
        ? "single_video"
        : "image",
  );

  const activeHash = useMemo(() => {
    const prefix = `#${theme}_`;
    if (mode === "single_video") {
      return `${prefix}single_video` as MediaHash;
    }
    if (mode === "triple_video") {
      return `${prefix}triple_video` as MediaHash;
    }

    return `${prefix}image` as MediaHash;
  }, [mode, theme]);

  useEffect(() => {
    window.history.replaceState(null, "", activeHash);
  }, [activeHash]);

  const activeMedia = getMediaUrlFromHash(token.media, activeHash);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Badge variant="accent">{formatTokenId(token.id)}</Badge>
          <h1 className="font-display text-4xl tracking-[0.16em] uppercase sm:text-5xl">
            {token.name || formatTokenId(token.id)}
          </h1>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Tabs
            onValueChange={(value) => setTheme(value as "black" | "white")}
            value={theme}
          >
            <TabsList>
              {themeTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Tabs
            onValueChange={(value) =>
              setMode(value as "image" | "single_video" | "triple_video")
            }
            value={mode}
          >
            <TabsList>
              {modeTabs.map((tab) => (
                <TabsTrigger key={tab.mode} value={tab.mode}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button
            className="border-border relative block aspect-square w-full overflow-hidden rounded-[2rem] border bg-black"
            type="button"
          >
            {mode === "image" ? (
              <Image
                alt={token.name}
                className="object-contain"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 55vw"
                src={activeMedia}
              />
            ) : (
              <video
                autoPlay
                className="size-full object-contain"
                controls={false}
                muted
                playsInline
              >
                <source src={activeMedia} type="video/mp4" />
              </video>
            )}
          </button>
        </DialogTrigger>
        <DialogContent className="w-[min(95vw,72rem)] p-4">
          <DialogHeader>
            <DialogTitle>{token.name}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-square w-full overflow-hidden rounded-[1.5rem] bg-black">
            {mode === "image" ? (
              <Image
                alt={token.name}
                className="object-contain"
                fill
                sizes="90vw"
                src={activeMedia}
              />
            ) : (
              <video
                autoPlay
                className="size-full object-contain"
                controls
                muted
                playsInline
              >
                <source src={activeMedia} type="video/mp4" />
              </video>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="ghost">
          <a href={activeMedia} rel="noreferrer" target="_blank">
            Open asset
          </a>
        </Button>
        <Button asChild variant="ghost">
          <a
            href={`https://arbiscan.io/token/${token.id}`}
            rel="noreferrer"
            target="_blank"
          >
            On explorer
          </a>
        </Button>
      </div>
    </div>
  );
}
