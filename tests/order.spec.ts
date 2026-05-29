import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { OrderPage } from '../pages/order.page';
import { getLoginCredentials } from '../utils/env';
import { readOrdersFromExcel } from '../utils/order-data';

const orders = readOrdersFromExcel();

async function expectSuccessfulOrderScreenshot(page:any, orderPage: OrderPage, screenshotName: string) {
  await expect(orderPage.receipt).toBeVisible();
  await orderPage.captureOrderConfirmationScreenshot(page, `screenshots/${screenshotName}.png`);
}

test.describe('Order robot submit from Excel', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = getLoginCredentials();

    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
  });

  for (const order of orders) {
    test(`Order No ${order.orderNo}`, async ({ page }) => {
      const orderPage = new OrderPage(page);

      await orderPage.openOrderForm('OK');
      await orderPage.fillOrderForm({
        head: order.head,
        body: order.body,
        legs: order.legs,
        address: order.address,
      });
      await orderPage.retryOrderWhenFail();

      await expectSuccessfulOrderScreenshot(page, orderPage, `order-${order.orderNo}`);
    });
  }
});
