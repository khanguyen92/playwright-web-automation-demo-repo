import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { MyAccountPage } from '../../pages/my-account.page';
import { ICustomWorld } from '../../fixtures/custom-world';
import { env } from '../../utils/env';

// --- Registration Steps ---

When('I enter the email {word} in the Register email field', async function (this: ICustomWorld, emailVar: string) {
  const accountPage = new MyAccountPage(this.page!);
  const cleanName = emailVar.replace(/[\$\{\}]/g, '');
  const actualEmail = this.testData[cleanName] || this.testData[emailVar] || emailVar;
  await accountPage.enterRegistrationEmail(actualEmail);
});

When('I enter a strong password in the Register password field', async function (this: ICustomWorld) {
  const accountPage = new MyAccountPage(this.page!);
  await accountPage.enterRegistrationPassword(env.PASSWORD);
});

Then('I should be redirected to the account dashboard', async function (this: ICustomWorld) {
  // Wait for page to settle after form submit
  await this.page!.waitForURL(/my-account/, { timeout: 15000 });
  await this.page!.waitForLoadState('domcontentloaded');

  const accountPage = new MyAccountPage(this.page!);
  const logoutVisible = await accountPage.getDashboardSignOutLink().isVisible({ timeout: 8000 }).catch(() => false);
  const loginFormVisible = await accountPage.getLoginButton().isVisible({ timeout: 2000 }).catch(() => false);

  if (logoutVisible) {
    // Successfully logged into dashboard
    return;
  }

  if (loginFormVisible) {
    // Registration was rejected — surface the error
    const error = await this.page!.locator('.woocommerce-error').textContent().catch(() => 'no error element');
    throw new Error(`Registration failed. Login form still visible. WooCommerce error: ${error}`);
  }

  // Unknown state
  throw new Error(`Unexpected state after registration. URL: ${this.page!.url()}`);
});

Then('I should see the welcome message {string}', async function (this: ICustomWorld, msg: string) {
  const accountPage = new MyAccountPage(this.page!);
  // msg e.g. "Hello [username]" — assert the greeting prefix is present
  await expect(accountPage.getWelcomeText()).toContainText('Hello');
});

// --- Login Steps ---

When('I enter my registered email in the Login username field', async function (this: ICustomWorld) {
  const accountPage = new MyAccountPage(this.page!);
  await accountPage.enterUsername(env.USERNAME);
});

When('I enter my correct password in the Login password field', async function (this: ICustomWorld) {
  const accountPage = new MyAccountPage(this.page!);
  await accountPage.enterPassword(env.PASSWORD);
});

Then('The {string} link should be visible in the navigation', async function (this: ICustomWorld, linkText: string) {
  const accountPage = new MyAccountPage(this.page!);
  await expect(accountPage.getNavLink(linkText)).toBeVisible();
});

Then('I should have access to the {string} and {string} links', async function (this: ICustomWorld, link1: string, link2: string) {
  const accountPage = new MyAccountPage(this.page!);
  await expect(accountPage.getOrdersLink()).toBeVisible();
  await expect(accountPage.getAddressesLink()).toBeVisible();
});

When('I enter a valid email but an incorrect password', async function (this: ICustomWorld) {
  const accountPage = new MyAccountPage(this.page!);
  await accountPage.login(env.USERNAME, this.testData.invalidUser.password);
});

Then('I should see an error message starting with {string}', async function (this: ICustomWorld, errorTxt: string) {
  const accountPage = new MyAccountPage(this.page!);
  const error = accountPage.getErrorMessages().first();
  await expect(error).toBeVisible();
  await expect(error).toContainText(errorTxt.replace('Error: ', ''));
});

Then('I should remain on the login page', async function (this: ICustomWorld) {
  const accountPage = new MyAccountPage(this.page!);
  await expect(accountPage.getLoginButton()).toBeVisible();
});

// --- Validation Steps ---

When('I enter an invalid email format in the Register email field', async function (this: ICustomWorld) {
  const accountPage = new MyAccountPage(this.page!);
  await accountPage.enterRegistrationEmail('invalid_email_format');
});

When('I enter a valid password', async function (this: ICustomWorld) {
  const accountPage = new MyAccountPage(this.page!);
  await accountPage.enterRegistrationPassword('Val!dPass1234');
});

Then('The system should prevent submission', async function (this: ICustomWorld) {
  const accountPage = new MyAccountPage(this.page!);
  // Register button remains visible — form was not submitted
  await expect(accountPage.getRegisterButton()).toBeVisible();
});

Then('I should see an error related to invalid email address', async function (this: ICustomWorld) {
  // Invalid email format triggers HTML5 native validation — no WooCommerce error element is rendered.
  // Verify the register email input is marked invalid by the browser.
  const accountPage = new MyAccountPage(this.page!);
  const isValid = await accountPage.getRegisterEmailInput().evaluate(
    (el) => (el as HTMLInputElement).validity.valid
  );
  expect(isValid).toBe(false);
});

// --- Logout Steps ---

Given('I am logged into my account', async function (this: ICustomWorld) {
  const accountPage = new MyAccountPage(this.page!);
  await accountPage.navigateToMyAccount();
  await accountPage.login(env.USERNAME, env.PASSWORD);
  await accountPage.clickLogin();
  await expect(accountPage.getDashboardSignOutLink()).toBeVisible();
});

When('I click the {string} link in the dashboard menu', async function (this: ICustomWorld, link: string) {
  const accountPage = new MyAccountPage(this.page!);
  if (link === 'Logout') await accountPage.logout();
});

Then('I should be redirected back to the {string} login page', async function (this: ICustomWorld, _pageName: string) {
  const accountPage = new MyAccountPage(this.page!);
  await expect(accountPage.getLoginButton()).toBeVisible();
});

Then('The login form should be empty and visible', async function (this: ICustomWorld) {
  const accountPage = new MyAccountPage(this.page!);
  await expect(accountPage.getLoginButton()).toBeVisible();
  const usernameVal = await accountPage.getLoginUsernameInput().inputValue();
  expect(usernameVal).toBe('');
});
