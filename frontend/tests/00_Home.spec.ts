import { essential, expect, test, URL } from './utils';
import { interceptRequests } from './utils/mock';
import { COLLABORATOR_QUERIES } from './utils/mock/collaborators';

// Utils
const TEST = {
  canNavigate: () =>
    test(`Can navigate`, { tag: essential }, async ({ page }) => {
      await interceptRequests(page, {
        getCurrentUser: 'empty',
        listCollaborators: 'success',
      })

      await Promise.all([
        page.home.goStep(),
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

test.describe('[Home] Visitor', { tag: essential }, () => {

  TEST.canNavigate()
  
})
