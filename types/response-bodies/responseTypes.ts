import { GETArticleSchema } from './articles/GET_article_schema';
import { GETArticlesSchema } from './articles/GET_articles_schema';
import { ArticleRequestBody } from '../request-bodies/articles/articles';
import { GETHealthzSchema } from './healthz/GET_healthz_schema';

export interface ResponseTypes {
  '/api/articles': {
    GET: {
      response: GETArticlesSchema;
      query: { topic?: string; sort_by?: string; order?: string };
    };
    POST: {
      response: GETArticleSchema;
      body: ArticleRequestBody;
    };
  };
  '/api/articles/:article_id': {
    GET: { response: GETArticleSchema; query: {} };
    DELETE: { response: null; query: {} };
  };
  '/api/healthz': {
    GET: { response: GETHealthzSchema; query: {} };
  };
  //   '/api/articles/:article_id/comments': {
  //     response: GETArticleSchema;
  //     query: {};
  //   };
  //   '/api/articles/:article_id/comments/:comment_id': {
  //     response: GETArticleSchema;
  //     query: {};
  //   };
}
