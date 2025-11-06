import { essential, expect, test } from './utils';
import { interceptRequests, PASSWORD } from './utils/mock';
import { TOKEN_ERROR } from './utils/mock/auth';
import type { UserType } from './utils/mock/types';
import type { Params } from './utils/types';


// Utils
const TEST = {
  canLogin: ({ as, method, tag }: Pick<Params, 'as' | 'method' | 'tag'>) =>
    test(`Can login as ${ as } using ${ method }`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        token: 'success',
      })

      await test.step(`Navigate`, () => page.login.go());

      await test.step('Fill form', () => page.login.fillForm({ as }))

      const request = await test.step('Submit', () => page.login.submit({ method }))

      expect(await request.postDataJSON()).toEqual({
        username: as,
        password: PASSWORD,
      })
      await expect(page.getByRole('heading', { name: 'Annotation Campaigns' })).toBeVisible();
    }),

  canSeeErrors: ({ as, method, tag }: Pick<Params, 'as' | 'method' | 'tag'>) =>
    test(`Can see errors on failed submit as ${ as } using ${ method }`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: as,
        token: 'forbidden',
      })

      await test.step(`Navigate`, () => page.login.go());

      await test.step('Fill form', () => page.login.fillForm({ as }))

      await test.step('Submit', () => page.login.submit({ method }))

      await expect(page.getByText(TOKEN_ERROR)).toBeVisible();
    }),
}

// Tests

test.describe('[Login]', () => {
  const as: UserType = 'annotator'

  TEST.canLogin({ as, method: 'mouse', tag: essential })
  TEST.canLogin({ as, method: 'shortcut' })

  TEST.canSeeErrors({ as, method: 'mouse', tag: essential })
  TEST.canSeeErrors({ as, method: 'shortcut' })
})
