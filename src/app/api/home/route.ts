import { NextResponse } from "next/server";

import { getResultStats } from "@/lib/api/nft-service";
import { getMarketplacePage } from "@/lib/contracts/market";
import { getHomeStats } from "@/lib/contracts/nft";

export const runtime = "nodejs";

export async function GET() {
  const [stats, resultStats, marketplace] = await Promise.all([
    getHomeStats(),
    getResultStats(),
    getMarketplacePage(1, 100),
  ]);

  return NextResponse.json({
    ...stats,
    activeSellOffers: marketplace.totalItems,
    finishedCount: resultStats.finishedCount,
    runningCount: resultStats.runningCount,
  });
}
