import { expect } from '@playwright/test';
import { test } from '../utils/fixtures';
import { createAuthToken } from '../helpers/createAuthToken';
import { config } from '../api-test.config';

test('Health check endpoint', async ({ api }) => {
  const response = await api.path('/api/healthz').getRequest(200);

  expect(response.msg).toEqual('all good');
});
