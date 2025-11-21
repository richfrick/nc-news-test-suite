export interface HttpClient {
  request(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    url: string,
    options?: {
      headers?: Record<string, string>;
      body?: any;
    }
  ): Promise<{ status: number; json: () => Promise<any> }>;
}
