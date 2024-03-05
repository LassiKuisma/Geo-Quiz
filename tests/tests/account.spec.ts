import { expect, test } from '@playwright/test';
import { clearDatabase } from '../util/db';

test.describe('accounts', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase();
    await page.goto('/');
  });

  test('creating an account', async ({ page }) => {
    await page.getByRole('link', { name: 'Create account' }).click();
    await page.getByLabel('Username').fill('myname');
    await page.getByLabel('Password', { exact: true }).fill('mypassword');
    await page.getByRole('button', { name: 'Create account' }).click();

    const loggedInText = page.getByText('Logged in as myname');
    await expect(loggedInText).toBeVisible();
  });

  test('trying to create account with too short username', async ({ page }) => {
    await page.getByRole('link', { name: 'Create account' }).click();
    await page.getByLabel('Username').fill('a');
    await page.getByLabel('Password', { exact: true }).fill('mypassword');
    await page.getByRole('button', { name: 'Create account' }).click();

    const errorText = page
      .getByRole('alert')
      .getByText('Username must be at least 3 characters');
    await expect(errorText).toBeVisible();
  });

  test('logging in with right credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'Create account' }).click();
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password', { exact: true }).fill('pass');
    await page.getByRole('button', { name: 'Create account' }).click();
    await page.getByRole('button', { name: 'LOG OUT' }).click();

    await page.getByRole('link', { name: 'Log in' }).click();
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password', { exact: true }).fill('pass');
    await page.getByRole('button', { name: 'Log in' }).click();

    const loggedInText = page.getByText('Logged in as user');
    await expect(loggedInText).toBeVisible();
  });

  test('trying to log in with wrong credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'Create account' }).click();
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password', { exact: true }).fill('pass');
    await page.getByRole('button', { name: 'Create account' }).click();
    await page.getByRole('button', { name: 'LOG OUT' }).click();

    await page.getByRole('link', { name: 'Log in' }).click();
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password', { exact: true }).fill('wrongpassword');
    await page.getByRole('button', { name: 'Log in' }).click();

    const errorAlert = page.getByRole('alert').getByText('Error logging in');
    await expect(errorAlert).toBeVisible();
  });

  test('bobby tables can safely create account', async ({ page }) => {
    await page.getByRole('link', { name: 'Create account' }).click();
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password', { exact: true }).fill('pass');
    await page.getByRole('button', { name: 'Create account' }).click();
    await page.getByRole('button', { name: 'LOG OUT' }).click();

    await page.getByRole('link', { name: 'Create account' }).click();
    await page
      .getByLabel('Username')
      .fill("Robert'); DROP TABLE users CASCADE;--");
    await page.getByLabel('Password', { exact: true }).fill('bobby');
    await page.getByRole('button', { name: 'Create account' }).click();
    await page.getByRole('button', { name: 'LOG OUT' }).click();

    await page.getByRole('link', { name: 'Log in' }).click();
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password', { exact: true }).fill('pass');
    await page.getByRole('button', { name: 'Log in' }).click();

    const loggedInText = page.getByText('Logged in as user');
    await expect(loggedInText).toBeVisible();
  });
});
