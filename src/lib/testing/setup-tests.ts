import "@testing-library/jest-dom/vitest";

import React from "react";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { fill, priority, ...rest } =
      props as React.ImgHTMLAttributes<HTMLImageElement> & {
        fill?: boolean;
        priority?: boolean;
      };
    return React.createElement("img", {
      ...rest,
      alt: props.alt ?? "",
      "data-fill": fill ? "true" : undefined,
      "data-priority": priority ? "true" : undefined,
    });
  },
}));
