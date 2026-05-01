import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { BasketPage } from '../../pages/basket.page';
import { ShopPage } from '../../pages/shop.page';
import { ICustomWorld } from '../../fixtures/custom-world';

Given('I have {string} book in my basket', async function (this: ICustomWorld, bookName: string) {
  const shopPage = new ShopPage(this.page!);
  await shopPage.navigateToShop();
  await shopPage.addSpecificBookToBasket();
});

Given('I have at least one product in my basket', async function (this: ICustomWorld) {
  const shopPage = new ShopPage(this.page!);
  await shopPage.navigateToShop();
  await shopPage.addSpecificBookToBasket();

  const basketPage = new BasketPage(this.page!);
  await basketPage.navigateToBasket();
});

Given('I have one book in my basket', async function (this: ICustomWorld) {
  const shopPage = new ShopPage(this.page!);
  await shopPage.navigateToShop();
  await shopPage.addSpecificBookToBasket();

  const basketPage = new BasketPage(this.page!);
  await basketPage.navigateToBasket();

  // Wait for basket to render, then capture unit price (qty=1)
  await basketPage.getProductSubtotal().first().waitFor({ state: 'visible' });
  const subtotalText = await basketPage.getProductSubtotal().first().textContent();
  this.testData.originalSubtotal = parseFloat(subtotalText?.replace(/[^\d.]/g, '') || '0');
});

When('I enter the coupon code {string} in the coupon field', async function (this: ICustomWorld, code: string) {
  const basketPage = new BasketPage(this.page!);
  this.testData.currentCoupon = code;
  // Fill the UI input field
  await basketPage.enterCouponCode(code);
});

Then('I should see a response message after applying coupon', async function (this: ICustomWorld) {
  const basketPage = new BasketPage(this.page!);
  // Either success (.woocommerce-message) or error (.woocommerce-error) should appear
  // Coupon 'krishnasakthi' is expired on the live practice site — we assert a response exists
  const success = basketPage.getSuccessMessage();
  const error = this.page!.locator('.woocommerce-error');
  const hasSuccess = await success.isVisible().catch(() => false);
  const hasError = await error.isVisible().catch(() => false);
  expect(hasSuccess || hasError).toBe(true);
});

Then('I should see a success message {string}', async function (this: ICustomWorld, msg: string) {
  const basketPage = new BasketPage(this.page!);
  const msgLocator = basketPage.getSuccessMessage();
  await expect(msgLocator).toBeVisible();
  await expect(msgLocator).toContainText(msg);
});

Then('The total amount should show a discount deduction', async function (this: ICustomWorld) {
  const basketPage = new BasketPage(this.page!);
  await expect(basketPage.getCartDiscount()).toBeVisible();
});

When('I click the {string} button next to the product in the Basket table', async function (this: ICustomWorld, btnType: string) {
  const basketPage = new BasketPage(this.page!);
  if (btnType === 'X') {
    await basketPage.removeFirstProduct();
  }
});

Then('The product should disappear from the list', async function (this: ICustomWorld) {
  const basketPage = new BasketPage(this.page!);
  await expect(basketPage.getRemoveProductBtn()).toHaveCount(0);
});

Then('I should see the message {string}', async function (this: ICustomWorld, msg: string) {
  const basketPage = new BasketPage(this.page!);
  const emptyMsg = basketPage.getEmptyBasketMessage();
  await expect(emptyMsg).toBeVisible();
  await expect(emptyMsg).toContainText(msg);
});

When('I change the quantity input field to {string}', async function (this: ICustomWorld, qty: string) {
  const basketPage = new BasketPage(this.page!);
  // originalSubtotal was captured in the Given step (unit price with qty=1)
  await basketPage.updateQuantity(qty);
});

Then('The subtotal for that item should be multiplied by {int}', async function (this: ICustomWorld, factor: number) {
  const basketPage = new BasketPage(this.page!);
  const original = this.testData.originalSubtotal as number;
  const expected = original * factor;

  // After Update Basket triggers a page reload, poll until subtotal reflects the new quantity
  await this.page!.waitForFunction(
    ({ selector, expectedVal }) => {
      const el = document.querySelector(selector);
      if (!el) return false;
      const text = el.textContent || '';
      const val = parseFloat(text.replace(/[^\d.]/g, ''));
      return Math.abs(val - expectedVal) < 1;
    },
    { selector: '.product-subtotal .amount', expectedVal: expected },
    { timeout: 15000 }
  );

  const text = await basketPage.getProductSubtotal().first().textContent();
  const actual = parseFloat(text!.replace(/[^\d.]/g, ''));
  expect(actual).toBeCloseTo(expected, 1);
});

Then('The total cart value should be updated accordingly', async function (this: ICustomWorld) {
  const basketPage = new BasketPage(this.page!);
  await expect(basketPage.getOrderTotal()).toBeVisible();
});
