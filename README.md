# automation-test-suite

## Table of contents

- [About](#-about)
- [Pre-requsites](#-pre-requsites)
- [Getting started](#-getting-started)
- [Useful info](#-useful-info)

## 🚀 About

This is a custom framework to conduct api tests

## 📝 Pre-requsites

Min Versions

- [node](https://nodejs.org/en/download) - built using v24.10.0
- [playwright](https://playwright.dev/docs/intro#installing-playwright) built using v1.56.1

## 📚 Getting started

You can use the test suite as a basis to write API tests for your application. It can handle multiple environments via .env files

1. Clone the repo

   > git clone https://github.com/richfrick/nc-news-test-suite

2. Run

   > npm ci

3. Create a file called _.env.dev_ and create the url for the app under test

   > ENV=dev

   > APP_URL=http://localhost:9090

4. Update. api-test.config.ts to set your environment variables and ensure they are set properly

5. Write tests, they are broken down and run in the following order Schema Validation, Smoke tests then everything else

6. Run tests, it will set ENV as dev by default

   > npx playwright test

   OR

   > ENV=Staging npx playwright test

## 📜 Schema Validation

There is also schema validation courtecy of the [AJV Schema validator](https://ajv.js.org/). For the moment this only works for JSON schema validtion but can be extended should it be required.

it uses a custom logger and matcher to output a clear message on failure into the terminal and playwright-reports.

### Running Schema Tests

these will run as part of the full suite but to run these in isolation simply

```
npx playwright test --project schema-validation
```

**Naming convention**

all schema tests should be named **_schema-name_**.schema.spec.ts to allow the project runner to pick it up

### Schema Generation

As part of the schema validation process we need the ability to generate AND update the schemas should they change.

This can be done by updating the shouldMatchSchema custom matcher with the optional createSchemaFlag to true. Remember to remove this after you have run the test to create the schema otherwise subsequent test runs will only create the schema and not run the test.

```ts
test('Validate GET articles schema', async ({ api }) => {
  const response = await api.path(`/api/articles`).getRequest(200);

  await expect(response).shouldMatchSchema('articles', 'GET_articles', true);
});
```

the example above will create the schema for the GET_articles request and save it in the articles folder

## 🤝 Useful Info

**Running Tests**

1. to run a specific test file you can run

   > npx playwright test -g your-file.spec.ts

2. If you want to change the order of tests of just change you can change the projects section in playwright.config.ts

   ```ts
   projects: [
     {
       name: 'schema-validation',

       testMatch: '*schema.spec.ts',
     },
     {
       name: 'smoke-tests',
       testMatch: '*schema.spec.ts',
       dependencies: ['schema-validation'],
     },
   ];
   ```

**Writing tests**

**_Authentication_**

1. The `createAuthToken()` helper assumes a username and password is needed when authenticating (e.g. logging into an app). It could just as easily be keys, if this is the case add them to your.env and update the function to pass keys in the header instead.

2. The `Authorization` header is automatically set when tests a run and used unless you pass your own auth token when making a request.

3. You can generate auth tokens on an adhoc basis by using `helpers > createAuthToken` and setting the `Authorization: ` header when setting .headers() in the request.

**POST Requests**

For post requests use the type from the types directory. These are the templates for the request body and remove the need to check what should be in the request body as well as enforcing the correct type for each key value pair.

e.g.

```ts
const articleBody: ArticleRequestBody = {
  author: 'tickle122',
  title: 'test title',
  body: 'test body',
  topic: 'football',
  article_img_url:
    'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700',
};
const createArticleResponse = await api
  .path('/api/articles')
  .body(articleBody)
  .postRequest(201);
```

all of the types are auto generated from the contents of schemas > request-schemas directory

**Types Generation**

The contents of types are generated from the contents of schemas > request-schemas by running

> npm run generate:types

the request-schemas are maintained maually rather than auto generated from the response-schemas given they are used a template for HTTP request bodies changes here can have a significant impact on spec files.
