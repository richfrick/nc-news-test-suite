import { ResponseTypes } from '../../types/response-bodies/responseTypes';
import { APILogger } from '../../utils/logger';
import { HttpClient } from './httpClient';

export class RequestHandler<P extends keyof ResponseTypes | string = string> {
  private baseUrl?: string | undefined;
  private requestPath!: string;
  private queryParams: object = {};
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
  path<Path extends keyof ResponseTypes & string>(p: Path) {
    this.requestPath = p;
    return this as unknown as RequestHandler<Path>;
  }
  params(params: object) {
    this.queryParams = params;
    return this;
  }
  headers(headers: Record<string, string>) {
    this.requestHeaders = headers;
    return this;
  }
  body(body: object) {
    this.requestBody = body;
    return this;
  }
  clearAuth() {
    this.clearAuthFlag = true;
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
    this.requestPath = '';
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
    const responseBody = await response.json();

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

  get(status: number) {
    return this.send<
      P extends keyof ResponseTypes ? ResponseTypes[P] : unknown
    >('GET', status);
  }
  post(status: number) {
    return this.send<
      P extends keyof ResponseTypes ? ResponseTypes[P] : unknown
    >('POST', status);
  }
  patch(status: number) {
    return this.send<
      P extends keyof ResponseTypes ? ResponseTypes[P] : unknown
    >('PATCH', status);
  }
  delete(status: number) {
    return this.send<
      P extends keyof ResponseTypes ? ResponseTypes[P] : unknown
    >('DELETE', status);
  }
}
