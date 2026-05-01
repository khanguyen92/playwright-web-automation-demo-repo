import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, request, APIRequestContext } from '@playwright/test';

export interface ICustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  request?: APIRequestContext;
  testData: Record<string, any>;
  apiResponses: Record<string, any>;
}

export class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  request?: APIRequestContext;
  testData: Record<string, any>;
  apiResponses: Record<string, any>;

  constructor(options: IWorldOptions) {
    super(options);
    this.testData = require('../test-data/data.json');
    this.apiResponses = {};
  }
}

setWorldConstructor(CustomWorld);
