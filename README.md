# automation-test-suite

## Table of contents

- [About](#-about)
- [Pre-requsites](#-pre-requsites)
- [Getting started](#-getting-started)
- [Useful info](#-useful-info)

## 🚀 About

This is a custom framework to conduct api tests

## 📝 Pre-requsites

Min Versions

- [node](https://nodejs.org/en/download) - built using v24.10.0
- [playwright](https://playwright.dev/docs/intro#installing-playwright) built using v1.56.1

## 📚 Getting started

You can use the test suite as a basis to write API tests for your application. It can handle multiple environments via .env files

1. Clone the repo

   > git clone https://github.com/richfrick/nc-news-test-suite

2. Run

   > npm ci

3. Create a file called _.env.dev_ and create the url for the app under test

   > ENV=dev

   > APP_URL=http://localhost:9090

4. Update. api-test.config.ts to set your environment variables and ensure they are set properly

5. Write tests, they are broken down and run in the following order Schema Validation, Smoke tests then everything else

6. Run tests, it will set ENV as dev by default

   > npx playwright test

   OR

   > ENV=Staging npx playwright test

## 🤝 Useful Info

**Running Tests**

1. to run a specific test file you can run

   > npx playwright tests -g your-file.spec.ts

2. If you want to change the order of tests of just change you can change the projects section in playwright.config.ts

   ```ts
   projects: [
     {
       name: 'schema-validation',
       testMatch: 'schema*',
     },
     {
       name: 'smoke-tests',
       testMatch: 'smoke*',
       dependencies: ['schema-validation'],
     },
   ];
   ```

**Writing tests**

**_Authentication_**

1. You can generate auth tokens on an adhoc basis by using `helpers > createAuthToken`. When the tests run it will automatically generate an auth token and uses this for all api calls unless you pass your own auth token.
