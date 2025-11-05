import { type Page as PageBase, test as testBase } from '@playwright/test';
import { Route } from 'playwright-core';
import { Mock } from './services';
import {
  AccountPage,
  AnnotatorPage,
  CampaignCreatePage,
  CampaignDetailPage,
  CampaignEditPage,
  CampaignImportAnnotationsPage,
  CampaignListPage,
  DatasetDetailPage,
  DatasetPage,
  HomePage,
  LoginPage,
  Navbar,
} from './pages';

interface PageExtension {
  readonly mock: Mock;

  readonly home: HomePage;
  readonly login: LoginPage;
  readonly navbar: Navbar;
  readonly account: AccountPage;
  readonly dataset: {
    list: DatasetPage;
    detail: DatasetDetailPage;
  }
  readonly annotator: AnnotatorPage;
  readonly campaign: {
    list: CampaignListPage;
    detail: CampaignDetailPage;
    create: CampaignCreatePage;
    edit: CampaignEditPage;
    import: CampaignImportAnnotationsPage;
  }
}

export interface Page extends PageBase, PageExtension {
}

// Declare the types of your fixtures.
type Fixture = {
  page: Page;
};

export * from '@playwright/test';
export const test = testBase.extend<Fixture>({
  page: async ({ page }, use) => {
    // Block all BFF requests from making it through to the 'real'
    // dependency. If we get this far it means we've forgotten to register a
    // handler, and (at least locally) we're using a real dependency.
    await page.route('**/graphql', function (route: Route) {
      route.abort('blockedbyclient');
    });

    const extension: PageExtension = {
      mock: new Mock(page),

      home: new HomePage(page),
      login: new LoginPage(page),
      navbar: new Navbar(page),
      account: new AccountPage(page),
      dataset: {
        list: new DatasetPage(page),
        detail: new DatasetDetailPage(page),
      },
      annotator: new AnnotatorPage(page),
      campaign: {
        list: new CampaignListPage(page),
        detail: new CampaignDetailPage(page),
        create: new CampaignCreatePage(page),
        edit: new CampaignEditPage(page),
        import: new CampaignImportAnnotationsPage(page),
      },
    }

    await use(Object.assign(page, extension))
  },
});
