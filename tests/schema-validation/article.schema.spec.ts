import { ArticleRequestBody } from '../../types/request-bodies/articles/articles';
import { expect } from '../../utils/custom-expect';
import { test } from '../../utils/fixtures';

test('health endpoint', async ({ api }) => {
  const response = await api.path('/api/healthz').get(200);

  await expect(response).shouldMatchSchema('healthz', 'GET_healthz');
});

test('Validate GET articles schema', async ({ api }) => {
  const response = await api.path(`/api/articles`).get(200);

  await expect(response).shouldMatchSchema('articles', 'GET_articles');
});

test('Validate POST articles schema', async ({ api }) => {
  const requestBody: ArticleRequestBody = {
    author: 'tickle122',
    body: 'test body',
    title: 'test title',
    topic: 'football',
    article_img_url:
      'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700',
  };

  const response = await api.path('/api/articles').body(requestBody).post(201);

  await expect(response).shouldMatchSchema('articles', 'POST_articles');
  await api.path(`/api/articles/${response.article.article_id}`).delete(204);
});

test('Validate get Article schema', async ({ api }) => {
  const requestBody: ArticleRequestBody = {
    author: 'tickle122',
    body: 'test body',
    title: 'test title',
    topic: 'football',
    article_img_url:
      'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700',
  };

  const {
    article: { article_id },
  } = await api.path('/api/articles').body(requestBody).post(201);

  const getNewArticle = await api.path(`/api/articles/${article_id}`).get(200);
  await expect(getNewArticle).shouldMatchSchema('articles', 'GET_article');
  await api.path(`/api/articles/${article_id}`).delete(204);
});
