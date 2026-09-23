import { test, expect } from "@playwright/test";

test.describe("Reloopin Merchant Onboarding Prototype", () => {
  test("full onboarding journey: welcome -> store -> points -> tiers -> branding -> review -> activation -> success -> dashboard tour", async ({
    page,
  }) => {
    test.setTimeout(60000);

    // 1. Welcome Screen
    await page.goto("/onboarding");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await expect(page.locator("h1")).toContainText("Set up your loyalty program");
    await expect(page.getByText("Takes about 5-10 minutes")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Connect your store" })).toBeVisible();
    await expect(page.getByText("Create an earning rule")).toBeVisible();
    await expect(page.getByText("Set up VIP tiers")).toBeVisible();
    await expect(page.getByText("Match your brand")).toBeVisible();

    // Click Start setup
    await page.getByRole("button", { name: "Start setup" }).click();

    // 2. Step 1: Connect Store
    await expect(page.locator("h1")).toContainText("Connect your store");
    await expect(page.getByText("WooCommerce", { exact: true })).toBeVisible();
    await expect(page.getByText("Shopify", { exact: true })).toBeVisible();

    // Fill store URL and click Connect store
    const storeInput = page.locator("#store-url");
    await expect(storeInput).toHaveValue("https://northstargoods.com");
    await page.getByRole("button", { name: "Connect store", exact: true }).click();

    // Progress through Connecting -> Waiting for approval
    await expect(
      page.getByText("Approve the connection in WooCommerce")
    ).toBeVisible({ timeout: 6000 });

    // Click "I've approved access"
    await page.getByRole("button", { name: "I've approved access" }).click();

    // Progress through Verifying -> Connected
    await expect(
      page.getByText("Northstar Goods is connected successfully")
    ).toBeVisible({ timeout: 6000 });

    // Click Start syncing
    await page.getByRole("button", { name: "Start syncing" }).click();

    // Wait for Sync complete
    await expect(page.getByText("Your store is ready")).toBeVisible({ timeout: 6000 });
    await expect(page.getByText("2,486").first()).toBeVisible();

    // Continue to Step 2: Earning Rule
    await page.getByRole("button", { name: "Continue to earning rule" }).first().click();

    // 3. Step 2: Earning Rule
    await expect(page.locator("h1")).toContainText("Choose how customers earn points");
    await expect(page.getByLabel("Rule name")).toHaveValue("Points for purchases");

    // Verify live preview card shows default 50 points
    await expect(page.getByText("50 points")).toBeVisible();

    // Change points earned to 2
    const pointsInput = page.locator("input[type='number']").first();
    await pointsInput.fill("2");

    // Live preview updates immediately to 100 points
    await expect(page.getByText("100 points")).toBeVisible();

    // Save earning rule
    await page.getByRole("button", { name: "Save earning rule" }).click();
    await expect(page.getByText("Earning rule saved")).toBeVisible();

    // Continue to VIP tiers
    await page.getByRole("button", { name: "Continue to VIP tiers" }).first().click();

    // 4. Step 3: VIP Tiers
    await expect(page.locator("h1")).toContainText("Set up your VIP tiers");
    await expect(page.getByRole("heading", { name: "Silver" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Gold" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Platinum" })).toBeVisible();

    // Add a new Diamond tier
    await page.getByRole("button", { name: "Add tier" }).click();
    await expect(page.getByText("Add VIP Tier")).toBeVisible();

    await page.locator("input[placeholder='e.g. Diamond']").fill("Diamond");
    await page.locator("input[placeholder='e.g. 5000']").fill("5000");
    await page.getByRole("button", { name: "Add tier" }).last().click();

    // Verify Diamond tier is added
    await expect(page.getByRole("heading", { name: "Diamond" })).toBeVisible();
    await expect(page.getByText("5,000 pts")).toBeVisible();

    // Save VIP tiers
    await page.getByRole("button", { name: "Save VIP tiers" }).click();
    await expect(page.getByText("VIP tiers saved")).toBeVisible();

    // Continue to Branding
    await page.getByRole("button", { name: "Continue to branding" }).first().click();

    // 5. Step 4: Branding
    await expect(page.locator("h1")).toContainText("Match your brand");
    await expect(page.getByText("Primary brand color")).toBeVisible();
    await expect(page.getByText("Northstar Goods Storefront")).toBeVisible();

    // Toggle preview modes
    await page.getByRole("button", { name: "Launcher" }).click();
    await expect(page.getByText("floating widget launcher stays anchored")).toBeVisible();

    await page.getByRole("button", { name: "Open widget" }).click();
    await expect(page.getByText("Northstar Goods Rewards")).toBeVisible();

    // Toggle customer modes
    await page.getByRole("button", { name: "Guest" }).click();
    await expect(page.getByText("Join Northstar Goods Rewards")).toBeVisible();

    await page.getByRole("button", { name: "Member" }).click();
    await expect(page.getByText("Maya Chen")).toBeVisible();

    // Click Save branding
    await page.getByRole("button", { name: "Save branding" }).click();
    await expect(page.getByText("Branding saved")).toBeVisible();

    // Continue to Review setup
    await page.getByRole("button", { name: "Review setup" }).first().click();

    // 6. Review Setup
    await expect(page.locator("h1")).toContainText("Review your loyalty program");
    await expect(page.getByText("Connected Store")).toBeVisible();
    await expect(page.getByText("Purchase Earning Rule")).toBeVisible();
    await expect(page.getByText("VIP Milestones")).toBeVisible();
    await expect(page.getByText("Store Widget Branding")).toBeVisible();

    // Trigger Activation
    await page.getByRole("button", { name: "Activate loyalty program" }).first().click();
    await expect(page.getByText("Activate your loyalty program?")).toBeVisible();

    // Confirm Activation
    await page.getByRole("button", { name: "Activate program" }).click();

    // Activating animation sequence
    await expect(page.getByText("Activating your loyalty program")).toBeVisible();

    // 7. Success Screen
    await expect(page.locator("h1")).toContainText("Your loyalty program is live", {
      timeout: 8000,
    });
    await expect(page.getByText("Completed launch milestones")).toBeVisible();

    // Preview customer widget
    await page.getByRole("button", { name: "Preview customer experience" }).click();
    await expect(page.getByText("Storefront Customer Widget")).toBeVisible();
    await page.getByRole("button", { name: "Close preview" }).click();

    // Go to dashboard
    await page.getByRole("button", { name: "Go to dashboard" }).click();

    // 8. Dashboard Transition with Guided Tour
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText("Dashboard Tour")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Program Performance")).toBeVisible();

    // Progress through tour
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.getByText("Points & Earning Rules")).toBeVisible();

    // Skip/finish tour
    await page.getByRole("button", { name: "Skip tour" }).click();
    await expect(page.getByText("Dashboard Tour")).not.toBeVisible();
  });

  test("resume onboarding screen displays for returning merchants", async ({
    page,
  }) => {
    // Seed localStorage via addInitScript before loading
    await page.addInitScript(() => {
      try {
        localStorage.setItem(
          "reloopin_onboarding_v1",
          JSON.stringify({
            currentStep: "vip-tiers",
            completedSteps: ["connect-store", "points-rule"],
            onboardingCompleted: false,
          })
        );
      } catch {
        // ignore
      }
    });

    await page.goto("/onboarding");
    await expect(
      page.getByText("Continue setting up your loyalty program")
    ).toBeVisible();
    await expect(page.getByText("You completed 2 of 4 steps")).toBeVisible();
    await expect(page.getByText("Store connected and data synced")).toBeVisible();
    await expect(page.getByText("Purchase earning rule configured")).toBeVisible();

    // Click Continue setup -> should land on next incomplete step (vip-tiers)
    await page.getByRole("button", { name: "Continue setup" }).click();
    await expect(page.locator("h1")).toContainText("Set up your VIP tiers");
  });

  test("preview states tool allows instant switching across states", async ({
    page,
  }) => {
    await page.goto("/onboarding?step=connect-store");

    // Open Preview states panel
    await page.getByRole("button", { name: "Preview states" }).click();
    await expect(page.getByText("Onboarding states")).toBeVisible();

    // Select Partial sync warning
    await page.getByRole("button", { name: "Partial sync warning" }).click();
    await expect(page).toHaveURL(/.*state=partial_sync/);
    await expect(page.getByText("Some store data could not be synced")).toBeVisible();

    // Open Preview states panel again and choose Invalid hex color
    await page.getByRole("button", { name: "Preview states" }).click();
    await page.getByRole("button", { name: "Invalid hex color" }).click();
    await expect(page).toHaveURL(/.*step=branding&state=invalid_color/);
    await expect(page.getByText("Enter a valid hex color.")).toBeVisible();
  });

  test("save and exit dialog navigates to dashboard with persistent callout", async ({
    page,
  }) => {
    await page.goto("/onboarding?step=points-rule");

    // Click Save & exit in header
    await page.getByRole("button", { name: "Save & exit" }).click();
    await expect(page.getByText("Leave setup for now?")).toBeVisible();

    // Confirm exit
    await page.getByRole("button", { name: "Save and exit" }).last().click();

    // Land on dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
