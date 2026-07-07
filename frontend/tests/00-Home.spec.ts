import { essentialTag, expect, test } from './utils';
import { interceptRequests } from './utils/mock';
import type { Params } from './utils/types';

// Utils
const TEST = {
    canNavigate: ({ tag }: Pick<Params, 'tag'>) =>
        test(`Can navigate`, { tag }, async ({ page }) => {
            await interceptRequests(page, {
                getCurrentUser: 'empty',
                homeCollaborators: 'filled',
            })

            await Promise.all([
                test.step(`Navigate`, () => page.home.go()),
                page.waitForGqlRequest('homeCollaborators'),
            ])

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
