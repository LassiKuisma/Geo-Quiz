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

  test('sorting by area', async ({ page }) => {
    await page.getByRole('button', { name: 'Area' }).click();

    // in our test data China is the biggest and Switzerland smallest by area

    const topRowLocator = page.locator(
      'table#country-table tbody tr:first-child td:first-child'
    );
    await expect(topRowLocator).toHaveText('China');

    const bottomRowLocator = page.locator(
      'table#country-table tbody tr:last-child td:first-child'
    );
    await expect(bottomRowLocator).toHaveText('Switzerland');
  });

  test('filtering by region', async ({ page }) => {
    await page.getByRole('button', { name: 'Filters' }).click();
    await page.getByLabel('Open').click();
    await page
      .getByRole('option', { name: 'Northern Europe' })
      .getByRole('checkbox')
      .check();

    const countryCellsLocator = page.locator(
      'table#country-table tbody tr td:first-child'
    );

    const expected = ['Finland', 'Norway', 'Sweden'];
    await expect(countryCellsLocator).toHaveText(expected);
  });

  test('filtering by name', async ({ page }) => {
    await page.getByRole('button', { name: 'Filters' }).click();
    await page.getByLabel('Filter by name').fill('new zealand');

    const countryCellsLocator = page.locator(
      'table#country-table tbody tr td:first-child'
    );

    const expected = ['New Zealand'];
    await expect(countryCellsLocator).toHaveText(expected);
  });
});
