import { test, expect } from '@playwright/test';

test('home loads and shows search input', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByPlaceholder('Search by name, type or #id')).toBeVisible();
});
