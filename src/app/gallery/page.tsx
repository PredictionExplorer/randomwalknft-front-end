import { type Address, isAddress } from "viem";

import { GalleryView } from "@/features/gallery/gallery-view";
import { clamp, parsePositiveInt } from "@/lib/utils";
import type { GallerySort, GalleryView as GalleryViewMode } from "@/types";

export const dynamic = "force-dynamic";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePositiveInt(
    Array.isArray(params.page) ? params.page[0] : params.page,
    1,
  );
  const pageSize = clamp(
    parsePositiveInt(
      Array.isArray(params.pageSize) ? params.pageSize[0] : params.pageSize,
      24,
    ),
    12,
    48,
  );
  const sortValue = Array.isArray(params.sort) ? params.sort[0] : params.sort;
  const viewValue = Array.isArray(params.view) ? params.view[0] : params.view;
  const addressValue = Array.isArray(params.address)
    ? params.address[0]
    : params.address;

  return (
    <GalleryView
      address={
        addressValue && isAddress(addressValue)
          ? (addressValue as Address)
          : null
      }
      page={page}
      pageSize={pageSize}
      sort={(sortValue === "earliest" ? "earliest" : "latest") as GallerySort}
      view={
        (viewValue === "spotlight" ? "spotlight" : "grid") as GalleryViewMode
      }
    />
  );
}
