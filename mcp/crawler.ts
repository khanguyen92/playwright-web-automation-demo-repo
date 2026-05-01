import { chromium, Page } from '@playwright/test';
import { env } from '../utils/env';
import * as fs from 'fs';

export interface DiscoveredElement {
  tag: string;
  role?: string;
  testId?: string;
  label?: string;
  text?: string;
  suggestedLocator: string;
}

/**
 * UI Crawler to analyze a page and extract elements to build locators.
 * Called by MCP.
 */
export class UICrawler {
  private page!: Page;
  
  async init() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    this.page = await context.newPage();
  }

  async loginAndNavigate(targetUrl: string) {
    // Navigate and login
    await this.page.goto(env.BASE_URL);
    // Simple logic, usually replaced with dynamic AI-driven flow
  }

  async extractElements(): Promise<DiscoveredElement[]> {
    // Analyze DOM and extract resilient locators
    // In a real AI setup, this data is sent directly to an LLM to map against the test scenarios
    const elements = await this.page.evaluate(() => {
      const extracted: DiscoveredElement[] = [];
      const interactables = document.querySelectorAll('button, input, a, select, [role="button"], p, h1, h2');
      
      interactables.forEach((el) => {
        // Skip hidden elements
        if ((el as HTMLElement).offsetParent === null) return;

        const testId = el.getAttribute('data-testid');
        const role = el.getAttribute('role');
        const label = el.getAttribute('aria-label');
        const text = el.textContent?.trim() || (el as HTMLInputElement).value || '';
        const id = el.id;
        const classes = el.className;
        
        let suggestedLocator = '';
        if (testId) suggestedLocator = `[data-testid="${testId}"]`;
        else if (id) suggestedLocator = `#${id}`;
        else if (classes && typeof classes === 'string') suggestedLocator = `${el.tagName.toLowerCase()}.${classes.split(' ')[0]}`;
        else if (label) suggestedLocator = `[aria-label="${label}"]`;
        else suggestedLocator = `${el.tagName.toLowerCase()}:has-text("${text.substring(0, 15)}")`;
        
        extracted.push({
          tag: el.tagName,
          role: role || undefined,
          testId: testId || undefined,
          label: label || undefined,
          text: text ? text.substring(0, 50) : undefined, // Truncate text for prompt limits
          suggestedLocator
        });
      });
      return extracted;
    });

    // Write crawler output — ensure directory exists first
    fs.mkdirSync('./.system_generated', { recursive: true });
    fs.writeFileSync('./.system_generated/crawler_dump.json', JSON.stringify(elements, null, 2));

    return elements;
  }

  async close() {
    await this.page.context().browser()?.close();
  }
}
