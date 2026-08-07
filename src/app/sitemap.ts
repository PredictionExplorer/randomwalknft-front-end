import type { MetadataRoute } from "next";

const routes = [
  "",
  "/mint",
  "/gallery",
  "/marketplace",
  "/redeem",
  "/faq",
  "/code",
  "/random",
  "/random-video",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    changeFrequency: "weekly",
    lastModified: new Date(),
    priority: route === "" ? 1 : 0.7,
    url: `https://randomwalknft.com${route}`,
  }));
}
