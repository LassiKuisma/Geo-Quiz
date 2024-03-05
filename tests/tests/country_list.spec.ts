import { expect, test } from '@playwright/test';
import { clearDatabase, insertCountryData } from '../util/db';

test.describe('country list', () => {
  test.beforeAll(async () => {
    await clearDatabase();
    await insertCountryData();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/countries');
  });

  test('countries are displayed in a list', async ({ page }) => {
    const table = page.locator('table#country-table');
    await expect(table).toBeVisible();

    const rows = table.locator('tbody tr');
    const count = await rows.count();

    const expectedCountries = new Set([
      'Finland',
      'Sweden',
      'Norway',
      'Switzerland',
      'Egypt',
      'China',
      'India',
      'Brazil',
      'New Zealand',
    ]);

    expect(count).toBe(expectedCountries.size);

    const firstColumn = rows.locator('td:first-child');
    const countryNames = new Set(await firstColumn.allTextContents());
    expect(countryNames).toEqual(expectedCountries);
  });
});
