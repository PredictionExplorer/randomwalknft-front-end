import "server-only";

import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { URL } from "node:url";

import { z } from "zod";

import { getServerEnv, isMockMode } from "@/lib/env";
import {
  mockGiveawayEntries,
  mockRandomSelection,
  mockResultStats,
} from "@/lib/mock-data";
import type { GiveawayEntry, RandomSelection, ResultStats } from "@/types";

const resultStatsSchema = z.object({
  finished_count: z.number(),
  running_count: z.number(),
});

const giveawayEntrySchema = z.object({
  id: z.number(),
  owner: z.string(),
  seed: z.string(),
});

const randomSelectionSchema = z.array(z.number());

function requestJson<T>(
  path: string,
  init?: {
    body?: unknown;
    method?: "GET" | "POST";
  },
) {
  const env = getServerEnv();
  const url = new URL(path, env.apiBaseUrl);
  const body = init?.body ? JSON.stringify(init.body) : undefined;

  return new Promise<T>((resolve, reject) => {
    const request = (url.protocol === "https:" ? httpsRequest : httpRequest)(
      url,
      {
        agent: url.protocol === "https:" ? undefined : undefined,
        headers: {
          "Content-Type": "application/json",
        },
        method: init?.method ?? "GET",
        rejectUnauthorized: !env.allowInsecureNftApi,
      } as never,
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => {
          try {
            const payload = Buffer.concat(chunks).toString("utf8");
            resolve(payload ? (JSON.parse(payload) as T) : ({} as T));
          } catch (error) {
            reject(error);
          }
        });
      },
    );

    request.on("error", reject);

    if (body) {
      request.write(body);
    }

    request.end();
  });
}

export async function getResultStats(): Promise<ResultStats> {
  if (isMockMode()) {
    return mockResultStats;
  }

  const data = await requestJson("/result");
  const parsed = resultStatsSchema.parse(data);

  return {
    finishedCount: parsed.finished_count,
    runningCount: parsed.running_count,
  };
}

export async function getGiveawayEntries(): Promise<GiveawayEntry[]> {
  if (isMockMode()) {
    return mockGiveawayEntries.map((entry) => ({
      ...entry,
      owner: entry.owner as GiveawayEntry["owner"],
    }));
  }

  const data = await requestJson("/giveaway");
  return z
    .array(giveawayEntrySchema)
    .parse(data)
    .map((entry) => ({
      ...entry,
      owner: entry.owner as GiveawayEntry["owner"],
    }));
}

export async function getRandomSelection(): Promise<RandomSelection> {
  if (isMockMode()) {
    return mockRandomSelection;
  }

  const data = await requestJson("/random");

  return {
    ids: randomSelectionSchema.parse(data),
  };
}

export async function triggerTokenMediaGeneration(tokenId: number) {
  if (isMockMode()) {
    return { ok: true };
  }

  await requestJson("/tokens", {
    body: {
      token_id: tokenId,
    },
    method: "POST",
  });

  return { ok: true };
}
