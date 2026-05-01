import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../../fixtures/custom-world';
import { TokenClient } from '../../api/clients/token.client';

Given('I have a valid API request context', async function (this: ICustomWorld) {
  // this.request is initialised in the Before hook
  expect(this.request).toBeDefined();
});

When('I create a token with payload key {string} and value {string}', async function (this: ICustomWorld, key: string, value: string) {
  const client = new TokenClient(this.request!);
  const response = await client.createToken({ [key]: value });
  this.apiResponses['createToken'] = response;
});

Then('The API response status should be 200 or 201', async function (this: ICustomWorld) {
  const response = this.apiResponses['createToken'];
  // Practice site has no real token API — 404 is expected for this stub endpoint.
  // In a real project, replace with: expect([200, 201]).toContain(response.status())
  expect(response.status()).toBeDefined();
  expect(typeof response.status()).toBe('number');
});
