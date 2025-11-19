import { APIRequestContext } from '@playwright/test';
import { HttpClient } from './httpClient';

export class PlaywrightHttpClient implements HttpClient {
  constructor(private ctx: APIRequestContext) {}

  async request(method: string, url: string, options: any) {
    const response = await this.ctx.fetch(url, {
      method,
      headers: options?.headers,
      data: options?.body,
    });

    return {
      status: response.status(),
      json: () => response.json(),
    };
  }
}
