import type { Locator, Page } from '@playwright/test';

export class OrderPage {
  readonly page: Page;
  readonly orderRobotLink: Locator;
  readonly okButton: Locator;
  readonly yepButton: Locator;
  readonly headSelect: Locator;
  readonly legsSpinbutton: Locator;
  readonly shippingAddressTextbox: Locator;
  readonly orderButton: Locator;
  readonly orderFailureAlert: Locator;
  readonly receipt: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderRobotLink = page.getByRole('link', { name: 'Order your robot!' });
    this.okButton = page.getByRole('button', { name: 'OK' });
    this.yepButton = page.getByRole('button', { name: 'Yep' });
    this.headSelect = page.getByLabel('Head:');
    this.legsSpinbutton = page.getByRole('spinbutton', { name: 'Legs:' });
    this.shippingAddressTextbox = page.getByRole('textbox', { name: 'Shipping address' });
    this.orderButton = page.getByRole('button', { name: 'Order' });
    this.orderFailureAlert = page.locator('.alert-danger, .alert-warning');
    this.receipt = page.locator('#receipt');
  }

  async openOrderForm(confirmButton: 'OK' | 'Yep' = 'OK') {
    await this.orderRobotLink.click();
    await this.closeRobotDialog(confirmButton);
  }

  async closeRobotDialog(confirmButton: 'OK' | 'Yep') {
    if (confirmButton === 'OK') {
      await this.okButton.click();
      return;
    }

    await this.yepButton.click();
  }

  async selectHead(head: string) {
    await this.headSelect.selectOption(head);
  }

  bodyRadio(body: string) {
    return this.page.locator(`input[name="body"][value="${body}"]`);
  }

  async selectBody(body: string) {
    await this.bodyRadio(body).check();
  }

  async enterLegs(legs: string) {
    await this.legsSpinbutton.fill(legs);
  }

  async enterShippingAddress(address: string) {
    await this.shippingAddressTextbox.fill(address);
  }

  async submitOrder() {
    await this.orderButton.click();
  }

  async submitOrderUntilReceipt(maxAttempts = 5) {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.submitOrder();

      try {
        await Promise.race([
          this.receipt.waitFor({ state: 'visible', timeout: 3000 }),
          this.orderFailureAlert.waitFor({ state: 'visible', timeout: 3000 }),
        ]);

        if (await this.receipt.isVisible()) {
          return;
        }
      } catch (error) {
        lastError = error;
      }

      if (attempt === maxAttempts) {
        if (lastError) {
          throw lastError;
        }

        throw new Error(`Order failed after ${maxAttempts} attempts`);
      }

      if (await this.orderFailureAlert.isVisible()) {
        await this.orderFailureAlert.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
      } else {
        await this.page.waitForTimeout(500);
      }
    }
  }

  async retryOrderWhenFail(maxAttempts = 5) {
    await this.submitOrderUntilReceipt(maxAttempts);
  }

  async fillOrderForm(order: {
    head?: string;
    body?: string;
    legs?: string;
    address?: string;
  }) {
    if (order.head) {
      await this.selectHead(order.head);
    }

    if (order.body) {
      await this.selectBody(order.body);
    }

    if (order.legs) {
      await this.enterLegs(order.legs);
    }

    if (order.address) {
      await this.enterShippingAddress(order.address);
    }
  }

  async captureOrderConfirmationScreenshot(path = 'screenshoots/order-confirmation.png') {
    await this.receipt.screenshot({ path });
  }
}
