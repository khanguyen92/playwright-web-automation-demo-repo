# 🧠 Playwright + Cucumber BDD + MCP Framework

A scalable, production-ready test automation framework utilizing **TypeScript**, **Playwright**, and **Cucumber BDD (Gherkin)**. 
This framework enforces strict Page Object Model (POM) and locator separation, fully utilizes Playwright's async auto-waiting capabilities, and incorporates a foundational **Model Context Protocol (MCP)** layer intended for AI-driven automated test generation.

## 🚀 Key Features

- **Strict Architecture**: 100% separation of Locators and Page Object logic.
- **BDD Ready**: Built-in `cucumber-js` integration utilizing a Custom World for Playwright state sharing.
- **Parallel Execution**: Configured for fully parallel execution (default 4 workers).
- **Auto-Waiting**: Leverages Playwright's built-in intelligent waiting; strict zero-tolerance for static `waitForTimeout()` calls.
- **MCP AI Layer**: Dedicated `/mcp` module containing scaffolding for AI agents to automatically parse markdown, crawl UI DOM for resilient locators, and generate feature and step files.
- **API Testing**: Integrated support for Playwright APIRequestContext.

## 📁 Directory Structure

```text
automation-framework/
├── package.json
├── tsconfig.json
├── playwright.config.ts    # Playwright parallel/browser configs
├── cucumber.js             # Cucumber runner configuration
├── qa.env                  # Environment configs (DO NOT COMMIT SECRETS)
│
├── features/               # BDD Gherkin (.feature) files
├── step-definitions/       # Reusable Cucumber step definitions
├── pages/                  # Page Object Model logic (NO raw selectors)
├── locators/               # Strict Locator dictionaries (CSS/XPath)
├── api/clients/            # API interaction logic
├── hooks/                  # Before/After test lifecycle hooks
├── fixtures/               # Custom World state sharing
├── mcp/                    # AI integration layer (Parser/Crawler/Generator)
├── test-data/              # Static JSON test inputs
└── utils/                  # Environment variable typed mappers
```

## 🛠️ Installation

1. Install Node.js (v18+ recommended)
2. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

## ⚙️ Configuration

Set up your `qa.env` file in the root directory:

```env
BASE_URL="https://your-testing-site.com/"
USERNAME="your_username"
PASSWORD="your_password"
```

## 🏃 Running Tests

Run the full BDD test suite:
```bash
npm run test
```

Or manually trigger Cucumber:
```bash
npx cucumber-js
```

## 🤖 The MCP Layer

The `/mcp` directory is designed to act as a bridge for AI Agents (like Anthropic Claude or Google Gemini):

1. **Parser (`parser.ts`)**: Ingests human-written test cases (Markdown, JSON).
2. **Crawler (`crawler.ts`)**: Uses Playwright to navigate the live application, evaluating the DOM to build resilient `data-testid` and `role` based locators.
3. **Generator (`generator.ts`)**: Automatically scaffolds the `.locator.ts`, `.page.ts`, and `.feature` files required for automation.

## 🧱 Design Rules

1. **No Selectors in Page Objects**: All strings (CSS/XPath) must live inside `/locators`.
2. **No Static Waits**: Do not use `page.waitForTimeout()`. Rely on Playwright's native `locator.waitFor({ state: 'visible' })`.
3. **No Hardcoded Data**: Inject credentials from `qa.env` and form inputs from `test-data/data.json`.
