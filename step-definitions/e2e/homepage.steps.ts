import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HomepagePage } from '../../pages/homepage.page';
import { ICustomWorld } from '../../fixtures/custom-world';
import { env } from '../../utils/env';

Given('I navigate to {string}', async function (this: ICustomWorld, url: string) {
  const homepage = new HomepagePage(this.page!);
  let actualUrl = url;
  const match = url.match(/^\$\{(.+)\}$/);
  if (match) {
    actualUrl = process.env[match[1]] || (env as any)[match[1]] || url;
  }
  await homepage.navigateToHome(actualUrl);
});

Given('I am on the homepage', async function (this: ICustomWorld) {
  const homepage = new HomepagePage(this.page!);
  await homepage.navigateToHome();
});

When('I locate the slider containers on the homepage', async function (this: ICustomWorld) {
  const homepage = new HomepagePage(this.page!);
  await homepage.getSliders().first().waitFor({ state: 'visible' });
});

Then('I should count exactly {int} slider elements', async function (this: ICustomWorld, count: number) {
  const homepage = new HomepagePage(this.page!);
  const sliders = homepage.getSliders();
  await expect(sliders).toHaveCount(count);
});

Then('each slider should be visible to the user', async function (this: ICustomWorld) {
  const homepage = new HomepagePage(this.page!);
  const sliders = homepage.getSliders();
  const count = await sliders.count();
  for (let i = 0; i < count; i++) {
    await expect(sliders.nth(i)).toBeVisible();
  }
});

When('I scroll down to the {string} section', async function (this: ICustomWorld, sectionName: string) {
  const homepage = new HomepagePage(this.page!);
  await homepage.scrollToSection(sectionName);
});

Then('I should see exactly {int} product items displayed', async function (this: ICustomWorld, count: number) {
  const homepage = new HomepagePage(this.page!);
  const products = homepage.getNewArrivalProducts();
  await expect(products).toHaveCount(count);
});

Then('each product should have an {string} button or {string} link', async function (this: ICustomWorld, btn1: string, btn2: string) {
  const homepage = new HomepagePage(this.page!);
  const products = homepage.getNewArrivalProducts();
  const buttons = homepage.getArrivalProductButtons();
  const count = await products.count();
  await expect(buttons).toHaveCount(count);
});

When('I click on the image of the first product in {string}', async function (this: ICustomWorld, sectionName: string) {
  const homepage = new HomepagePage(this.page!);
  // Uses sectionName context if needed, currently clicking the first product image overall
  await homepage.clickFirstProductImage();
});

Then('The URL should change to the specific product detail page', async function (this: ICustomWorld) {
  await expect(this.page!).toHaveURL(/.*product.*/);
});

Then('The page should display the product title and {string} button', async function (this: ICustomWorld, btnName: string) {
  const homepage = new HomepagePage(this.page!);
  await expect(homepage.getProductTitle()).toBeVisible();
  await expect(homepage.getButtonByText(btnName)).toBeVisible();
});

Given('I have clicked on a product from the Arrivals section', async function (this: ICustomWorld) {
  const homepage = new HomepagePage(this.page!);
  await homepage.navigateToHome();
  await homepage.clickFirstProductImage();
});

When('I click on the {string} tab at the bottom of the page', async function (this: ICustomWorld, tabName: string) {
  const homepage = new HomepagePage(this.page!);
  await homepage.clickTab(tabName);
});

Then('The description text area should be visible', async function (this: ICustomWorld) {
  const homepage = new HomepagePage(this.page!);
  await expect(homepage.getDescriptionTextArea()).toBeVisible();
});

Then('It should contain more than {int} characters of text', async function (this: ICustomWorld, charCount: number) {
  const homepage = new HomepagePage(this.page!);
  const desc = homepage.getDescriptionTextArea();
  const text = await desc.textContent();
  expect(text?.trim().length).toBeGreaterThan(charCount);
});

When('I click on the {string} tab', async function (this: ICustomWorld, tabName: string) {
  const homepage = new HomepagePage(this.page!);
  await homepage.clickTab(tabName);
});

Then('I should see the {string} form', async function (this: ICustomWorld, formName: string) {
  const homepage = new HomepagePage(this.page!);
  // Asserting the form is visible
  await expect(homepage.getReviewForm()).toBeVisible();
});

Then('The {string} button for the review should be present', async function (this: ICustomWorld, btnName: string) {
  const homepage = new HomepagePage(this.page!);
  // Using the parameter btnName to find the exact button
  await expect(homepage.getButtonByText(btnName)).toBeVisible();
});
