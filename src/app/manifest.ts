import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#050507",
    description: "Generative Random Walk NFTs on Arbitrum.",
    display: "standalone",
    icons: [
      {
        sizes: "any",
        src: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    name: "Random Walk NFT",
    short_name: "RandomWalk",
    start_url: "/",
    theme_color: "#050507",
  };
}
