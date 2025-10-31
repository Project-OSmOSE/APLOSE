import { ESSENTIAL, expect, test } from './utils';
import { interceptRequests, PASSWORD } from './utils/mock';
import { TOKEN_ERROR } from './utils/mock/auth';
import type { UserType } from './utils/mock/types';

const user: UserType = 'annotator'

test('Login - Unauthorized', ESSENTIAL, async ({ page }) => {
  await interceptRequests(page, {
    getCurrentUser: user,
    token: 'forbidden',
  })

  await page.login.go();
  await page.login.fillForm(user);
  await page.login.submit('button');
  await expect(page.getByText(TOKEN_ERROR)).toBeVisible();
})

test('Login - Success', ESSENTIAL, async ({ page }) => {
  await interceptRequests(page, {
    getCurrentUser: user,
    token: 'success',
  })

  await page.login.go();
  await page.login.fillForm(user);
  const request = await page.login.submit('button');
  expect(await request.postDataJSON()).toEqual({
    username: user,
    password: PASSWORD,
  })
  await expect(page.getByRole('heading', { name: 'Annotation Campaigns' })).toBeVisible();
})

test('Login - Success with Enter key', ESSENTIAL, async ({ page }) => {
  await interceptRequests(page, {
    getCurrentUser: user,
    token: 'success',
  })

  await page.login.go();
  await page.login.fillForm(user);
  const request = await page.login.submit('enterKey');
  expect(await request.postDataJSON()).toEqual({
    username: user,
    password: PASSWORD,
  })
  await expect(page.getByRole('heading', { name: 'Annotation Campaigns' })).toBeVisible();
})
