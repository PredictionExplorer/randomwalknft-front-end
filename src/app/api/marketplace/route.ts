import { NextResponse } from "next/server";

import { getMarketplacePage } from "@/lib/contracts/market";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const rawPageSize = Number.parseInt(searchParams.get("pageSize") ?? "24", 10);

  const data = await getMarketplacePage(
    Number.isNaN(rawPage) ? 1 : rawPage,
    Number.isNaN(rawPageSize) ? 24 : rawPageSize,
  );

  return NextResponse.json(data);
}
