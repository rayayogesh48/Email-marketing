import { test, expect } from "@playwright/test";

test.describe("Reloopin Account & Team Settings Module", () => {
  test.beforeEach(async ({ page }) => {
    // Reset localStorage before each test
    await page.goto("http://127.0.0.1:3000/settings/account");
    await page.evaluate(() => {
      localStorage.removeItem("reloopin_settings_v1");
    });
    await page.reload();
  });

  test("settings navigation and route redirection", async ({ page }) => {
    // Navigate to /settings and check redirect to /settings/account
    await page.goto("http://127.0.0.1:3000/settings");
    await expect(page).toHaveURL(/.*\/settings\/account/);

    // Verify main header and subtitle
    await expect(page.getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
    await expect(
      page.getByText("Manage your account, store information, team access, and notifications."),
    ).toBeVisible();

    // Verify secondary navigation links
    await expect(page.getByRole("link", { name: /My account/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Store profile/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Branding/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Team/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Notifications/i })).toBeVisible();

    // Navigate to Store profile
    await page.getByRole("link", { name: /Store profile/i }).click();
    await expect(page).toHaveURL(/.*\/settings\/store/);
    await expect(page.getByRole("heading", { name: "Store profile", exact: true })).toBeVisible();

    // Navigate to Branding
    await page.getByRole("link", { name: /Branding/i }).click();
    await expect(page).toHaveURL(/.*\/settings\/branding/);
    await expect(page.getByRole("heading", { name: "Branding", exact: true })).toBeVisible();

    // Navigate to Team
    await page.getByRole("link", { name: /Team/i }).click();
    await expect(page).toHaveURL(/.*\/settings\/team/);
    await expect(page.getByRole("heading", { name: "Team members", exact: true })).toBeVisible();

    // Navigate to Notifications
    await page.getByRole("link", { name: /Notifications/i }).click();
    await expect(page).toHaveURL(/.*\/settings\/notifications/);
    await expect(page.getByRole("heading", { name: "Notifications", exact: true })).toBeVisible();
  });

  test("account profile: form editing, dirty state bar, email change verification, and password modal", async ({
    page,
  }) => {
    await page.goto("http://127.0.0.1:3000/settings/account");

    // Check user info prefilled
    const firstNameInput = page.getByLabel("First name");
    await expect(firstNameInput).toHaveValue("Olivia");
    const lastNameInput = page.getByLabel("Last name");
    await expect(lastNameInput).toHaveValue("Morgan");

    // Modify first name to make form dirty
    await firstNameInput.fill("Olivia Renamed");

    // Verify sticky action bar appears
    await expect(page.getByText("Unsaved changes")).toBeVisible();
    const saveButton = page.getByRole("button", { name: "Save changes" });
    await expect(saveButton).toBeVisible();

    // Click Save changes
    await saveButton.click();
    await expect(page.getByText("Account updated")).toBeVisible();
    await expect(page.getByText("Unsaved changes")).toBeHidden();

    // Change Password Modal flow
    await page.getByRole("button", { name: "Change password" }).click();
    await expect(page.getByRole("heading", { name: "Change password" })).toBeVisible();

    // Fill current and new password
    await page.getByLabel("Current password").fill("CurrentSecret123!");
    await page.getByLabel("New password", { exact: true }).fill("Weak1");
    // Verify strength meter shows
    await expect(page.getByText(/Password strength:/i)).toBeVisible();

    // Fill strong password and confirmation
    await page.getByLabel("New password", { exact: true }).fill("Str0ng!Pass#2026");
    await page.getByLabel("Confirm new password").fill("Str0ng!Pass#2026");
    await page.getByRole("button", { name: "Update password" }).click();
    await expect(page.getByText("Password updated successfully")).toBeVisible();

    // Email change verification flow
    const emailInput = page.getByLabel("Email address");
    await emailInput.fill("olivia.new@northstargoods.com");
    await expect(page.getByText("Unsaved changes")).toBeVisible();
    await page.getByRole("button", { name: "Save changes" }).click();

    // Verify pending email banner appears
    await expect(page.getByText("Verify your new email address")).toBeVisible();
    await expect(page.getByText("olivia.new@northstargoods.com")).toBeVisible();

    // Click demo verify button
    await page.getByRole("button", { name: "Demo verify" }).click();
    await expect(page.getByText("Email verified successfully")).toBeVisible();
    await expect(page.getByText("Verify your new email address")).toBeHidden();
  });

  test("store profile: address fields, synced Shopify info, and unsaved changes modal on store switch", async ({
    page,
  }) => {
    await page.goto("http://127.0.0.1:3000/settings/store");

    // Check store name and synced fields
    const storeNameInput = page.getByLabel("Store name");
    await expect(storeNameInput).toHaveValue("Northstar Goods");

    // Check Synced currency and timezone
    await expect(page.getByText("USD ($)")).toBeVisible();
    await expect(page.getByText("Synced from Shopify")).toBeVisible();

    // Edit store name
    await storeNameInput.fill("Northstar Superstore");
    await expect(page.getByText("Unsaved changes")).toBeVisible();

    // Attempt to switch store from header store switcher while dirty
    await page.getByRole("button", { name: /Northstar Goods/i }).first().click();
    await page.getByRole("button", { name: /Urban Goods/i }).click();

    // Verify unsaved changes confirmation modal appears
    await expect(page.getByRole("heading", { name: "Switch stores without saving?" })).toBeVisible();
    await expect(
      page.getByText("Your unsaved changes for Northstar Goods will be lost."),
    ).toBeVisible();

    // Click Discard and switch
    await page.getByRole("button", { name: "Discard and switch" }).click();
    await expect(page.getByRole("heading", { name: "Switch stores without saving?" })).toBeHidden();

    // Active store is now Urban Goods
    await expect(page.getByLabel("Store name")).toHaveValue("Urban Goods");
    await expect(page.getByText("Synced from WooCommerce")).toBeVisible();
  });

  test("branding: presets, hex picker, contrast warning, and interactive preview tabs", async ({
    page,
  }) => {
    await page.goto("http://127.0.0.1:3000/settings/branding");

    // Check header & sender name
    await expect(page.getByRole("heading", { name: "Branding", exact: true })).toBeVisible();
    const senderInput = page.getByLabel("Email sender name");
    await expect(senderInput).toHaveValue("Northstar Goods");

    // Check WCAG contrast indicator is visible
    await expect(page.getByText("WCAG Contrast")).toBeVisible();

    // Select low contrast preset or type low contrast color
    const hexInput = page.getByPlaceholder("#000000");
    await hexInput.fill("#FDE047"); // bright yellow (fails on white)

    // Contrast warning should appear
    await expect(page.getByText(/Low contrast warning/i)).toBeVisible();

    // Select preset color "Royal Blue"
    await page.getByTitle("Royal Blue (#2563EB)").click();
    await expect(page.getByText(/Low contrast warning/i)).toBeHidden();

    // Check interactive preview tabs
    await expect(page.getByRole("button", { name: /Rewards widget/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Email notification/i })).toBeVisible();

    // Switch to Email preview tab
    await page.getByRole("button", { name: /Email notification/i }).click();
    await expect(page.getByText("Rewards update from Northstar Goods")).toBeVisible();

    // Switch back to Widget tab
    await page.getByRole("button", { name: /Rewards widget/i }).click();
    await expect(page.getByText("VIP Tier Progress")).toBeVisible();

    // Reset branding dialog flow
    await page.getByRole("button", { name: "Reset to default" }).click();
    await expect(page.getByRole("heading", { name: "Reset branding to default?" })).toBeVisible();
    await page.getByRole("button", { name: "Reset branding" }).click();
    await expect(page.getByText("Branding reset to defaults")).toBeVisible();
  });

  test("team management: seat indicator, invite member, role comparison sheet, and ownership transfer", async ({
    page,
  }) => {
    await page.goto("http://127.0.0.1:3000/settings/team");

    // 1. Seat limit indicator
    await expect(page.getByText("Seat usage")).toBeVisible();
    await expect(page.getByText(/3 of 5 seats used/i)).toBeVisible();

    // 2. Existing members in table
    await expect(page.getByText("Olivia Morgan")).toBeVisible();
    await expect(page.getByText("Ava Carter")).toBeVisible();
    await expect(page.getByText("Daniel Kim")).toBeVisible();

    // 3. Open Role comparison sheet
    await page.getByRole("button", { name: "Compare role permissions" }).click();
    await expect(page.getByRole("heading", { name: "Team roles & permissions" })).toBeVisible();
    await expect(page.getByText("Manage store profile & billing")).toBeVisible();
    // Close comparison sheet
    await page.getByRole("button", { name: "Close" }).click();

    // 4. Invite member flow
    await page.getByRole("button", { name: "Invite team member" }).click();
    await expect(page.getByRole("heading", { name: "Invite team member" })).toBeVisible();

    // Fill invite details
    await page.getByPlaceholder("colleague@example.com").fill("newteam@northstargoods.com");
    await page.getByRole("button", { name: "Staff" }).click();
    await page.getByRole("button", { name: "Send invitation" }).click();

    // Invitation success modal
    await expect(page.getByRole("heading", { name: "Invitation sent!" })).toBeVisible();
    await expect(page.getByText("newteam@northstargoods.com")).toBeVisible();
    await page.getByRole("button", { name: "Done" }).click();

    // Seat count should increase to 4
    await expect(page.getByText(/4 of 5 seats used/i)).toBeVisible();

    // 5. Transfer ownership modal
    await page.getByRole("button", { name: "Transfer ownership" }).click();
    await expect(page.getByRole("heading", { name: "Transfer store ownership" })).toBeVisible();

    // Select Ava Carter
    await page.getByRole("button", { name: /Ava Carter/i }).click();

    // Verify step 2 warning and TRANSFER requirement
    await expect(
      page.getByText(/Type TRANSFER to confirm ownership transfer/i),
    ).toBeVisible();

    const transferInput = page.getByPlaceholder("TRANSFER");
    const confirmTransferBtn = page.getByRole("button", { name: "Transfer ownership" });
    await expect(confirmTransferBtn).toBeDisabled();

    await transferInput.fill("TRANSFER");
    await expect(confirmTransferBtn).toBeEnabled();

    // Cancel transfer
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("heading", { name: "Transfer store ownership" })).toBeHidden();
  });

  test("operational notifications: channels, group toggles, and critical alerts lock", async ({
    page,
  }) => {
    await page.goto("http://127.0.0.1:3000/settings/notifications");

    // Header and info banner
    await expect(page.getByRole("heading", { name: "Notifications", exact: true })).toBeVisible();
    await expect(page.getByText("These settings are for you")).toBeVisible();

    // Delivery channel master defaults
    await expect(page.getByText("Delivery channel defaults")).toBeVisible();

    // Verify critical alert rows cannot be toggled / has lock badge
    await expect(page.getByText("Security alerts").first()).toBeVisible();
    await expect(page.getByText("Always required").first()).toBeVisible();

    // Toggle an optional notification
    const referralToggle = page.getByRole("switch", { name: /Referral activity email/i });
    if (await referralToggle.isVisible()) {
      await referralToggle.click();
      await expect(page.getByText("Unsaved changes")).toBeVisible();
      await page.getByRole("button", { name: "Save changes" }).click();
      await expect(page.getByText("Notification preferences saved")).toBeVisible();
    }
  });

  test("invitation acceptance page (/invite/[token])", async ({ page }) => {
    // Valid invitation token
    await page.goto("http://127.0.0.1:3000/invite/tok_test_member");

    await expect(page.getByRole("heading", { name: /Join Northstar Goods/i })).toBeVisible();
    await expect(page.getByText("You have been invited to join the team on Reloopin.")).toBeVisible();

    // Fill name & password
    await page.getByPlaceholder("e.g. Jordan Lee").fill("Jordan Lee");
    await page.getByPlaceholder("At least 8 characters").fill("StrongPass!2026");
    await page.getByRole("button", { name: "Accept invitation & join" }).click();

    // Success screen
    await expect(page.getByRole("heading", { name: /You’ve joined Northstar Goods/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Go to dashboard" })).toBeVisible();

    // Expired invitation token
    await page.goto("http://127.0.0.1:3000/invite/tok_expired_123");
    await expect(page.getByRole("heading", { name: "Invitation expired" })).toBeVisible();
    await expect(page.getByText(/This invitation has expired or has already been used/i)).toBeVisible();
  });

  test("preview states drawer controls all prototype variants", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/settings/account");

    // Click floating Preview states button
    const previewStatesBtn = page.getByRole("button", { name: "Preview states" });
    await expect(previewStatesBtn).toBeVisible();
    await previewStatesBtn.click();

    // Drawer opens
    await expect(page.getByRole("heading", { name: "Preview states" })).toBeVisible();
    await expect(page.getByText("Global states")).toBeVisible();
    await expect(page.getByText("Account states")).toBeVisible();
    await expect(page.getByText("Store states")).toBeVisible();
    await expect(page.getByText("Branding states")).toBeVisible();
    await expect(page.getByText("Team states")).toBeVisible();
    await expect(page.getByText("Notification states")).toBeVisible();

    // Select Read-only access state
    await page.getByRole("button", { name: /Read-only access/i }).click();

    // Verify Read-only banner is displayed on page
    await expect(
      page.getByText(/You have view-only access. Changes to settings are disabled./i),
    ).toBeVisible();

    // Reset back to default via drawer
    await previewStatesBtn.click();
    await page.getByRole("button", { name: "Reset demo" }).click();
    await expect(
      page.getByText(/You have view-only access. Changes to settings are disabled./i),
    ).toBeHidden();
  });
});
