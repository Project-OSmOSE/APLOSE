import { type Page as PageBase, test as testBase } from '@playwright/test';
import { Route } from 'playwright-core';
import {
  AccountPage,
  AnnotatorPage,
  CampaignCreatePage,
  CampaignDetailPage,
  CampaignListPage,
  DatasetDetailPage,
  DatasetPage,
  HomePage,
  LoginPage,
  Navbar,
  PhaseDetailPage,
  PhaseEditAnnotatorsPage,
  PhaseImportAnnotationsPage,
  StoragePage,
} from './pages';

interface PageExtension {
  readonly home: HomePage;
  readonly login: LoginPage;
  readonly navbar: Navbar;
  readonly account: AccountPage;

  readonly storage: StoragePage;

  readonly datasets: DatasetPage;
  readonly datasetDetail: DatasetDetailPage;

  readonly campaigns: CampaignListPage;
  readonly campaignDetail: CampaignDetailPage;
  readonly campaignCreate: CampaignCreatePage;

  readonly phaseDetail: PhaseDetailPage;
  readonly phaseImport: PhaseImportAnnotationsPage;
  readonly phaseEdit: PhaseEditAnnotatorsPage;

  readonly annotator: AnnotatorPage;
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
      home: new HomePage(page),
      login: new LoginPage(page),
      navbar: new Navbar(page),
      account: new AccountPage(page),
      storage: new StoragePage(page),
      datasets: new DatasetPage(page),
      datasetDetail: new DatasetDetailPage(page),
      campaigns: new CampaignListPage(page),
      campaignDetail: new CampaignDetailPage(page),
      campaignCreate: new CampaignCreatePage(page),
      phaseDetail: new PhaseDetailPage(page),
      phaseImport: new PhaseImportAnnotationsPage(page),
      phaseEdit: new PhaseEditAnnotatorsPage(page),
      annotator: new AnnotatorPage(page),
    }

    await use(Object.assign(page, extension))
  },
});
