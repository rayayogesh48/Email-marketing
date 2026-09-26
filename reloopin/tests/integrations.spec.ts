import { test, expect } from "@playwright/test";

test.describe("Reloopin Integrations Module", () => {
  test.beforeEach(async ({ page }) => {
    // Reset localStorage before test
    await page.goto("http://localhost:3000/integrations");
    await page.evaluate(() => {
      localStorage.removeItem("reloopin_integrations_v1");
    });
    await page.reload();
  });

  test("integrations list page metrics, category filtering, search, and view toggle", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("http://localhost:3000/integrations");

    // 1. Verify Header & Subtitle
    await expect(page.getByRole("heading", { name: "Integrations", exact: true })).toBeVisible();
    await expect(
      page.getByText("Connect stores and channels to keep customer, order, and loyalty data in sync."),
    ).toBeVisible();

    // 2. Verify Stats Cards
    await expect(page.getByText("Connected", { exact: true })).toBeVisible();
    await expect(page.getByText("Active", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Needs attention", { exact: true })).toBeVisible();
    await expect(page.getByText("Paused", { exact: true })).toBeVisible();

    // 3. Verify Table Rows
    await expect(page.getByRole("link", { name: "Northstar Shopify Store" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Urban Goods WooCommerce" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Northstar Google Reviews" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Northstar Instagram" })).toBeVisible();

    // 4. Verify Category Filtering
    // Click "Stores" category tab
    await page.getByRole("tab", { name: "Stores" }).click();
    await expect(page.getByRole("link", { name: "Northstar Shopify Store" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Urban Goods WooCommerce" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Northstar Google Reviews" })).toBeHidden();

    // Click "Reviews" category tab
    await page.getByRole("tab", { name: "Reviews" }).click();
    await expect(page.getByRole("link", { name: "Northstar Google Reviews" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Northstar Shopify Store" })).toBeHidden();

    // Return to "All"
    await page.getByRole("tab", { name: "All" }).click();
    await expect(page.getByRole("link", { name: "Northstar Shopify Store" })).toBeVisible();

    // 5. Test Search
    const searchInput = page.getByPlaceholder("Search integrations");
    await searchInput.fill("Shopify");
    await expect(page.getByRole("link", { name: "Northstar Shopify Store" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Urban Goods WooCommerce" })).toBeHidden();
    await expect(page.getByRole("link", { name: "Northstar Google Reviews" })).toBeHidden();

    // Clear search
    await page.getByRole("button", { name: "Clear search query" }).click();
    await expect(page.getByRole("link", { name: "Urban Goods WooCommerce" })).toBeVisible();

    // 6. Test View Toggle: Grid vs Table
    await page.getByRole("button", { name: "Grid view" }).click();
    await expect(page.getByTestId("integrations-grid")).toBeVisible();
    await expect(page.getByRole("link", { name: "Northstar Shopify Store" })).toBeVisible();

    // Switch back to Table view
    await page.getByRole("button", { name: "Table view" }).click();
    await expect(page.getByRole("table")).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test("add integration 3-step wizard with test connection simulation and review", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    // 1. Visit /integrations/new
    await page.goto("http://localhost:3000/integrations/new");

    // Verify Step 1: Choose platform
    await expect(page.getByRole("heading", { name: "Choose platform" })).toBeVisible();
    await expect(page.getByText("Shopify", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("WooCommerce", { exact: true }).first()).toBeVisible();

    // Click Shopify platform card
    await page.getByTestId("platform-card-shopify").click();

    // Verify Step 2: Connect Shopify form
    await expect(page.getByRole("heading", { name: "Connect Shopify" })).toBeVisible();
    await expect(page.getByLabel("Shopify store URL")).toBeVisible();
    await page.getByLabel("Integration name").fill("Downtown Shopify Store");
    await page.getByLabel("Shopify store URL").fill("downtown-goods.myshopify.com");

    // Click Test Connection
    await page.getByTestId("test-connection-button").click();

    // Verify Connection Test Modal
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/Testing connection|Connection successful/)).toBeVisible();

    // Wait for connection test to complete and click Continue to review
    const continueBtn = page.getByTestId("continue-to-review-button");
    await expect(continueBtn).toBeVisible({ timeout: 10000 });
    await continueBtn.click();

    // Verify Step 3: Review integration
    await expect(page.getByRole("heading", { name: "Review integration" })).toBeVisible();
    await expect(page.getByText("Store workspace").first()).toBeVisible();

    // Click "Add integration"
    await page.getByTestId("add-integration-final-button").click();

    // Verify Adding Progress & Success state
    await expect(page.getByText("Integration connected", { exact: false })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Initial sync status")).toBeVisible();

    // Click "View integration"
    await page.getByTestId("view-integration-button").click();

    // Should arrive at detail page
    await expect(page.getByRole("heading", { name: "Downtown Shopify Store" })).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test("integration detail page 4 tabs, sync now, and credential rotate", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    // 1. Visit Northstar Shopify detail page
    await page.goto("http://localhost:3000/integrations/shopify-northstar");

    await expect(page.getByRole("heading", { name: "Northstar Shopify Store" })).toBeVisible();
    await expect(page.getByTestId("integration-overview-tab")).toBeVisible();

    // Verify Capabilities
    await expect(page.getByText("Data access capabilities")).toBeVisible();
    await expect(page.getByText("Read customer profiles")).toBeVisible();

    // 2. Click "Data sync" tab
    await page.getByTestId("detail-tab-sync").click();
    await expect(page.getByTestId("integration-sync-tab")).toBeVisible();
    await expect(page.getByText("Data Type Breakdown")).toBeVisible();

    // Click "Sync now" button
    await page.getByTestId("detail-sync-now-button").click();
    await expect(page.getByText("Syncing...")).toBeVisible();

    // 3. Click "Credentials" tab
    await page.getByTestId("detail-tab-credentials").click();
    await expect(page.getByTestId("integration-credentials-tab")).toBeVisible();
    await expect(page.getByText("Encrypted credential vault")).toBeVisible();
    await expect(page.getByText("Merchant client key")).toBeVisible();

    // Click "Rotate credentials"
    await page.getByRole("button", { name: "Rotate credentials" }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Rotate credentials?")).toBeVisible();
    await page.getByRole("button", { name: "Rotate credentials" }).last().click();

    // 4. Click "Activity" tab
    await page.getByTestId("detail-tab-activity").click();
    await expect(page.getByTestId("integration-activity-tab")).toBeVisible();
    await expect(page.getByText("Audit Activity Timeline")).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test("pause, resume, and typed-name removal of store workspace", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("http://localhost:3000/integrations");

    // 1. Pause Northstar Shopify Store
    const row = page.getByTestId("integration-row-shopify-northstar");
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: /More actions/ }).click();
    await page.getByText("Pause", { exact: true }).click();

    // Confirm pause in dialog
    await expect(page.getByText("Pause this integration?")).toBeVisible();
    await page.getByTestId("confirm-pause-button").click();

    // Verify status became Paused
    await expect(row.getByText("Paused")).toBeVisible();

    // 2. Resume it
    await row.getByRole("button", { name: "Resume" }).click();
    await expect(row.getByText("Active")).toBeVisible();

    // 3. Remove store integration: requires typing the exact name
    await row.getByRole("button", { name: /More actions/ }).click();
    await page.getByText("Remove integration").click();

    // Dialog should ask to type "Northstar Shopify Store"
    await expect(page.getByText("Remove Northstar Shopify Store?")).toBeVisible();
    const removeBtn = page.getByTestId("confirm-remove-button");
    await expect(removeBtn).toBeDisabled();

    // Type name
    await page.getByTestId("remove-confirm-input").fill("Northstar Shopify Store");
    await expect(removeBtn).toBeEnabled();
    await removeBtn.click();

    // Store should be removed from the table
    await expect(page.getByRole("link", { name: "Northstar Shopify Store" })).toBeHidden();

    expect(errors).toHaveLength(0);
  });

  test("sidebar store switcher shows only store workspaces, never social channels", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("http://localhost:3000/integrations");

    // Click Store Switcher in sidebar
    await page.getByLabel("Switch store").click();

    const menuContent = page.locator(".menu-content");
    // Should show store workspaces: Northstar Goods, Urban Goods
    await expect(menuContent.getByText("Northstar Goods · Shopify (Connected)")).toBeVisible();
    await expect(menuContent.getByText("Urban Goods · WooCommerce (Needs attention)")).toBeVisible();

    // Should NEVER show social or review channels in the store switcher!
    await expect(menuContent.getByText("Google Reviews")).toBeHidden();
    await expect(menuContent.getByText("Instagram")).toBeHidden();

    expect(errors).toHaveLength(0);
  });

  test("preview states drawer switches states and updates url query", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("http://localhost:3000/integrations");

    // Click floating preview states button
    await page.getByTestId("preview-states-button").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Integration states")).toBeVisible();

    // Select "Empty state"
    await page.getByText("Empty state", { exact: true }).click();
    await expect(page).toHaveURL(/state=empty/);
    await expect(page.getByText("Connect your first platform")).toBeVisible();

    // Reopen and Reset Demo
    await page.getByTestId("preview-states-button").click();
    await page.getByRole("button", { name: "Reset demo" }).click();

    // All default integrations restored
    await expect(page.getByRole("link", { name: "Northstar Shopify Store" })).toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
