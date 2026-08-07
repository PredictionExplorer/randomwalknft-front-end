import "server-only";

import { cache } from "react";
import { createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";

import { getServerEnv } from "@/lib/env";

export const getPublicClient = cache(() => {
  const env = getServerEnv();

  return createPublicClient({
    chain: arbitrum,
    transport: http(env.rpcUrl),
  });
});
