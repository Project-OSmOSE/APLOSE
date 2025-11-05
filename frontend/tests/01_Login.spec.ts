import { essential, ESSENTIAL, expect, test } from './utils';
import { interceptRequests, PASSWORD } from './utils/mock';
import { TOKEN_ERROR } from './utils/mock/auth';
import type { UserType } from './utils/mock/types';

type MethodParams = {
  as: UserType,
  method: 'mouse' | 'shortcut'
}

// Utils
const user: UserType = 'annotator'
const TEST = {
  canLogin: ({ as, method }: MethodParams) =>
    test(`Can login as ${ as } using ${ method }`, { tag: essential }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        token: 'success',
      })

      await page.login.go();

      await page.login.fillForm({ as });
      const request = await page.login.submit('button');
      expect(await request.postDataJSON()).toEqual({
        username: as,
        password: PASSWORD,
      })
      await expect(page.getByRole('heading', { name: 'Annotation Campaigns' })).toBeVisible();
    }),
}

// Tests

test.describe('[Login] Visitor', () => {
  const as: UserType = 'annotator'

  test(`Can login as ${ as }`, { tag: essential }, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: as,
      token: 'success',
    })

    await page.login.go();
    await page.login.fillForm({ as });
    const request = await page.login.submit('button');
    expect(await request.postDataJSON()).toEqual({
      username: as,
      password: PASSWORD,
    })
    await expect(page.getByRole('heading', { name: 'Annotation Campaigns' })).toBeVisible();
  })

  test('Can see errors on failed submit', { tag: essential }, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: as,
      token: 'forbidden',
    })

    await page.login.go();
    await page.login.fillForm({ as });
    await page.login.submit('button');
    await expect(page.getByText(TOKEN_ERROR)).toBeVisible();
  })
})

test('Login - Success with Enter key', ESSENTIAL, async ({ page }) => {
  await interceptRequests(page, {
    getCurrentUser: user,
    token: 'success',
  })

  await page.login.go();
  await page.login.fillForm({ as: user });
  const request = await page.login.submit('enterKey');
  expect(await request.postDataJSON()).toEqual({
    username: user,
    password: PASSWORD,
  })
  await expect(page.getByRole('heading', { name: 'Annotation Campaigns' })).toBeVisible();
})
