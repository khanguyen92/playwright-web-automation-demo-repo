import { Given, When } from '@cucumber/cucumber';
import { ICustomWorld } from '../../fixtures/custom-world';
import { MyAccountPage } from '../../pages/my-account.page';
import { ShopPage } from '../../pages/shop.page';
import { BasketPage } from '../../pages/basket.page';

Given('I am on the {string} page', async function (this: ICustomWorld, pageName: string) {
  if (pageName === 'My Account') {
    const accountPage = new MyAccountPage(this.page!);
    await accountPage.navigateToMyAccount();
  } else if (pageName === 'Shop') {
    const shopPage = new ShopPage(this.page!);
    await shopPage.navigateToShop();
  } else if (pageName === 'Basket') {
    const basketPage = new BasketPage(this.page!);
    await basketPage.navigateToBasket();
  }
});

When('I click the {string} button', async function (this: ICustomWorld, btnName: string) {
  if (btnName === 'Register' || btnName === 'Login') {
    const accountPage = new MyAccountPage(this.page!);
    if (btnName === 'Register') await accountPage.clickRegister();
    if (btnName === 'Login') await accountPage.clickLogin();
  } else if (btnName === 'Filter') {
    const shopPage = new ShopPage(this.page!);
    await shopPage.clickFilter();
  } else if (btnName === 'Update Basket') {
    const basketPage = new BasketPage(this.page!);
    await basketPage.clickUpdateBasket();
  }
});

When('I click {string}', async function (this: ICustomWorld, btnName: string) {
  if (btnName === 'Register') {
    const accountPage = new MyAccountPage(this.page!);
    // Use force click — WooCommerce may disable the button on invalid input
    await accountPage.clickRegisterForce();
  } else if (btnName === 'Apply Coupon') {
    const basketPage = new BasketPage(this.page!);
    // Only click the button — the coupon field was already filled in the preceding step
    await basketPage.clickApplyCoupon();
  }
});

Given('I assigned a unique value to variable  {string}', async function (this: ICustomWorld, variableName: string) {
  const uniqueValue = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`;
  const cleanName = variableName.replace(/[\$\{\}]/g, '');

  // Store ONLY in the Cucumber World — never in process.env (breaks parallel execution)
  this.testData[variableName] = uniqueValue;
  this.testData[cleanName] = uniqueValue;
});

Given('I assigned string {string} to variable {string}', async function (this: ICustomWorld, valueString: string, variableName: string) {
  let actualValue = valueString;

  const match = valueString.match(/^\$\{(.+)\}$/);
  if (match) {
    const dataPath = match[1];
    const parts = dataPath.split('.');
    let current: any = this.testData;
    for (const part of parts) {
      current = current?.[part];
    }
    if (current !== undefined) actualValue = current;
  }

  const cleanName = variableName.replace(/[\$\{\}]/g, '');

  // Store ONLY in the Cucumber World — never in process.env (breaks parallel execution)
  this.testData[variableName] = actualValue;
  this.testData[cleanName] = actualValue;
});
