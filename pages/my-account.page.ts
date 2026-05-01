import { Page, Locator } from '@playwright/test';
import { MyAccountLocator } from '../locators/my-account.locator';
import { env } from '../utils/env';

export class MyAccountPage {
  constructor(private page: Page) {}

  async navigateToMyAccount() {
    await this.page.goto(`${env.BASE_URL}my-account/`);
  }

  // --- Registration ---

  async enterRegistrationEmail(email: string) {
    const uniqueEmail = email.includes('unique') ? email.replace('@', `+${Date.now()}@`) : email;
    // Use pressSequentially so WooCommerce input event listeners fire properly
    const input = this.page.locator(MyAccountLocator.registerEmailInput);
    await input.click();
    await input.pressSequentially(uniqueEmail, { delay: 30 });
    await input.press('Tab');
  }

  async enterRegistrationPassword(password: string) {
    const input = this.page.locator(MyAccountLocator.registerPasswordInput);
    await input.click();
    await input.fill(password);
    await input.press('Tab'); // trigger WooCommerce password strength meter
  }

  async clickRegister() {
    await Promise.all([
      this.page.waitForURL(/my-account/, { timeout: 15000 }),
      this.page.click(MyAccountLocator.registerButton),
    ]);
  }

  /** Attempt click even if disabled — used to test that invalid inputs prevent submission. */
  async clickRegisterForce() {
    await this.page.click(MyAccountLocator.registerButton, { force: true });
  }

  // --- Login ---

  /** Fill ONLY the username field (used in split BDD steps). */
  async enterUsername(username: string) {
    await this.page.fill(MyAccountLocator.loginUsernameInput, username);
  }

  /** Fill ONLY the password field (used in split BDD steps). */
  async enterPassword(password: string) {
    await this.page.fill(MyAccountLocator.loginPasswordInput, password);
  }

  /** Fill both username and password in one call (used for setup/precondition steps). */
  async login(username: string, password: string) {
    await this.page.fill(MyAccountLocator.loginUsernameInput, username);
    await this.page.fill(MyAccountLocator.loginPasswordInput, password);
  }

  async clickLogin() {
    await this.page.click(MyAccountLocator.loginButton);
  }

  // --- Logout ---

  async logout() {
    await this.page.click(MyAccountLocator.dashboardSignOutLink);
  }

  // --- Locator Getters (assertions live in step definitions) ---

  getDashboardSignOutLink(): Locator {
    // Use first() — WooCommerce renders 2 logout links (sidebar nav + inline welcome paragraph)
    return this.page.locator('a[href*="customer-logout"]').first();
  }

  getWelcomeText(): Locator {
    return this.page.locator(MyAccountLocator.dashboardWelcomeText);
  }

  getErrorMessages(): Locator {
    return this.page.locator(MyAccountLocator.errorMessage);
  }

  getLoginButton(): Locator {
    return this.page.locator(MyAccountLocator.loginButton);
  }

  getRegisterButton(): Locator {
    return this.page.locator(MyAccountLocator.registerButton);
  }

  getLoginUsernameInput(): Locator {
    return this.page.locator(MyAccountLocator.loginUsernameInput);
  }

  getOrdersLink(): Locator {
    return this.page.locator(MyAccountLocator.dashboardOrdersLink);
  }

  getAddressesLink(): Locator {
    return this.page.locator(MyAccountLocator.dashboardAddressesLink);
  }

  getRegisterEmailInput(): Locator {
    return this.page.locator(MyAccountLocator.registerEmailInput);
  }

  /** Generic navigation link lookup by visible text. */
  getNavLink(text: string): Locator {
    return this.page.getByRole('link', { name: text });
  }
}
