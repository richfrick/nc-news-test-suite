import { expect } from '../../utils/custom-expect';
import { test } from '../../utils/fixtures';

test('Validate GET articles schema', async ({ api }) => {
  const response = await api.path(`/api/articles`).getRequest(200);

  await expect(response).shouldMatchSchema('articles', 'GET_articles');
});

test('Validate POST articles schema', async ({ api }) => {
  const response = await api
    .path('/api/articles')
    .body({
      author: 'tickle122',
      title: 'test title',
      body: 'test body',
      topic: 'football',
      article_img_url:
        'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700',
    })
    .postRequest(201);

  await expect(response).shouldMatchSchema('articles', 'POST_articles');
  await api
    .path(`/api/articles/${response.article.article_id}`)
    .deleteRequest(204);
});

test('Validate get Article schema', async ({ api }) => {
  const {
    article: { article_id },
  } = await api
    .path('/api/articles')
    .body({
      author: 'tickle122',
      title: 'test title',
      body: 'test body',
      topic: 'football',
      article_img_url:
        'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700',
    })
    .postRequest(201);

  const getNewArticle = await api
    .path(`/api/articles/${article_id}`)
    .getRequest(200);
  await expect(getNewArticle).shouldMatchSchema('articles', 'GET_article');
  await api.path(`/api/articles/${article_id}`).deleteRequest(204);
});
