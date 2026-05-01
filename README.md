# 🎭 Playwright + Cucumber BDD Automation Framework

A production-ready, AI-assisted test automation framework built with **TypeScript**, **Playwright**, and **Cucumber BDD (Gherkin)**. Enforces strict architectural rules — zero-assertion Page Objects, dynamic data resolution, and a central Page Registry — making it maintainable, scalable, and parallel-safe.

> **Test suite status:** 16 scenarios · 74 steps · all passing ✅

---

## 🚀 Key Features

| Feature | Detail |
|---|---|
| **Strict POM** | 100% separation of Locators and Page Object logic — no raw selectors inside page objects |
| **Zero-Assertion POM** | All `expect()` calls live in step definitions only — page objects are interaction-only |
| **BDD Gherkin** | Cucumber-js with Custom World for Playwright state sharing across steps |
| **Page Registry** | Central `utils/page-registry.ts` — adding or renaming a page requires updating one file |
| **Dynamic Data** | Test data resolved from `qa.env` and `test-data/data.json` at runtime via `${VAR}` syntax |
| **Parallel Execution** | 4 parallel workers configured; no shared state between tests |
| **Auto-Waiting** | Zero `waitForTimeout()` calls — uses element-specific `waitFor({ state: 'visible' })` |
| **HTML Reports** | Auto-generated Cucumber HTML report after every run |
| **API Testing** | Integrated Playwright `APIRequestContext` for API layer tests |
| **MCP AI Layer** | AI agent scaffolding — parse → crawl live DOM → generate POMs and feature files |

---

## 📁 Project Structure

```text
playwright-web-automation-demo-repo/
│
├── features/                    # Gherkin BDD scenarios
│   ├── e2e/
│   │   ├── my-account.feature   # Login, registration, logout flows
│   │   ├── shop-basket.feature  # Cart, coupon, quantity flows
│   │   └── homepage.feature     # Navigation and UI checks
│   └── api/
│       └── api-token.feature    # API layer tests
│
├── step-definitions/            # Cucumber step implementations
│   ├── e2e/
│   │   ├── common.steps.ts      # Shared steps (navigation, button clicks)
│   │   ├── my-account.steps.ts
│   │   ├── basket.steps.ts
│   │   ├── shop.steps.ts
│   │   └── homepage.steps.ts
│   └── api/
│       └── token.steps.ts
│
├── pages/                       # Page Object Model (interaction logic only)
│   ├── my-account.page.ts
│   ├── basket.page.ts
│   ├── shop.page.ts
│   └── homepage.page.ts
│
├── locators/                    # All CSS/XPath selectors (single source of truth)
│   ├── my-account.locator.ts
│   ├── basket.locator.ts
│   ├── shop.locator.ts
│   └── homepage.locator.ts
│
├── utils/
│   ├── env.ts                   # Typed environment variable accessors
│   └── page-registry.ts         # Central page name → navigation mapping
│
├── fixtures/
│   └── custom-world.ts          # Cucumber Custom World (Playwright context + testData)
│
├── hooks/
│   └── hooks.ts                 # Before/After lifecycle (browser launch, screenshots)
│
├── api/clients/
│   └── token.client.ts          # API request helpers
│
├── mcp/                         # AI agent integration layer
│   ├── parser.ts                # Parses test cases from Markdown/JSON
│   ├── crawler.ts               # Crawls live DOM to extract resilient selectors
│   └── generator.ts             # Scaffolds .locator.ts, .page.ts, .feature files
│
├── test-data/
│   └── data.json                # Static test inputs (credentials replaced with ${VAR})
│
├── reports/                     # Generated HTML reports (git-ignored)
├── qa.env                       # Local secrets — NEVER commit (git-ignored)
├── qa.env.example               # Template for new developers
├── cucumber.js                  # Cucumber runner config (format, paths, parallel)
├── playwright.config.ts         # Playwright browser/project config
└── tsconfig.json
```

---

## 🛠️ Installation

**Prerequisites:** Node.js v18+

```bash
# 1. Clone the repository
git clone https://github.com/khanguyen92/playwright-web-automation-demo-repo.git
cd playwright-web-automation-demo-repo

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install chromium
```

---

## ⚙️ Configuration

Copy the example env file and fill in your credentials:

```bash
cp qa.env.example qa.env
```

Edit `qa.env`:

```env
BASE_URL=https://practice.automationtesting.in/
APP_USERNAME=your_username
APP_PASSWORD=your_password
```

> ⚠️ `qa.env` is in `.gitignore` — it will never be committed. Do not add credentials to any other file.

---

## 🏃 Running Tests

| Command | Description |
|---|---|
| `npm run test` | Run full suite (16 scenarios, 74 steps) |
| `npm run test:report` | Run tests then auto-open HTML report |
| `npm run report` | Open the last generated report |

```bash
# Run all tests
npm run test

# Run and open report automatically
npm run test:report

# Open last report without re-running
npm run report
```

The HTML report is written to `reports/cucumber-report.html` after every run.

---

## 🧱 Architectural Rules

These rules are enforced throughout the framework. Any generated or handwritten code must comply.

### 1. No Selectors Inside Page Objects
All CSS/XPath strings live in `/locators/*.locator.ts`. Page objects import and use them — they never define raw strings.

```ts
// ✅ Correct
await this.page.fill(MyAccountLocator.loginUsernameInput, username);

// ❌ Wrong
await this.page.fill('#username', username);
```

### 2. No Assertions (`expect()`) Inside Page Objects
Page objects handle interactions only. All `expect()` calls belong in step definitions.

```ts
// ✅ Correct — in step-definitions/
await expect(accountPage.getWelcomeText()).toContainText('Hello');

// ❌ Wrong — in pages/
await expect(this.page.locator('.welcome')).toBeVisible(); // never in a page object
```

### 3. No Static Waits
Never use `page.waitForTimeout()`. Always wait for a specific element state.

```ts
// ✅ Correct
await locator.waitFor({ state: 'visible' });

// ❌ Wrong
await page.waitForTimeout(3000);
```

### 4. No Hardcoded Credentials
All credentials come from `qa.env` via `utils/env.ts`.

### 5. No Shared State Between Tests
Each scenario gets a fresh browser context. `testData` lives on the Custom World and is scoped per scenario.

### 6. Page Registry for Navigation
To add a new page, add **one entry** to `utils/page-registry.ts`. The step definition `Given I am on the "{page}" page` resolves it automatically.

```ts
// utils/page-registry.ts — the only file to update when adding a page
'Checkout': (page) => () => new CheckoutPage(page).navigateToCheckout(),
```

---

## 🤖 MCP AI Layer

The `/mcp` directory bridges AI agents (Claude, Gemini) with the framework:

1. **`parser.ts`** — Reads test cases from Markdown or JSON and extracts scenario intent
2. **`crawler.ts`** — Navigates the live application using Playwright, captures DOM snapshots, and extracts resilient `data-testid` / ARIA role selectors
3. **`generator.ts`** — Scaffolds production-ready `.locator.ts`, `.page.ts`, and `.feature` files from crawl output

### Locator Priority (enforced by prompt v2)
| Priority | Strategy | Example |
|---|---|---|
| 1st | `data-testid` attribute | `[data-testid="login-btn"]` |
| 2nd | ARIA role | `getByRole('button', { name: 'Login' })` |
| 3rd | Label / Placeholder | `getByLabel('Email')` |
| 4th | Visible text | `getByText('Submit')` |
| 5th (last resort) | CSS / XPath | `.woocommerce-form__input` |

---

## 📊 Test Coverage

| Module | Scenarios | Status |
|---|---|---|
| My Account (Auth) | 5 | ✅ All passing |
| Shop & Basket | 5 | ✅ All passing |
| Homepage | 5 | ✅ All passing |
| API Token | 1 | ✅ All passing |
| **Total** | **16** | **✅ 74/74 steps** |

---

## 🔐 Security Notes

- `qa.env` — never committed (in `.gitignore`)
- `test-data/data.json` — uses `${VAR}` placeholders, resolved at runtime from `qa.env`
- `APP_USERNAME` / `APP_PASSWORD` — renamed from `USERNAME`/`PASSWORD` to avoid Windows OS environment variable collision
