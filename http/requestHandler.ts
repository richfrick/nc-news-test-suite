import { APILogger } from '../utils/logger';
import { HttpClient } from './httpClient';
import type { MethodResponse, MethodBody, MethodQuery } from './types';

export class RequestHandler<P extends string = string> {
  private baseUrl?: string | undefined;
  private requestPath!: P;
  private queryParams: Record<string, any> = {};
  private requestHeaders: Record<string, string> = {};
  private requestBody: object = {};
  private clearAuthFlag: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private defaultBaseUrl: string,
    private logger: APILogger,
    private defaultAuthToken: string = ''
  ) {}

  url(url: string) {
    this.baseUrl = url;
    return this;
  }
  path<Path extends string>(p: Path) {
    this.requestPath = p as any;
    return this as unknown as RequestHandler<Path>;
  }

  params(this: RequestHandler<P>, params: MethodQuery<P>) {
    this.queryParams = params as Record<string, any>;
    return this;
  }
  headers(headers: Record<string, string>) {
    this.requestHeaders = headers;
    return this;
  }
  body(this: RequestHandler<P>, b: MethodBody<P, 'POST' | 'PATCH'>) {
    this.requestBody = b as object;
    return this;
  }

  private getHeaders() {
    if (!this.clearAuthFlag) {
      this.requestHeaders['Authorization'] =
        this.requestHeaders['Authorization'] || this.defaultAuthToken;
    }
    return this.requestHeaders;
  }

  private buildUrl() {
    const url = new URL(
      `${this.baseUrl ?? this.defaultBaseUrl}${this.requestPath}`
    );
    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, value);
    }
    return url.toString();
  }

  private cleanup() {
    this.requestBody = {};
    this.requestHeaders = {};
    this.baseUrl = undefined;
    this.requestPath = '' as P;
    this.queryParams = {};
    this.clearAuthFlag = false;
  }

  private async send<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    expectedStatus: number
  ): Promise<T> {
    const url = this.buildUrl();
    const headers = this.getHeaders();

    this.logger.logRequest(method, url, headers, this.requestBody);

    const response = await this.httpClient.request(method, url, {
      headers,
      body: ['POST', 'PATCH'].includes(method) ? this.requestBody : undefined,
    });
    const responseStatus = response.status;
    let responseBody: any = null;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = null;
    }

    this.logger.logResponse(responseStatus, responseBody);
    this.cleanup();

    if (responseStatus !== expectedStatus) {
      const logs = this.logger.getRecentLogs();
      const error = new Error(
        `Expected status ${expectedStatus} but got ${responseStatus}\n\nRecent API Activity: \n${logs}`
      );
      Error.captureStackTrace(error, this.send);
      throw error;
    }
    return responseBody as T;
  }

  get(this: RequestHandler<P>, status: number) {
    return this.send<MethodResponse<P, 'GET'>>('GET', status);
  }

  post(this: RequestHandler<P>, status: number) {
    return this.send<MethodResponse<P, 'POST'>>('POST', status);
  }

  patch(this: RequestHandler<P>, status: number) {
    return this.send<MethodResponse<P, 'PATCH'>>('PATCH', status);
  }

  delete(this: RequestHandler<P>, status: number) {
    return this.send<MethodResponse<P, 'DELETE'>>('DELETE', status);
  }
}
