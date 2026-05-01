import { Page, Locator, expect } from '@playwright/test';
import { BasketLocator } from '../locators/basket.locator';
import { env } from '../utils/env';

export class BasketPage {
  constructor(private page: Page) {}

  async navigateToBasket() {
    await this.page.goto(`${env.BASE_URL}basket/`);
  }

  async enterCouponCode(code: string) {
    await this.page.fill(BasketLocator.couponInput, code);
  }

  async clickApplyCoupon() {
    await this.page.click(BasketLocator.applyCouponBtn);
    // Wait for either success or error message to appear
    await this.page.locator(`${BasketLocator.successMessage}, .woocommerce-error`).first().waitFor({ state: 'visible' });
  }

  /** Combined helper for setup/precondition steps. */
  async applyCoupon(coupon: string) {
    await this.enterCouponCode(coupon);
    await this.clickApplyCoupon();
  }

  async removeFirstProduct() {
    await this.page.click(BasketLocator.removeProductBtn);
    await this.page.locator(BasketLocator.removeProductBtn).waitFor({ state: 'hidden' });
  }

  async updateQuantity(qty: string) {
    const qtyInput = this.page.locator(BasketLocator.quantityInput).first();
    await qtyInput.fill(qty);
    // WooCommerce enables 'Update Cart' only after a change event — Tab triggers it
    await qtyInput.press('Tab');
  }

  async clickUpdateBasket() {
    const updateBtn = this.page.locator(BasketLocator.updateBasketBtn);
    // Wait for WooCommerce to enable the button after qty change event
    await updateBtn.waitFor({ state: 'visible' });
    await expect(updateBtn).toBeEnabled();
    await updateBtn.click();
    // After click the page reloads — wait for subtotal to re-render
    await this.page.locator(BasketLocator.productSubtotal).first().waitFor({ state: 'visible' });
  }

  // --- Locator Getters (assertions live in step definitions) ---

  getSuccessMessage(): Locator {
    return this.page.locator(BasketLocator.successMessage);
  }

  getCartDiscount(): Locator {
    return this.page.locator(BasketLocator.cartDiscount);
  }

  getRemoveProductBtn(): Locator {
    return this.page.locator(BasketLocator.removeProductBtn);
  }

  getEmptyBasketMessage(): Locator {
    return this.page.locator(BasketLocator.emptyBasketMessage);
  }

  getProductSubtotal(): Locator {
    return this.page.locator(BasketLocator.productSubtotal);
  }

  getOrderTotal(): Locator {
    return this.page.locator(BasketLocator.orderTotal);
  }
}
