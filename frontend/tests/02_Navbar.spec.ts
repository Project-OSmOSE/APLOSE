import { essential, expect, Page, test, URL } from './utils';
import { interceptRequests } from './utils/mock';
import type { Params } from './utils/types';

// Utils

const STEP = {
  // Links
  hasDocumentationLink: (page: Page) =>
    test.step('Has documentation link', async () => {
      const url = await page.navbar.documentationLink.getAttribute('href')
      expect(url).toEqual(URL.doc)
    }),
  hasAdminLink: (page: Page) =>
    test.step('Has admin link', async () => {
      const url = await page.navbar.adminLink.getAttribute('href')
      expect(url).toEqual(URL.admin)
    }),
  hasNoAdminLink: (page: Page) =>
    test.step('Has no admin link', async () => {
      await expect(page.navbar.adminLink).not.toBeVisible()
    }),

  // Buttons
  accessCampaign: (page: Page) =>
    test.step('Access campaign', async () => {
      await page.navbar.campaignButton.click()
      await expect(page.campaigns.title).toBeVisible()
    }),
  accessAccountManagement: (page: Page) =>
    test.step('Access account management', async () => {
      await page.navbar.accountManagementButton.click()
      await expect(page.account.title).toBeVisible()
    }),
  cannotAccessDataset: (page: Page) =>
    test.step('Cannot access datasets', async () => {
      await expect(page.navbar.datasetsButton).not.toBeVisible()
    }),
  accessDataset: (page: Page) =>
    test.step('Access datasets', async () => {
      await page.navbar.datasetsButton.click()
      await expect(page.datasets.title).toBeVisible()
    }),
  canLogout: (page: Page) =>
    test.step('Logout', async () => {
      await page.navbar.logoutButton.click()
      await expect(page.login.title).toBeVisible();
    }),
}

const TEST = {
  canAccessAllButAdmin: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`can access all but admin as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, { getCurrentUser: as })
      await test.step(`Navigate`, () => page.navbar.go({ as }));

      await STEP.hasDocumentationLink(page)
      await STEP.hasNoAdminLink(page)
      await STEP.accessCampaign(page)
      await STEP.accessAccountManagement(page)
      await STEP.cannotAccessDataset(page)

      await STEP.canLogout(page)
    }),

  canAccessAll: ({ as, tag }: Pick<Params, 'as' | 'tag'>) =>
    test(`can access all as ${ as }`, { tag }, async ({ page }) => {
      await interceptRequests(page, { getCurrentUser: as })
      await test.step(`Navigate`, () => page.navbar.go({ as }));

      await STEP.hasDocumentationLink(page)
      await STEP.hasAdminLink(page)
      await STEP.accessCampaign(page)
      await STEP.accessAccountManagement(page)
      await STEP.accessDataset(page)

      await STEP.canLogout(page)
    }),
}

// Tests

test.describe('[Navbar]', () => {
  TEST.canAccessAllButAdmin({ as: 'annotator', tag: essential })
  TEST.canAccessAll({ as: 'staff', tag: essential })
  TEST.canAccessAll({ as: 'superuser' })
})
