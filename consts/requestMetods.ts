export const REQUEST_METHOD = {
  get: 'GET',
  post: 'POST',
  patch: 'PATCH',
  delete: 'DELETE',
} as const;
export type Request_Method =
  (typeof REQUEST_METHOD)[keyof typeof REQUEST_METHOD];
