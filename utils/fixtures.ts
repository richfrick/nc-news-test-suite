import { test as base } from '@playwright/test';
import { RequestHandler } from './request-handler';

export type TestOpions = {
  api: RequestHandler;
};

export const test = base.extend<TestOpions>({
  api: async ({ request }, use) => {
    const baseUrl = 'http://localhost:9090/api';
    const requestHandler = new RequestHandler(request, baseUrl);
    await use(requestHandler);
  },
});
