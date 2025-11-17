import { expect } from '../../utils/custom-expect';
import { test } from '../../utils/fixtures';

test('validate articles schema', async ({ api }) => {
  const response = await api.path(`/api/articles`).getRequest(200);

  await expect(response).shouldMatchSchema('articles', 'GET_articles');
});
