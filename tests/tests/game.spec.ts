import { expect, test } from '@playwright/test';
import {
  clearDatabase,
  clearGames,
  createGameWithKnownOutcome,
  insertCountryData,
} from '../util/db';

test.describe('creating a game', () => {
  test('making a move in newly created game', async ({ page }) => {
    await clearDatabase();
    await insertCountryData();
    await page.goto('/');

    await page.getByRole('button', { name: 'New game (easy)' }).click();
    await page.getByLabel('Country').click();
    await page.getByRole('option', { name: 'Norway' }).click();
    await page.getByRole('button', { name: 'Guess' }).click();

    const locator = page.locator(
      'table#moves-table tbody tr:first-child td:first-child'
    );

    await expect(locator).toHaveText('Norway');
  });
});

test.describe('playing the game', () => {
  test.beforeAll(async () => {
    await clearDatabase();
    await insertCountryData();
  });

  test.beforeEach(async ({ page }) => {
    await clearGames();

    // to create a game with known outcome we have to create it with sql command
    await createGameWithKnownOutcome();

    // and then set the id into local storage
    await page.goto('/');
    await page.evaluate(
      "window.localStorage.setItem('geo-quiz-active-game', 1)"
    );
    await page.goto('/game');
  });

  test('guessing a country in the same region but different subregion', async ({
    page,
  }) => {
    await page.getByLabel('Country').click();
    await page.getByRole('option', { name: 'Switzerland' }).click();
    await page.getByRole('button', { name: 'Guess' }).click();

    const cellLocator = page.locator(
      'table#moves-table tbody tr:first-child td:nth-child(2)'
    );
    const iconLocator = cellLocator.locator('div svg');

    const idCorrect = 'CheckIcon';
    const idWrong = 'CloseIcon';

    const regionIcon = iconLocator.nth(0);
    const subregionIcon = iconLocator.nth(1);

    await expect(regionIcon).toHaveAttribute('data-testid', idCorrect);
    await expect(subregionIcon).toHaveAttribute('data-testid', idWrong);
  });

  test('guessing the correct answer', async ({ page }) => {
    await page.getByLabel('Country').click();
    await page.getByRole('option', { name: 'Finland' }).click();
    await page.getByRole('button', { name: 'Guess' }).click();

    const winText = page.getByRole('heading', { name: 'You got it!' });
    await expect(winText).toBeVisible();
  });
});
