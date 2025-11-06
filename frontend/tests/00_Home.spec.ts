import { essential, expect, test, URL } from './utils';
import { interceptRequests } from './utils/mock';
import { COLLABORATOR_QUERIES } from './utils/mock/collaborators';
import type { Params } from './utils/types';

// Utils
const TEST = {
  canNavigate: ({ tag }: Pick<Params, 'tag'>) =>
    test(`Can navigate`, { tag }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'empty',
        listCollaborators: 'success',
      })

      await Promise.all([
        test.step(`Navigate`, () => page.home.go()),
        page.waitForRequest(COLLABORATOR_QUERIES.listCollaborators.url),
      ])

      await test.step('Has OSmOSE website link', async () => {
        const url = await page.home.osmoseLink.getAttribute('href')
        expect(url).toEqual(URL.OSmOSE)
      })

      await test.step('Has documentation link', async () => {
        const url = await page.home.documentationLink.getAttribute('href')
        expect(url).toEqual(URL.doc)
      })

      await test.step('Can access Login', async () => {
        await page.home.loginButton.click()
        await expect(page.login.title).toBeVisible();
      })
    }),
}

// Tests

test.describe('[Home]', () => {

  TEST.canNavigate({ tag: essential })

})
