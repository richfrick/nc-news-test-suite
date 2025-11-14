import { APIRequestContext, expect } from '@playwright/test';
import { APILogger } from './logger';
import { REQUEST_METHOD } from '../consts/requestMetods';

export class RequestHandler {
  private request: APIRequestContext;
  private logger: APILogger;
  private baseUrl: string | undefined;
  private defaultBaseUrl: string;
  private apiPath!: string;
  private queryParams: object = {};
  private apiHeaders: Record<string, string> = {};
  private apiBody: object = {};
  private defaultAuthToken: string;
  private clearAuthFlag: boolean = false;

  constructor(
    request: APIRequestContext,
    apiBaseUrl: string,
    logger: APILogger,
    authToken: string = ''
  ) {
    this.request = request;
    this.defaultBaseUrl = apiBaseUrl;
    this.logger = logger;
    this.defaultAuthToken = authToken;
  }

  url(url: string) {
    this.baseUrl = url;
    return this;
  }
  path(path: string) {
    this.apiPath = path;
    return this;
  }
  params(params: object) {
    this.queryParams = params;
    return this;
  }
  headers(headers: Record<string, string>) {
    this.apiHeaders = headers;
    return this;
  }
  body(body: object) {
    this.apiBody = body;
    return this;
  }

  async getRequest(statusCode: number) {
    const url = this.getUrl();
    this.logger.logRequest(REQUEST_METHOD.get, url, this.getHeaders());
    const response = await this.request.get(url, {
      headers: this.getHeaders(),
    });

    this.cleanupFields();
    const actualStatus = response.status();
    const responseJSON = await response.json();

    this.logger.logResponse(actualStatus, responseJSON);
    this.statusCodeValidator(actualStatus, statusCode, this.getRequest);

    return responseJSON;
  }

  async patchRequest(statusCode: number) {
    const url = this.getUrl();
    this.logger.logRequest(
      REQUEST_METHOD.patch,
      url,
      this.getHeaders(),
      this.apiBody
    );
    const response = await this.request.patch(url, {
      headers: this.getHeaders(),
      data: this.apiBody,
    });

    this.cleanupFields();
    const actualStatus = response.status();
    const responseJSON = await response.json();

    this.logger.logResponse(actualStatus, responseJSON);
    this.statusCodeValidator(actualStatus, statusCode, this.patchRequest);

    return responseJSON;
  }

  async postRequest(statusCode: number) {
    const url = this.getUrl();
    this.logger.logRequest(
      REQUEST_METHOD.post,
      url,
      this.getHeaders(),
      this.apiBody
    );
    const response = await this.request.post(url, {
      headers: this.getHeaders(),
      data: this.apiBody,
    });

    this.cleanupFields();
    const actualStatus = response.status();
    const responseJSON = await response.json();

    this.logger.logResponse(actualStatus, responseJSON);
    this.statusCodeValidator(actualStatus, statusCode, this.postRequest);

    return responseJSON;
  }

  async deleteRequest(statusCode: number) {
    const url = this.getUrl();
    this.logger.logRequest(REQUEST_METHOD.delete, url, this.getHeaders());
    const response = await this.request.delete(url, {
      headers: this.getHeaders(),
    });

    this.cleanupFields();
    const actualStatus = response.status();

    this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest);
  }

  private getUrl() {
    const url = new URL(
      `${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`
    );
    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, value);
    }
    return url.toString();
  }

  clearAuth() {
    this.clearAuthFlag = true;
    return this;
  }

  private cleanupFields() {
    this.apiBody = {};
    this.apiHeaders = {};
    this.baseUrl = undefined;
    this.apiPath = '';
    this.queryParams = {};
    this.clearAuthFlag = false;
  }

  private getHeaders() {
    if (!this.clearAuthFlag) {
      this.apiHeaders['Authorization'] =
        this.apiHeaders['Authorization'] || this.defaultAuthToken;
    }
    return this.apiHeaders;
  }

  private statusCodeValidator(
    actualStatus: number,
    expectedStatus: number,
    callingMethod: Function
  ) {
    if (actualStatus !== expectedStatus) {
      const logs = this.logger.getRecentLogs();
      const error = new Error(
        `Expected status ${expectedStatus} but got ${actualStatus}\n\nRecent API Activity: \n${logs}`
      );
      Error.captureStackTrace(error, callingMethod);
      throw error;
    }
  }
}
