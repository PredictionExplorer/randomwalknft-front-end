import { getDefaultMediaBaseUrl } from "@/lib/env";
import type { MediaHash, TokenMedia } from "@/types";

export function getTokenStem(tokenId: number) {
  return tokenId.toString().padStart(6, "0");
}

export function buildTokenMedia(
  tokenId: number,
  mediaBaseUrl = getDefaultMediaBaseUrl(),
): TokenMedia {
  const baseUrl = mediaBaseUrl.replace(/\/$/, "");
  const stem = getTokenStem(tokenId);

  return {
    blackImage: `${baseUrl}/${stem}_black.png`,
    blackImageThumb: `${baseUrl}/${stem}_black_thumb.jpg`,
    blackSingleVideo: `${baseUrl}/${stem}_black_single.mp4`,
    blackTripleVideo: `${baseUrl}/${stem}_black_triple.mp4`,
    whiteImage: `${baseUrl}/${stem}_white.png`,
    whiteImageThumb: `${baseUrl}/${stem}_white_thumb.jpg`,
    whiteSingleVideo: `${baseUrl}/${stem}_white_single.mp4`,
    whiteTripleVideo: `${baseUrl}/${stem}_white_triple.mp4`,
  };
}

const knownHashes = new Set<MediaHash>([
  "#black_image",
  "#white_image",
  "#black_single_video",
  "#white_single_video",
  "#black_triple_video",
  "#white_triple_video",
]);

export function parseMediaHash(hash: string): MediaHash | null {
  return knownHashes.has(hash as MediaHash) ? (hash as MediaHash) : null;
}

export function getMediaUrlFromHash(media: TokenMedia, hash: MediaHash) {
  switch (hash) {
    case "#black_image":
      return media.blackImage;
    case "#white_image":
      return media.whiteImage;
    case "#black_single_video":
      return media.blackSingleVideo;
    case "#white_single_video":
      return media.whiteSingleVideo;
    case "#black_triple_video":
      return media.blackTripleVideo;
    case "#white_triple_video":
      return media.whiteTripleVideo;
  }
}
