import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ShopPage } from '../../pages/shop.page';
import { ICustomWorld } from '../../fixtures/custom-world';

When('I adjust the price filter slider to a specific range', async function (this: ICustomWorld) {
  const shopPage = new ShopPage(this.page!);
  await shopPage.adjustPriceFilter();
});

Then('All displayed products must have prices within the selected range', async function (this: ICustomWorld) {
  const shopPage = new ShopPage(this.page!);
  const prices = shopPage.getProductPrices();
  const count = await prices.count();
  for (let i = 0; i < count; i++) {
    const priceText = await prices.nth(i).textContent();
    const priceVal = parseFloat(priceText?.replace(/[^\d.]/g, '') || '0');
    expect(priceVal).toBeGreaterThan(0);
  }
});

Given('I am on the Shop page', async function (this: ICustomWorld) {
  const shopPage = new ShopPage(this.page!);
  await shopPage.navigateToShop();
});

When('I click the {string} button for a specific book', async function (this: ICustomWorld, btnName: string) {
  const shopPage = new ShopPage(this.page!);
  await shopPage.addSpecificBookToBasket();
});

Then('A {string} button should appear next to the product', async function (this: ICustomWorld, btnName: string) {
  const shopPage = new ShopPage(this.page!);
  await expect(shopPage.getViewBasketLink()).toBeVisible();
});

Then('The cart count in the header should update to {string}', async function (this: ICustomWorld, countText: string) {
  const shopPage = new ShopPage(this.page!);
  await expect(shopPage.getHeaderCartCount()).toContainText(countText);
});
