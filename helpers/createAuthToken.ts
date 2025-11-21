import { request } from '@playwright/test';
import { APILogger } from '../utils/logger';
import { RequestHandler } from '../http/requestHandler';
import { config } from '../api-test.config';
import { PlaywrightHttpClient } from '../http/playwrightHttpClient';

export async function createAuthToken(email: string, password: string) {
  const context = await request.newContext();
  const logger = new APILogger();
  const http = new PlaywrightHttpClient(context);
  const api = new RequestHandler(http, config.authService, logger);

  try {
    /********************************************************************************************/
    /* Use this when you need to make a request to an actual service in order to obtain a token */
    /********************************************************************************************/
    // const tokenResponse = await api
    //   .path('/api/auth/login')
    //   .body({ users: { email: email, password: password } })
    //   .get(200);
    return `bearer ou43rh934hr9834h9t87h304uh032uhgf939g8h`;
  } catch (error) {
    if (error instanceof Error) {
      Error.captureStackTrace(error, createAuthToken);
    }
    throw error;
  } finally {
    await context.dispose();
  }
}
