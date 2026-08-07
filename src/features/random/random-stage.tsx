"use client";

import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatTokenId } from "@/lib/format";
import { buildTokenMedia } from "@/lib/media";

import { randomSelectionQueryOptions } from "./queries";

export function RandomStage({ mode }: { mode: "image" | "video" }) {
  const query = useQuery(randomSelectionQueryOptions());
  const tokenId = query.data?.ids[0] ?? 1088;
  const media = buildTokenMedia(tokenId);

  useEffect(() => {
    if (!query.data) {
      query.refetch();
    }
  }, [query]);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-muted text-xs tracking-[0.18em] uppercase">
            {mode === "image" ? "Random still" : "Random motion"}
          </p>
          <h1 className="font-display text-4xl tracking-[0.16em] uppercase">
            RANDOM {mode === "image" ? "FRAME" : "VIDEO"}
          </h1>
        </div>
        <Button onClick={() => query.refetch()} variant="ghost">
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>
      <Card className="overflow-hidden p-0">
        <div className="relative aspect-[16/9] bg-black">
          {mode === "image" ? (
            <Image
              alt={`Random token ${tokenId}`}
              className="object-contain"
              fill
              priority
              sizes="100vw"
              src={media.blackImage}
            />
          ) : (
            <video
              autoPlay
              className="size-full object-contain"
              controls={false}
              muted
              onEnded={() => query.refetch()}
              playsInline
            >
              <source src={media.blackSingleVideo} type="video/mp4" />
            </video>
          )}
          <div className="absolute bottom-4 left-4">
            <Button asChild>
              <Link href={`/detail/${tokenId}`}>{formatTokenId(tokenId)}</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
