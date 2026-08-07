"use client";

import dynamic from "next/dynamic";

const MintView = dynamic(
  () => import("@/features/mint/mint-view").then((module) => module.MintView),
  { ssr: false },
);

export default function MintPage() {
  return <MintView />;
}
