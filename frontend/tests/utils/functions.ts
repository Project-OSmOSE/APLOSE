import { errors, expect } from './fixture';
import { Page, Request, Route } from 'playwright-core';
import { MOCK, MockType, QueryName } from "./services";

// https://github.com/microsoft/playwright/issues/13284#issuecomment-2299013936
export async function expectNoRequestsOnAction(page: Page,
                                               action: () => Promise<any>,
                                               urlOrPredicate: string | RegExp | ((request: Request) => boolean | Promise<boolean>)) {
  const requestPromise = page.waitForRequest(urlOrPredicate, { timeout: 1000 });
  await action();
  await requestPromise
    .then(() => {
      throw new Error('Request was sent');  // Oops
    })
    .catch((error => {
      if (error instanceof errors.TimeoutError) return;  // Success
      throw error;  // Throw other errors
    }));
}

export async function selectInAlert(page: Page, item: string) {
  const modal = page.getByRole('dialog')
  await expect(modal).toBeVisible();
  await modal.getByText(item).click();
  await modal.getByRole('button', { name: 'Ok' }).click();
}


/// https://www.jayfreestone.com/writing/stubbing-graphql-playwright/
// GQL variables the request was called with.
// Useful to validate the API was called correctly.
type CalledWith = Record<string, unknown>;

// Registers a client-side interception to our BFF (presumes all `graphql`
// requests are to us). Interceptions are per-operation, so multiple can be
// registered for different operations without overwriting one-another.
type Operations = {
  [key in QueryName]: MockType
}

export async function interceptGQL(
  page: Page,
  operations: Operations,
  times: number = Object.keys(operations).length
): Promise<CalledWith[]> {
  // A list of GQL variables which the handler has been called with.
  const reqs: CalledWith[] = [];

  // Register a new handler which intercepts all GQL requests.
  await page.route('**/graphql', function (route: Route) {
    const req = route.request().postDataJSON();

    // Pass along to the previous handler in the chain if the request
    // is for a different operation.
    if (!Object.keys(operations).includes(req.operationName)) {
      return route.fallback();
    }

    // Store what variables we called the API with.
    reqs.push(req.variables);

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: MOCK[req.operationName][operations[req.operationName]] }),
    });
  }, { times });

  return reqs;
}