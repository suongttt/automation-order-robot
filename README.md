# Robot Spare Bin Playwright Tests

Automation test project for RobotSpareBin Industries using Playwright, Page Object Model, Excel test data, and `.env` credentials.

## Tech Stack

- Playwright Test
- TypeScript
- XLSX for reading Excel data
- Page Object Model

## Project Structure

```text
.
├── data/
│   └── order.xlsx
├── pages/
│   ├── login.page.ts
│   └── order.page.ts
├── tests/
│   ├── login.spec.ts
│   └── order.spec.ts
├── utils/
│   ├── env.ts
│   └── order-data.ts
├── screenshots/
├── .env.example
└── playwright.config.ts
```

## Setup

Install dependencies:

```bash
npm install
```

Install Playwright browsers if needed:

```bash
npx playwright install
```

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Update credentials in `.env`:

```env
ROBOT_USERNAME=maria
ROBOT_PASSWORD=thoushallnotpass
ROBOT_INVALID_PASSWORD=wrongpassword
```

## Test Data

Order data is read dynamically from:

```text
data/order.xlsx
```

Expected columns:

```text
Order No | Head | Body | Legs | Address
```

Each row in the Excel file creates one order test case.

## Run Tests And Reports

Run all tests:

```bash
npm test
```

Run with list reporter:

```bash
npx playwright test --reporter=list
```

Generate Playwright HTML report:

```bash
npm run test:html
```

View Playwright HTML report:

```bash
npm run report:html
```

Generate Allure results:

```bash
npm run test:allure
```

Generate Playwright HTML report and Allure results in one run:

```bash
npm run test:reports
```

Generate Allure HTML report:

```bash
npm run report:allure
```

Open Allure report:

```bash
npm run report:allure:open
```

Run tests, generate Allure report, and zip artifacts:

```bash
npm run report:all
```

Zip screenshots and results only:

```bash
npm run zip:results
```

## Browser Config

Tests run on one browser project only:

```text
chrome
```

The project is configured in `playwright.config.ts` with:

- `workers: 1`
- `headless: true`
- `testIgnore: ['**/example.spec.ts']`

## Retry On Order Failure

Order submit uses retry logic in `pages/order.page.ts`.

Flow:

1. Click `Order`.
2. Wait for either receipt success or failure alert.
3. If order fails, retry again.
4. Stop when receipt is visible or max retry attempts are reached.

Default retry count:

```text
5 attempts
```

## Screenshots

For every successful order, the test expects the receipt to be visible and captures a screenshot.

Screenshots are saved to:

```text
screenshots/
```

Example output:

```text
screenshots/order-1.png
screenshots/order-2.png
```

Zipped artifacts are saved to:

```text
reports/test-artifacts.zip
```

## Naming Convention

File names use lowercase:

```text
login.page.ts
order.page.ts
```

Classes use PascalCase:

```ts
LoginPage
OrderPage
```
