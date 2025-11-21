import { ResponseTypes } from '../types/response-bodies/responseTypes';
import { ResolvePath } from './PathResolver';

type Resolved<P extends string> = ResolvePath<P> & keyof ResponseTypes;
/**
 * Extract the response type for a given path + method.
 */
export type MethodResponse<
  P extends string,
  M extends 'GET' | 'POST' | 'PATCH' | 'DELETE',
> =
  Resolved<P> extends infer K
    ? K extends keyof ResponseTypes
      ? M extends keyof ResponseTypes[K]
        ? ResponseTypes[K][M] extends { response: infer R }
          ? R
          : never // if you forget "response" in schema
        : never // if that method doesn't exist for this path
      : never
    : never;

/**
 * Extract the query params for a given path.
 * Only GET endpoints have query params.
 */
export type MethodQuery<P extends string> =
  Resolved<P> extends infer K
    ? K extends keyof ResponseTypes
      ? ResponseTypes[K]['GET'] extends { query: infer Q }
        ? Q
        : never // no query defined -> can't call .params()
      : never
    : never;

/**
 * Extract the request body for POST/PATCH methods.
 */
export type MethodBody<P extends string, M extends 'POST' | 'PATCH'> =
  Resolved<P> extends infer K
    ? K extends keyof ResponseTypes
      ? M extends keyof ResponseTypes[K]
        ? ResponseTypes[K][M] extends { body: infer B }
          ? B
          : never // method exists but no body defined
        : never // method doesn't exist
      : never
    : never;
