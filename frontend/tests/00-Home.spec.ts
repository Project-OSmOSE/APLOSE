import { essentialTag, expect, test, URL } from './utils';
import { gqlURL, interceptRequests } from './utils/mock';
import type { Params } from './utils/types';

// Utils
const TEST = {
    canNavigate: ({ tag }: Pick<Params, 'tag'>) =>
        test(`Can navigate`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: 'empty',
                homeCollaborators: 'filled',
            })

            await test.step(`Navigate`, () => page.home.go())
            await page.waitForRequest(gqlURL) // Wait for homeCollaborators

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

test.describe('/', () => {

    TEST.canNavigate({ tag: essentialTag })

})
