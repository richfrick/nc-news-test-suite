import { ArticleRequestBody } from '../types/request-bodies/articles/articles';
import { expect } from '@playwright/test';
import { test } from '../utils/fixtures';

test('Retrieve all articles', async ({ api }) => {
  const response = await api
    .path('/api/articles')
    .params({ sort_by: 'comment_count' })
    .get(200);

  expect(response.articles[0].comment_count).toEqual(16);
  expect(response.articles.length).toBeGreaterThanOrEqual(37);
});

// test.fixme('Get articles ordered by topic', async ({ api }) => {});
// test.fixme('Get articles sorted by', async ({ api }) => {});
// test.fixme('Sort Articles in asc order', async ({ api }) => {});
// test.fixme('Sort Articles in desc order', async ({ api }) => {});

// test('Retrieve an article', async ({ api }) => {
//   const response = await api.path('/api/articles/34').get(200);

//   expect(response.article.title).toEqual(
//     'The Notorious MSG’s Unlikely Formula For Success'
//   );
// });

// test('create and delete article', async ({ api }) => {
//   const articleBody: ArticleRequestBody = {
//     author: 'tickle122',
//     title: 'test title',
//     body: 'test body',
//     topic: 'football',
//     article_img_url:
//       'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700',
//   };
//   const createArticleResponse = await api
//     .path('/api/articles')
//     .body(articleBody)
//     .post(201);

//   expect(createArticleResponse.article.article_id).toBeGreaterThanOrEqual(0);

//   await api
//     .path(`/api/articles/${createArticleResponse.article.article_id}`)
//     .deleteRequest(204);

//   const getDeletedArticle = await api
//     .path(`/api/articles/${createArticleResponse.article.article_id}`)
//     .getRequest(404);

//   expect(getDeletedArticle.msg).toEqual(
//     `Not Found: article_id ${createArticleResponse.article.article_id}`
//   );
// });

// test.fixme('Up vote article', async ({ api }) => {});
// test.fixme('down vote article', async ({ api }) => {});
// test.fixme('Add comment to article', async ({ api }) => {});
// test.fixme('Delete comment to article', async ({ api }) => {});
