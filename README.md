# Playwright Pro Portfolio

[![CI](https://github.com/01rahulsingh86/playwright-pro-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/01rahulsingh86/playwright-pro-portfolio/actions/workflows/ci.yml)
[![Nightly](https://github.com/01rahulsingh86/playwright-pro-portfolio/actions/workflows/nightly.yml/badge.svg)](https://github.com/01rahulsingh86/playwright-pro-portfolio/actions/workflows/nightly.yml)
![Node](https://img.shields.io/badge/node-20+-brightgreen)
![Playwright](https://img.shields.io/npm/v/%40playwright/test?label=playwright)
![License](https://img.shields.io/badge/license-MIT-informational)

> A **professional Playwright automation portfolio** showcasing E2E, API, visual, accessibility, and advanced testing strategies.  
> Built to demonstrate expertise in modern test automation for companies like **Meta, Microsoft, Amazon, and Netflix**.

---
## 📂 Project Structure
playwright-pro-portfolio/
│
├── src/
│ ├── tests/ # Organized test suites (E2E, API, visual, a11y)
│ ├── pages/ # Page Object Models (POM) for clean abstraction
│ ├── fixtures/ # Fixtures for auth, test data, context reuse
│ ├── utils/ # Helpers for visual testing, schema validation, etc.
│ └── data/ # Test data, JSON files, mocks
│
├── playwright.config.ts # Config: retries, trace, screenshots, projects
├── package.json # NPM scripts for running tests
├── .github/workflows/ # CI pipelines for GitHub Actions
└── README.md


---

## 🚀 Features

- ✅ **Cross-browser testing** (Chromium, Firefox, WebKit, Mobile emulation)  
- ✅ **Page Object Model (POM)** for maintainable and scalable tests  
- ✅ **E2E Tests**: TodoMVC demo, Playwright site navigation  
- ✅ **API Testing**: Validate REST APIs with schema checks  
- ✅ **Visual Regression**: Pixel-perfect UI comparisons with snapshots  
- ✅ **Accessibility Checks**: Axe-core integration to prevent a11y regressions  
- ✅ **Network Mocking**: Stub API responses for deterministic tests  
- ✅ **Auth Fixtures**: Reuse login state to speed up suites  
- ✅ **CI Integration**: GitHub Actions with artifact uploads (reports, traces, screenshots)  
- ✅ **Docker Support**: Run tests in consistent environments  
- ✅ **Tagging System**: Run subsets (`@e2e`, `@api`, `@a11y`, `@visual`)  

---

## 🧑‍💻 Getting Started

### 1. Clone and install
```bash
git clone https://github.com/<YOUR_USER>/<YOUR_REPO>.git
cd playwright-pro-portfolio
npm install



2. Run tests locally

# All tests
npm test

# Run in headed mode (debug)
npm run test:headed

# Use the interactive UI mode
npm run test:ui

# Open the last HTML report
npm run report

3. Run specific groups

npm run e2e      # Only E2E tests
npm run api      # Only API tests
npm run a11y     # Accessibility tests
npm run visual   # Visual regression

📊 CI/CD Integration

Runs automatically on pushes and pull requests

Uploads HTML report + traces as artifacts

Status badge shows live CI state

xample PR workflow

Developer opens PR → CI runs smoke tests

On merge to main → Full test suite runs in parallel

Reports, traces, and snapshots uploaded as artifacts

📸 Visual Regression Example

Visual diffs are stored under src/__snapshots__/.
On failures, CI uploads the actual vs expected images for review.

await expect(page).toHaveScreenshot({
  maxDiffPixelRatio: 0.01
});

♿ Accessibility Example
import { injectAxe, checkA11y } from 'playwright-axe';

test('homepage has no critical a11y issues', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, undefined, {
    includedImpacts: ['critical', 'serious'],
  });
});

🐳 Run in Docker
docker build -t pw-portfolio .
docker run -it --rm pw-portfolio

🎯 Interview Value

This repo demonstrates:

Scalable test architecture (fixtures, POM, utils)

Modern QA practices (visuals, a11y, API+UI contracts, CI/CD)

Cross-browser reliability

Team-ready repo: CI, docs, reporting, Docker

Recruiters and hiring managers can see production-grade Playwright expertise in action.

🔮 Future Enhancements

Add component testing for React/Vue apps

Integrate performance timings (TTI, LCP)

Extend API schema validation using Zod

Introduce flaky test detector via rerun analysis

Add nightly OS/Node matrix CI workflow

📜 License

MIT © Rahul Singh


---

👉 Next steps:
- Replace `<YOUR_USER>/<YOUR_REPO>` with your actual GitHub info.  
- Commit this README.  
- Push → your repo will look **polished and professional**.

---

Would you like me to also **design a sample screenshot/gif demo section** (so your REA