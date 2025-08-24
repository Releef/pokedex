import { test, expect, Page } from '@playwright/test';

// Happy flow: exercise filtering and sorting, then add 5 Pokémon of different types to team, then remove all
// We pick well-known, distinct-type Pokémon to avoid ambiguity from multi-type filtering.
const picks = [
  { name: 'bulbasaur' }, // grass/poison
  { name: 'charmander' }, // fire
  { name: 'squirtle' }, // water
  { name: 'pikachu' }, // electric
  { name: 'gastly' }, // ghost/poison
];

async function addPokemonByName(page: Page, name: string) {
  // Use the search input on Home to filter list
  const search = page.getByPlaceholder('Search by name, type or #id');
  await search.fill(name);

  // Click the first matching list item by name
  const item = page.getByRole('button', { name: new RegExp(name, 'i') }).first();
  await item.waitFor({ state: 'visible' });
  await item.click();

  // Click Add to team in the details pane
  const addBtn = page.getByRole('button', { name: /Add to team/i });
  await addBtn.waitFor({ state: 'visible' });
  await addBtn.click();

  // After adding, the Remove button should appear (indicates success)
  await expect(page.getByRole('button', { name: /Remove from team/i })).toBeVisible();
}

async function getTeamListItems(page: Page) {
  // In Team view, items are buttons within mat-list (inside virtual scroll viewport)
  return page.locator('mat-sidenav app-pokemon-list mat-list button');
}

test('happy flow: filtering and sorting on Home, then add 5 Pokémon to team and remove all', async ({ page }) => {
  await page.goto('/');

  // Wait for the Home UI and list to be ready (robust across browsers)
  await page.getByRole('listbox', { name: /Filter by type/i }).waitFor({ state: 'visible' });
  const listItems = page.locator('mat-sidenav app-pokemon-list mat-list button');
  await expect.poll(async () => await listItems.count(), { timeout: 30000 }).toBeGreaterThan(0);
  await expect(listItems.first()).toBeVisible({ timeout: 30000 });

  // --- Sorting ---
  // Sort by Name ascending
  await page.getByRole('button', { name: 'Name', exact: true }).click();

  // Toggle sort direction and assert the icon flips (robust regardless of list content)
  const dirButton = page.locator('button:has(mat-icon:has-text("arrow_upward")), button:has(mat-icon:has-text("arrow_downward"))').first();
  const dirIcon = dirButton.locator('mat-icon');
  const dirBefore = (await dirIcon.textContent())?.trim();
  await dirButton.click();
  await expect(dirIcon).toHaveText(dirBefore === 'arrow_upward' ? 'arrow_downward' : 'arrow_upward');

  // --- Filtering ---
  const typeListbox = page.getByRole('listbox', { name: /Filter by type/i });
  await typeListbox.getByRole('option', { name: /^fire$/i }).click();
  // After filtering by fire, the first visible item should display 'fire' in its type line
  await expect(page.locator('mat-sidenav app-pokemon-list mat-list button').first()).toContainText(/fire/i);

  // Reset to All types
  await typeListbox.getByRole('option', { name: /^All types$/i }).click();

  // Clear any search before starting add flow
  await page.getByPlaceholder('Search by name, type or #id').fill('');

  // Add 5 Pokémon (different types) to the team from Home
  for (const p of picks) {
    await addPokemonByName(page, p.name);
  }

  // Navigate to Team view via the toolbar button (scope to top toolbar to avoid matching Add/Remove buttons)
  await page.locator('mat-toolbar').getByRole('button', { name: 'Team', exact: true }).click();

  // Expect 5 team members visible in the list
  const teamItems = await getTeamListItems(page);
  await expect(teamItems).toHaveCount(5);

  // Remove all 5 members one by one
  for (let remaining = 5; remaining > 0; remaining--) {
    const items = await getTeamListItems(page);
    await items.first().click();

    const removeBtn = page.getByRole('button', { name: /Remove from team/i });
    await removeBtn.waitFor({ state: 'visible' });
    await removeBtn.click();

    // Expect the list count to decrease
    await expect(await getTeamListItems(page)).toHaveCount(remaining - 1);
  }

  // Final assertion: no team members left
  await expect(await getTeamListItems(page)).toHaveCount(0);
});
