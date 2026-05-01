import { Page, Locator } from '@playwright/test';
import { ShopLocator } from '../locators/shop.locator';
import { env } from '../utils/env';

export class ShopPage {
  constructor(private page: Page) {}

  async navigateToShop() {
    await this.page.goto(`${env.BASE_URL}shop/`);
  }

  async adjustPriceFilter() {
    const leftSlider = this.page.locator(ShopLocator.priceSliderLeft);
    await leftSlider.waitFor({ state: 'visible' });
    await leftSlider.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(500, 0);
    await this.page.mouse.up();
  }

  async clickFilter() {
    await this.page.click(ShopLocator.filterButton);
    // Wait for product list to re-render instead of broad networkidle
    await this.page.locator(ShopLocator.productItems).first().waitFor({ state: 'visible' });
  }

  async addSpecificBookToBasket() {
    await this.page.locator(ShopLocator.addToBasketBtn).first().click();
    await this.page.locator(ShopLocator.viewBasketLink).first().waitFor({ state: 'visible' });
  }

  // --- Locator Getters (assertions live in step definitions) ---

  getProductPrices(): Locator {
    return this.page.locator(ShopLocator.productPrices);
  }

  getViewBasketLink(): Locator {
    return this.page.locator(ShopLocator.viewBasketLink).first();
  }

  getHeaderCartCount(): Locator {
    return this.page.locator(ShopLocator.headerCartCount);
  }
}
