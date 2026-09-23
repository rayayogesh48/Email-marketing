import { test, expect } from "@playwright/test";

test("merchant dashboard operational metrics, reconciliation, sheets, and states", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  // 1. Visit /dashboard
  await page.goto("http://localhost:3000/dashboard");

  // Verify Heading & Subtitle
  await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
  await expect(page.getByText("See how your loyalty program is performing.")).toBeVisible();

  // Verify Program Summary
  await expect(page.getByText("Your loyalty program is growing")).toBeVisible();
  await expect(page.getByText(/Active members increased by 12\.4%/)).toBeVisible();

  // Verify Action Required section
  await expect(page.getByText(/items? need your attention/)).toBeVisible();

  // 2. Verify 4 Primary KPI cards & Values
  await expect(page.getByText("Active members", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("1,842").first()).toBeVisible();

  await expect(page.getByText("Points outstanding", { exact: true })).toBeVisible();
  await expect(page.getByText("384,920").first()).toBeVisible();

  await expect(page.getByText("Redemption rate", { exact: true })).toBeVisible();
  await expect(page.getByText("49.7%").first()).toBeVisible();

  await expect(page.getByText("Repeat purchase lift", { exact: true })).toBeVisible();
  await expect(page.getByText("+11.8 pts").first()).toBeVisible();

  // 3. Drill-down Sheet: Active Members
  await page.getByText("Active members", { exact: true }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByText("New members")).toBeVisible();
  await expect(page.getByRole("dialog").getByText("248")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();

  // 4. Points Activity Chart & Table Toggle
  await expect(page.getByRole("heading", { name: "Points activity" })).toBeVisible();
  await page.getByRole("button", { name: "View as table" }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await page.getByRole("button", { name: "View as chart" }).click();

  // 5. Estimated Program Value Card
  await expect(page.getByRole("heading", { name: "Estimated program value" })).toBeVisible();
  await expect(page.getByText("3.3x").first()).toBeVisible();
  await expect(page.getByText("+$39,600")).toBeVisible();
  await expect(page.getByText("-$12,000")).toBeVisible();
  await expect(page.getByText("+$27,600")).toBeVisible();

  // Click "How this is calculated" methodology sheet
  await page.getByRole("button", { name: "How this is calculated" }).first().click();
  await expect(page.getByRole("heading", { name: "How Program ROI is calculated" })).toBeVisible();
  await page.getByRole("button", { name: "Close methodology" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();

  // 6. VIP Tier Overview & Tier Detail Sheet
  await expect(page.getByRole("heading", { name: "VIP tier overview" })).toBeVisible();
  await expect(page.getByText("96 customers upgraded this month")).toBeVisible();
  await page.getByRole("button", { name: /Gold tier:/ }).click();
  await expect(page.getByRole("dialog").getByText("Gold Tier Details")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();

  // 7. Popular Rewards & Reward Detail Sheet
  await expect(page.getByRole("heading", { name: "Most redeemed rewards" })).toBeVisible();
  await page.getByRole("button", { name: /15% off next order/ }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "15% off next order" })).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();

  // 8. Recent Loyalty Activity & Event Detail Sheet
  await expect(page.getByRole("heading", { name: "Recent loyalty activity" })).toBeVisible();
  await page.getByText("Maya Chen").first().click();
  await expect(page.getByRole("dialog").getByText("Maya Chen").first()).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();

  // 9. Quick Actions
  await expect(page.getByRole("heading", { name: "Quick actions" })).toBeVisible();
  await expect(page.getByText("Create earning rule")).toBeVisible();
  await expect(page.getByText("Create reward")).toBeVisible();

  // 10. Date Range Selector updates URL
  await page.getByLabel("Select date range").selectOption("90d");
  await expect(page).toHaveURL(/range=90d/);

  // 11. Prototype State Switcher: First Run
  await page.getByLabel("Select prototype state").selectOption("first_run");
  await expect(page.getByText("Your loyalty program is live")).toBeVisible();
  await expect(page.getByText("4 of 4 completed")).toBeVisible();

  // 12. Prototype State Switcher: Store Disconnected
  await page.getByLabel("Select prototype state").selectOption("disconnected");
  await expect(page.getByText("Reconnect your store to update the dashboard")).toBeVisible();

  // 13. Back to Default
  await page.getByLabel("Select prototype state").selectOption("default");
  await expect(page.getByText("1,842").first()).toBeVisible();

  // 14. Store Switcher: Urban Goods
  await page.getByLabel("Select store").selectOption("urban-goods");
  await expect(page.getByText("964").first()).toBeVisible();
  await expect(page.getByText("2.8x").first()).toBeVisible();

  expect(errors).toEqual([]);
});
