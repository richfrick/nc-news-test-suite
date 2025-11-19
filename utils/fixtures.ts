import { test as base } from '@playwright/test';

import { APILogger } from './logger';
import { config } from '../api-test.config';
import { createAuthToken } from '../helpers/createAuthToken';
import { setCustomExpectLogger } from './custom-expect';
import { PlaywrightHttpClient } from './api-requests/playwrightHttpClient';
import { RequestHandler } from './api-requests/requestHandler';

export type TestOpions = {
  api: RequestHandler;
  config: typeof config;
};

export type WorkerFixture = {
  authToken: string;
};

export const test = base.extend<TestOpions, WorkerFixture>({
  authToken: [
    async ({}, use) => {
      const authToken = await createAuthToken(config.email, config.password);
      await use(authToken);
    },
    { scope: 'worker' },
  ],

  api: async ({ request, authToken }, use) => {
    const logger = new APILogger();
    setCustomExpectLogger(logger);
    const http = new PlaywrightHttpClient(request);
    const requestHandler = new RequestHandler(
      http,
      config.appUrl,
      logger,
      authToken
    );
    await use(requestHandler);
  },
  config: async ({}, use) => {
    await use(config);
  },
});
