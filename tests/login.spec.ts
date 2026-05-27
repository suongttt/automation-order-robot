import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { getInvalidLoginCredentials, getLoginCredentials } from '../utils/env';

test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
  });

  test('Login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = getLoginCredentials();

    await loginPage.login(credentials.username, credentials.password);

    await expect(page).toHaveTitle('RobotSpareBin Industries Inc. - Intranet');
  });

  test('Login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = getInvalidLoginCredentials();

    await loginPage.login(credentials.username, credentials.password);

    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
  });
});
