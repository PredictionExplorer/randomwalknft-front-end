import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithQueryClient } from "@/lib/testing/render";

import { FaqList } from "./faq-list";

describe("FaqList", () => {
  it("renders the FAQ heading and common questions", () => {
    renderWithQueryClient(<FaqList />);

    expect(
      screen.getByRole("heading", {
        name: /product faq/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/How do I mint Random Walk NFTs/i),
    ).toBeInTheDocument();
  });
});
