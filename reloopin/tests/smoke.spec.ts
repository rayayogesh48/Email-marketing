import { test, expect } from "@playwright/test";
test("templates, editing, persistence, campaign and store isolation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3000");
  await expect(
    page.getByRole("heading", { name: "Email templates", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Edit template", exact: true }),
  ).toHaveCount(8);
  await page.screenshot({ path: "artifacts/desktop.png", fullPage: true });
  await page
    .getByRole("button", { name: "Edit template", exact: true })
    .first()
    .click();
  await page
    .getByLabel("Heading", { exact: true })
    .fill("Welcome to your next chapter.");
  await expect(page.locator(".email-content h2")).toHaveText(
    "Welcome to your next chapter.",
  );
  await page
    .getByRole("button", { name: "Save template", exact: true })
    .click();
  await page.reload();
  await page
    .getByRole("button", { name: "Edit template", exact: true })
    .first()
    .click();
  await expect(page.getByLabel("Heading", { exact: true })).toHaveValue(
    "Welcome to your next chapter.",
  );
  await page
    .getByRole("button", { name: "Send test email", exact: true })
    .click();
  await page.getByRole("button", { name: "Send test", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Test send simulated" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page
    .getByRole("button", { name: "Back to templates", exact: true })
    .click();
  await page.getByRole("button", { name: "Campaigns", exact: true }).click();
  await page
    .getByRole("button", { name: "Create campaign", exact: true })
    .click();
  await page.getByLabel("Campaign name").fill("Playwright autumn campaign");
  await expect(page.locator(".stepper")).toHaveCount(0);
  await page.getByLabel("Send to", { exact: true }).selectOption("tiers");
  await page.getByLabel("Gold", { exact: true }).check();
  await page
    .getByRole("spinbutton", { name: "Minimum points balance" })
    .fill("500");
  await expect(
    page.locator(".campaign-compose .recipient-summary"),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Edit template", exact: true })
    .click();
  await expect(page).toHaveURL(/\/campaigns\/[^/]+\/email$/);
  await page.getByLabel("Subject line").fill("A special hello");
  await page
    .getByRole("button", { name: "Save & return to campaign", exact: true })
    .click();
  await expect(page.getByLabel("Gold", { exact: true })).toBeChecked();
  await expect(
    page.getByRole("spinbutton", { name: "Minimum points balance" }),
  ).toHaveValue("500");
  await expect(page.locator(".inbox-header")).toContainText("A special hello");
  await page
    .getByRole("button", { name: "Send campaign", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Simulate send", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: /^Playwright autumn campaign/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Switch store" }).click();
  await page
    .getByRole("menuitem", { name: "Willow & Co. · WooCommerce" })
    .click();
  await page.getByRole("button", { name: "Campaigns", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /^Playwright autumn campaign/ }),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("responsive library has no horizontal overflow", async ({ page }) => {
  for (const width of [800, 390]) {
    await page.setViewportSize({ width, height: 1024 });
    await page.goto("http://localhost:3000");
    await expect(
      page.getByRole("heading", { name: "Email templates", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({ path: `artifacts/${width}.png`, fullPage: true });
  }
});

test("automation review, activation and pause", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Automations", exact: false })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Create automation", exact: true })
    .click();
  await page.getByLabel("Automation name").fill("A thoughtful welcome");
  await expect(page.locator(".stepper")).toHaveCount(0);
  await expect(
    page.locator(".campaign-compose .recipient-summary"),
  ).toHaveCount(0);
  await page
    .getByLabel("When to send", { exact: true })
    .selectOption("After a delay");
  await page.getByLabel("Delay", { exact: true }).fill("2");
  await page
    .getByRole("button", { name: "Edit template", exact: true })
    .click();
  await expect(page).toHaveURL(/\/automations\/[^/]+\/email$/);
  await page
    .getByLabel("Heading", { exact: true })
    .fill("A thoughtful welcome, just for you.");
  await page
    .getByRole("button", { name: "Save & return to automation", exact: true })
    .click();
  await expect(page.getByLabel("Delay", { exact: true })).toHaveValue("2");
  await expect(page.locator(".email-content h2")).toHaveText(
    "A thoughtful welcome, just for you.",
  );
  await page
    .getByRole("button", { name: "Activate automation", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Activate automation", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "A thoughtful welcome Customer signup",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Actions for A thoughtful welcome",
      exact: true,
    })
    .click();
  await page
    .getByRole("menuitem", { name: "Pause automation", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Pause automation", exact: true })
    .click();
  const row = page.locator("tr").filter({ hasText: "A thoughtful welcome" });
  await expect(row.getByText("Paused", { exact: true })).toBeVisible();
});

test("HTML editor, safe conversion and unsaved navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Edit template", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "HTML editor", exact: true }).click();
  await expect(page.locator(".cm-editor")).toBeVisible();
  await expect(
    page.getByTitle("Sandboxed custom email preview"),
  ).toHaveAttribute("sandbox", "");
  await page.getByRole("button", { name: "Text editor", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Return to the text editor?" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Restore text version", exact: true })
    .click();
  await expect(page.getByLabel("Heading", { exact: true })).toHaveValue(
    "A warm welcome to the club.",
  );
  await page.getByLabel("Subject line").fill("{{not_supported}}");
  await page
    .getByRole("button", { name: "Save template", exact: true })
    .click();
  await expect(page.locator(".alert[role=alert]")).toContainText(
    "This variable isn’t supported",
  );
  await page
    .getByRole("button", { name: "Back to templates", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Leave with unsaved changes?" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Discard changes", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Email templates", exact: true }),
  ).toBeVisible();
});

test("sender failure recovery, branding, schedule validation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page
    .getByLabel("Email host", { exact: true })
    .fill("fail.provider.example");
  await page
    .getByRole("button", { name: "Test email configuration", exact: true })
    .click();
  await expect(page.locator(".alert[role=alert]")).toContainText(
    "simulated provider couldn’t connect",
  );
  await page.getByLabel("Email host", { exact: true }).fill("smtp.example.com");
  await page
    .getByRole("button", { name: "Test email configuration", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Save changes", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page
    .getByRole("button", { name: "Customize email branding", exact: true })
    .click();
  await page.getByLabel("Sender & store name").fill("Northstar Studio");
  await page
    .getByRole("button", { name: "Save branding", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Update branding", exact: true })
    .click();
  await page.getByRole("button", { name: "Campaigns", exact: true }).click();
  await page
    .getByRole("button", { name: "Create campaign", exact: true })
    .click();
  await page.getByLabel("Campaign name").fill("Scheduled autumn note");
  await page
    .getByRole("radio", { name: "Schedule for later", exact: true })
    .check();
  await expect(
    page.getByRole("button", { name: "Schedule campaign", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Date & time").fill("2020-01-01T10:00");
  await expect(
    page.getByRole("button", { name: "Schedule campaign", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Date & time").fill("2030-10-06T10:00");
  await page
    .getByRole("button", { name: "Schedule campaign", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Schedule campaign", exact: true })
    .click();
  await expect(
    page
      .locator("tr")
      .filter({ hasText: "Scheduled autumn note" })
      .getByText("Scheduled", { exact: true }),
  ).toBeVisible();
});

test("conversation messaging, safety dismissal and mobile navigation", async ({
  page,
}) => {
  await page.goto("/conversation");
  await expect(
    page.getByRole("button", { name: "Conversation", exact: true }),
  ).toHaveClass(/nav-active/);
  await expect(page.getByText("Deal safely")).toBeVisible();

  const composer = page.getByLabel("Message", { exact: true });
  await composer.fill("Can you confirm the delivery charge?");
  await composer.press("Enter");
  await expect(
    page
      .getByLabel("Active conversation")
      .getByText("Can you confirm the delivery charge?", { exact: true }),
  ).toBeVisible();
  await expect(composer).toHaveValue("");

  await page.getByRole("button", { name: "Dismiss safety message" }).click();
  await page.reload();
  await expect(page.getByText("Deal safely")).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Conversations" }),
  ).toBeVisible();
  await expect(page.getByLabel("Active conversation")).toBeHidden();
  await page.getByRole("button", { name: /Kathmandu Electronics/ }).click();
  await expect(page.getByLabel("Active conversation")).toBeVisible();
  await page.getByRole("button", { name: "Back to conversations" }).click();
  await expect(
    page.getByRole("heading", { name: "Conversations" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});
