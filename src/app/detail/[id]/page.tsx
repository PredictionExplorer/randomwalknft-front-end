import type { Metadata } from "next";

import { DetailView } from "@/features/detail/detail-view";
import { getTokenDetail } from "@/lib/contracts/nft";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tokenId = Number.parseInt(id, 10);
  const token = Number.isNaN(tokenId) ? null : await getTokenDetail(tokenId);

  if (!token) {
    return {
      title: "Token Not Found",
    };
  }

  return {
    description: `Explore ${token.name} with live media variants, market activity, and wallet actions.`,
    openGraph: {
      images: [token.media.blackImage],
      title: token.name,
    },
    title: token.name,
  };
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tokenId = Number.parseInt(id, 10);

  return <DetailView tokenId={tokenId} />;
}
