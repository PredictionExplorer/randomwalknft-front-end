import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockTokens } from "@/lib/mock-data";
import { renderWithQueryClient } from "@/lib/testing/render";

import { TokenCard } from "./token-card";

describe("TokenCard", () => {
  it("renders token title and id", () => {
    renderWithQueryClient(<TokenCard token={mockTokens[0]} />);

    expect(screen.getByText(mockTokens[0].name)).toBeInTheDocument();
    expect(screen.getByText("#001088")).toBeInTheDocument();
  });

  it("supports the priority image path", () => {
    renderWithQueryClient(<TokenCard priority token={mockTokens[1]} />);

    expect(
      screen.getByRole("img", { name: mockTokens[1].name }),
    ).toBeInTheDocument();
  });
});
