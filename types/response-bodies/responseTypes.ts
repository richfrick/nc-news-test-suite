import { GETArticlesSchema } from './articles/GET_articles_schema';

export interface ResponseTypes {
  '/api/articles': GETArticlesSchema;
}
