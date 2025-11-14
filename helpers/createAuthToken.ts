import { request } from '@playwright/test';
import { APILogger } from '../utils/logger';
import { RequestHandler } from '../utils/request-handler';
import { config } from '../api-test.config';

export async function createAuthToken(email: string, password: string) {
  const context = await request.newContext();
  const logger = new APILogger();
  const api = new RequestHandler(context, config.authService, logger);

  try {
    const tokenResponse = await api
      .path('/api/healthz')
      .body({ users: { email: email, password: password } })
      .getRequest(200);
    return `bearer ${tokenResponse.msg}`;
  } catch (error) {
    if (error instanceof Error) {
      Error.captureStackTrace(error, createAuthToken);
    }
    throw error;
  } finally {
    await context.dispose();
  }
}
