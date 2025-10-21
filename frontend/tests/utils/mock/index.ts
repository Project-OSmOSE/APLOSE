import { Page, type Route } from 'playwright-core';
import { GQL_MOCK, type GqlOperations } from './_gql';
import { REST_MOCK, type RestOperations } from './_rest';

export * from './_types'
export * from './user'


type Operations = GqlOperations | RestOperations;

export async function interceptRequests(
  page: Page,
  operations: Operations,
): Promise<Record<string, unknown>[]> {
  // A list of GQL variables which the handler has been called with.
  const reqs: Record<string, unknown>[] = [];

  // Register a new handler which intercepts all GQL requests.
  await page.route('**/graphql', function (route: Route) {
    const req = route.request().postDataJSON();

    if (!Object.keys(operations).includes(req.operationName)) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: GQL_MOCK[req.operationName].filled }),
      });
    }

    // Store what variables we called the API with.
    reqs.push(req.variables);

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: GQL_MOCK[req.operationName][operations[req.operationName]] }),
    });
  });

  for (const [ key, _mock ] of Object.entries(REST_MOCK)) {
    const mock = key in Object.keys(operations) ? _mock[operations[key]] : _mock.filled;
    page.route(mock.url, route => route.fulfill(mock));
  }

  return reqs;
}
