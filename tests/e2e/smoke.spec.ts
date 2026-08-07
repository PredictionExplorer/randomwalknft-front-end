import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

async function expectVisualSnapshot(page: Page, name: string) {
  // Baselines are captured with the repository's local fonts on macOS.
  // Functional and accessibility assertions still run on Linux CI.
  if (process.platform !== "darwin") return;
  await expect(page).toHaveScreenshot(name);
}

test("home page renders and is accessible", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /random walk nft/i }),
  ).toBeVisible();
  await expectAccessible(page);
  await expectVisualSnapshot(page, "home.png");
});

test("gallery page renders collection controls", async ({ page }) => {
  await page.goto("/gallery");
  await expect(
    page.getByRole("heading", { name: /random walk gallery/i }),
  ).toBeVisible();
  await expect(
    page.getByPlaceholder(/filter by wallet address/i),
  ).toBeVisible();
  await expectVisualSnapshot(page, "gallery.png");
});

test("marketplace page renders live listings", async ({ page }) => {
  await page.goto("/marketplace");
  await expect(
    page.getByRole("heading", { name: /live marketplace/i }),
  ).toBeVisible();
  await expectVisualSnapshot(page, "marketplace.png");
});

test("detail page preserves hash-driven media state", async ({ page }) => {
  await page.goto("/detail/1088#black_image");
  await expect(
    page.getByRole("heading", { name: /random walk 1088/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /market activity/i }),
  ).toBeVisible();
  await expectVisualSnapshot(page, "detail.png");
});
