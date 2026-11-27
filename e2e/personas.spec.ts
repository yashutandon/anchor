import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PERSONAS = [
  {
    id: "novice",
    heading: /Guided Triage Layout/i,
    badge: "Guided Mode",
  },
  {
    id: "senior",
    heading: /High-Throughput Triage Layout/i,
    badge: "Power Triage",
  },
  {
    id: "manager",
    heading: /SLA & Capacity Overview/i,
    badge: "Operations Overview",
  },
] as const;

test.describe("Anchor persona dashboards", () => {
  test("root redirects to /novice", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/novice$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Guided Triage Layout/i }),
    ).toBeVisible();
  });

  for (const persona of PERSONAS) {
    test(`/${persona.id} renders without axe violations`, async ({ page }) => {
      await page.goto(`/${persona.id}`);

      await expect(
        page.getByRole("heading", { level: 1, name: persona.heading }),
      ).toBeVisible();
      await expect(page.getByText(persona.badge)).toBeVisible();

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test("persona switcher navigates across all personas", async ({ page }) => {
    await page.goto("/novice");

    await page.getByRole("link", { name: "Senior Specialist" }).click();
    await expect(page).toHaveURL(/\/senior$/);

    await page.getByRole("link", { name: "Support Manager" }).click();
    await expect(page).toHaveURL(/\/manager$/);
  });
});
