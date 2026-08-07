import { NextResponse } from "next/server";
import { z } from "zod";

import { triggerTokenMediaGeneration } from "@/lib/api/nft-service";

const payloadSchema = z.object({
  tokenId: z.number().int().nonnegative(),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = payloadSchema.parse(await request.json());

  await triggerTokenMediaGeneration(payload.tokenId);

  return NextResponse.json({ ok: true });
}
