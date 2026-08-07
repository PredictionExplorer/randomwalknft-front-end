"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { MediaViewer } from "./media-viewer";
import { detailQueryOptions } from "./queries";
import { TokenActionPanel } from "./token-action-panel";

export function DetailViewClient({ tokenId }: { tokenId: number }) {
  const { data } = useSuspenseQuery(detailQueryOptions(tokenId));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {data.token.previousTokenId !== null ? (
          <Button asChild variant="ghost">
            <Link href={`/detail/${data.token.previousTokenId}`}>
              Previous token
            </Link>
          </Button>
        ) : null}
        {data.token.nextTokenId !== null ? (
          <Button asChild variant="ghost">
            <Link href={`/detail/${data.token.nextTokenId}`}>Next token</Link>
          </Button>
        ) : null}
      </div>
      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <MediaViewer token={data.token} />
        <TokenActionPanel snapshot={data} />
      </div>
    </div>
  );
}
