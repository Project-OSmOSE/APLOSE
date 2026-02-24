import { essentialTag, expect, test } from './utils';
import { interceptRequests, PASSWORD } from './utils/mock';
import { TOKEN_ERROR } from './utils/mock/auth';
import type { UserType } from './utils/mock/types';
import type { Params } from './utils/types';


// Utils
const TEST = {
  canLogin: ({ as, method, tag }: Pick<Params, 'as' | 'method' | 'tag'>) =>
    test(`as ${ as } using ${ method }`, { tag }, async ({ page }) => {
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
    test(`as ${ as } using ${ method }`, { tag }, async ({ page }) => {
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

test.describe('/login', () => {
  const as: UserType = 'annotator'

    test.describe('Can login', () => {
        TEST.canLogin({ as, method: 'mouse', tag: essentialTag })
        TEST.canLogin({ as, method: 'shortcut' })
    })

    test.describe('Display errors', () => {
        TEST.canSeeErrors({ as, method: 'mouse', tag: essentialTag })
        TEST.canSeeErrors({ as, method: 'shortcut' })
    })

})
