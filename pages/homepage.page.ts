import { Page, Locator } from '@playwright/test';
import { HomepageLocator } from '../locators/homepage.locator';
import { env } from '../utils/env';

export class HomepagePage {
  constructor(private page: Page) {}

  async navigateToHome(url?: string) {
    await this.page.goto(url || env.BASE_URL);
  }

  getSliders(): Locator {
    return this.page.locator(HomepageLocator.sliderContainers);
  }

  async scrollToSection(sectionName: string) {
    // Find a heading with the dynamic section name, fallback to the static one
    const section = this.page.locator(`h2, h3`).filter({ hasText: new RegExp(sectionName, 'i') }).first();
    await section.or(this.page.locator(HomepageLocator.newArrivalsSection).first()).scrollIntoViewIfNeeded();
  }

  getNewArrivalProducts(): Locator {
    return this.page.locator(HomepageLocator.newArrivalProducts);
  }

  getArrivalProductButtons(): Locator {
    return this.page.locator(HomepageLocator.addToBasketOrReadMoreBtn);
  }

  async clickFirstProductImage() {
    await this.page.locator(HomepageLocator.productImage).first().click();
  }

  getProductTitle(): Locator {
    return this.page.locator(HomepageLocator.productTitle);
  }

  getButtonByText(btnName: string): Locator {
    return this.page.locator(`button, a.button, input[type="submit"]`).filter({ hasText: new RegExp(btnName, 'i') }).first();
  }

  async clickTab(tabName: string) {
    await this.page.locator(`li a`).filter({ hasText: new RegExp(tabName, 'i') }).first().click();
  }

  getDescriptionTextArea(): Locator {
    return this.page.locator(HomepageLocator.descriptionTextArea);
  }

  getReviewForm(): Locator {
    return this.page.locator(HomepageLocator.addReviewForm);
  }
}
