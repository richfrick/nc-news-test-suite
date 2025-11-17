import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['list']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',
    //default headers you want to use for all api requests (NOTE: these cannot be altered during execution extraHTTPHeaders are for life not just christmas)
    //extraHTTPHeaders: {},
    //if your application uses basic authorization set the details here
    // httpCredentials:{
    //   username: '',
    //   password: ''
    // },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'schema-validation',

      testMatch: '*schema.spec.ts',
    },
    {
      name: 'smoke-tests',
      testMatch: '*schema.spec.ts',
      dependencies: ['schema-validation'],
    },
    {
      name: 'api-testing',
      dependencies: ['smoke-tests'],
      // use:{
      //   extraHTTPHeaders:{
      //   }
      // }
    },
  ],
});
