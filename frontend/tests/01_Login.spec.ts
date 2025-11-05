import { essential, expect, test } from './utils';
import { interceptRequests, PASSWORD } from './utils/mock';
import { TOKEN_ERROR } from './utils/mock/auth';
import type { UserType } from './utils/mock/types';
import type { Params } from './utils/types';


// Utils
const TEST = {
  canLogin: ({ as, method }: Pick<Params, 'as' | 'method'>) =>
    test(`Can login as ${ as } using ${ method }`, { tag: essential }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        token: 'success',
      })

      await page.login.goStep();

      await test.step('Fill form', () => page.login.fillForm({ as }))

      const request = await test.step('Submit', () => page.login.submit({ method }))

      expect(await request.postDataJSON()).toEqual({
        username: as,
        password: PASSWORD,
      })
      await expect(page.getByRole('heading', { name: 'Annotation Campaigns' })).toBeVisible();
    }),

  canSeeErrors: ({ as, method }: Pick<Params, 'as' | 'method'>) =>
    test(`Can see errors on failed submit as ${ as } using ${ method }`, { tag: essential }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        token: 'forbidden',
      })

      await page.login.goStep();

      await test.step('Fill form', () => page.login.fillForm({ as }))

      await test.step('Submit', () => page.login.submit({ method }))

      await expect(page.getByText(TOKEN_ERROR)).toBeVisible();
    }),
}

// Tests

test.describe('[Login] Visitor', () => {
  const as: UserType = 'annotator'

  TEST.canLogin({ as, method: 'mouse' })
  TEST.canLogin({ as, method: 'shortcut' })

  TEST.canSeeErrors({ as, method: 'mouse' })
  TEST.canSeeErrors({ as, method: 'shortcut' })
})
