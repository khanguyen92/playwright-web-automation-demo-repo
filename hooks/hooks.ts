import { Before, BeforeAll, After, AfterAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, request } from '@playwright/test';
import { ICustomWorld } from '../fixtures/custom-world';

setDefaultTimeout(60000);

BeforeAll(async function () {
  // Global setup if needed
});

Before(async function (this: ICustomWorld) {
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.request = await request.newContext();
});

After(async function (this: ICustomWorld, { result }) {
  if (result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, 'image/png');
  }

  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
  await this.request?.dispose();
});

AfterAll(async function () {
  // Global teardown if needed
});
