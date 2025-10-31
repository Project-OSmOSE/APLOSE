import { Page, type Route } from 'playwright-core';
import { GQL_MOCK, type GqlOperations } from './_gql';
import { REST_MOCK, type RestOperations } from './_rest';

export * from './_types'
export * from './user'


type Operations = GqlOperations & RestOperations;

export const gqlURL = '**/graphql'

export async function interceptRequests(
  page: Page,
  operations: Operations,
): Promise<{ [key in keyof Operations]?: Record<string, unknown> }> {
  // A list of GQL variables which the handler has been called with.
  const reqs: { [key in keyof Operations]?: Record<string, unknown> } = {};

  // Register a new handler which intercepts all GQL requests.
  await page.route(gqlURL, function (route: Route) {
    const req = route.request().postDataJSON();

    if (!Object.keys(operations).includes(req.operationName)) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: GQL_MOCK[req.operationName][GQL_MOCK[req.operationName].defaultType] }),
      });
    }

    // Store what variables we called the API with.
    reqs[req.operationName] = req.variables;

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: GQL_MOCK[req.operationName][operations[req.operationName]] }),
    });
  });

  for (const [ key, _mock ] of Object.entries(REST_MOCK)) {
    const isKnown = Object.keys(operations).includes(key)
    const mock = isKnown ? _mock[operations[key]] : _mock.success;
    if (isKnown) {
      console.debug('will intercept known', _mock.url)
      await page.route(_mock.url, route => {
        reqs[key] = route.request().postDataJSON();
        return route.fulfill(mock)
      });
    } else {
      console.debug('will intercept', _mock.url, mock)
      page.route(new RegExp(_mock.url), route => route.fulfill(mock));
    }
  }

  return reqs;
}
