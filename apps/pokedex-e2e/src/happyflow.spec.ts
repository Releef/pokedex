import { test, expect, Page } from '@playwright/test';

// Happy flow: browse 5 Pokémon of different types, add to team, then remove all
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

test('happy flow: add 5 Pokémon of different types to team, then remove all', async ({ page }) => {
  await page.goto('/');

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
