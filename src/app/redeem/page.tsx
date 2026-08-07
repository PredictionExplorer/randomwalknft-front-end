"use client";

import dynamic from "next/dynamic";

const RedeemView = dynamic(
  () =>
    import("@/features/redeem/redeem-view").then((module) => module.RedeemView),
  { ssr: false },
);

export default function RedeemPage() {
  return <RedeemView />;
}
