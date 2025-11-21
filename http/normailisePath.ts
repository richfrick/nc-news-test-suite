import { ResponseTypes } from '../types/response-bodies/responseTypes';

/**
 * At runtime we can only use regex patterns.
 * You maintain this list in parallel with the ApiTypes keys.
 */
const dynamicRouteMatchers: [RegExp, keyof ResponseTypes][] = [
  [/^\/api\/articles\/([^/]+)$/, '/api/articles/:article_id'],
  //   [
  //     /^\/api\/articles\/([^/]+)\/comments$/,
  //     '/api/articles/:article_id/comments',
  //   ],
  //   [
  //     /^\/api\/articles\/([^/]+)\/comments\/([^/]+)$/,
  //     '/api/articles/:article_id/comments/:comment_id',
  //   ],
];

export function normalizePath(path: string): keyof ResponseTypes | string {
  for (const [regex, pattern] of dynamicRouteMatchers) {
    if (regex.test(path)) return pattern;
  }
  return path;
}
