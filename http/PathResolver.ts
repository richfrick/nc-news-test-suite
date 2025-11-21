import { ResponseTypes } from '../types/response-bodies/responseTypes';

/**
 * Break a path into segments (at compile time)
 */
type Segments<P extends string> = P extends ''
  ? []
  : P extends `/${infer Rest}`
    ? Segments<Rest>
    : P extends `${infer Head}/${infer Tail}`
      ? [Head, ...Segments<Tail>]
      : [P];

/**
 * Check if a segment is a dynamic param segment
 */
type IsDynamic<S extends string> = S extends `:${string}` ? true : false;

/**
 * Resolve concrete segment into pattern segment
 * - numeric → parameter
 * - any string where schema says ":param" should match
 */
type MatchSegment<C extends string, P extends string> =
  IsDynamic<P> extends true ? P : C extends P ? P : never;

// Recursively ensure all segments match
type SegmentsMatch<
  CSegs extends string[],
  PSegs extends string[],
> = CSegs extends [infer CHead extends string, ...infer CTail extends string[]]
  ? PSegs extends [infer PHead extends string, ...infer PTail extends string[]]
    ? MatchSegment<CHead, PHead> extends never
      ? false
      : SegmentsMatch<CTail, PTail>
    : false
  : PSegs extends []
    ? true
    : false;

// Now define MatchPath using SegmentsMatch
type MatchPath<Concrete extends string, Pattern extends string> =
  SegmentsMatch<Segments<Concrete>, Segments<Pattern>> extends true
    ? Pattern
    : never;

/**
 * Resolve a concrete path into the pattern key from ApiTypes
 */
export type ResolvePath<P extends string> = {
  [K in keyof ResponseTypes]: K extends string
    ? MatchPath<P, K> extends never
      ? never
      : K
    : never;
}[keyof ResponseTypes];
