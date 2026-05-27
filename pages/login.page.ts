import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameTextbox: Locator;
  readonly passwordTextbox: Locator;
  readonly loginButton: Locator;
  readonly invalidCredentialsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameTextbox = page.getByRole('textbox', { name: 'Username' });
    this.passwordTextbox = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.invalidCredentialsMessage = page.getByText('Invalid username or password');
  }

  async goto() {
    await this.page.goto('https://robotsparebinindustries.com/');
  }

  async login(username: string, password: string) {
    await this.usernameTextbox.fill(username);
    await this.passwordTextbox.fill(password);
    await this.loginButton.click();
  }
}
