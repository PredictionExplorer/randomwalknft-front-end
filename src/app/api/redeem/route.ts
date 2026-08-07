import { NextResponse } from "next/server";

import { getRedeemState } from "@/lib/contracts/nft";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getRedeemState());
}
