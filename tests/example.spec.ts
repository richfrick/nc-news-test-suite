import { expect } from '@playwright/test';
import { test } from '../utils/fixtures';

test('get all articles', async ({ api }) => {
  const response = await api
    .path('/articles')
    .params({ sort_by: 'comment_count' })
    .getRequest(200);

  expect(response.articles[0].comment_count).toEqual(16);
  expect(response.articles.length).toBeGreaterThanOrEqual(37);
});

test('get article', async ({ api }) => {
  const response = await api
    .path('/articles/34')
    .params({ sort_by: 'comment_count' })
    .getRequest(200);

  expect(response.article.title).toEqual(
    'The Notorious MSG’s Unlikely Formula For Success'
  );
});
