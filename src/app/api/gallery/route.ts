import { NextResponse } from "next/server";
import { type Address, isAddress } from "viem";

import { getGalleryPage } from "@/lib/contracts/nft";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawAddress = searchParams.get("address");
  const rawPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const rawPageSize = Number.parseInt(searchParams.get("pageSize") ?? "24", 10);
  const sort = searchParams.get("sort") === "earliest" ? "earliest" : "latest";
  const view = searchParams.get("view") === "spotlight" ? "spotlight" : "grid";

  const data = await getGalleryPage({
    ownerAddress:
      rawAddress && isAddress(rawAddress) ? (rawAddress as Address) : null,
    page: Number.isNaN(rawPage) ? 1 : rawPage,
    pageSize: Number.isNaN(rawPageSize) ? 24 : rawPageSize,
    sort,
    view,
  });

  return NextResponse.json(data);
}
