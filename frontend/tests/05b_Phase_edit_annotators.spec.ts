import { ESSENTIAL, expect, test } from './utils';
import { gqlURL, interceptRequests } from './utils/mock';
import { campaign, dataset, fileRange, userGroup, USERS } from './utils/mock/types';
import { AnnotationPhaseType } from '../src/api/types.gql-generated';
import { type UpdateFileRangesMutationVariables } from '../src/api/annotation-file-range';

test.describe('Campaign creator', () => {

  test('Empty', async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      getAnnotationPhase: 'manager',
      listSpectrogramAnalysis: 'empty',
      listAnnotationTask: 'empty',
      listFileRanges: 'empty',
      listUsers: 'empty',
    })
    await page.campaign.edit.go('creator');
    await expect(page.getByPlaceholder('Search annotator').locator('input')).toBeVisible()
    await expect(page.getByText('No annotators')).toBeVisible()
  })

  test('Manage annotators', ESSENTIAL, async ({ page }) => {
    await interceptRequests(page, {
      getCurrentUser: 'creator',
      getAnnotationPhase: 'manager',
    })
    await page.campaign.edit.go('creator');

    await test.step('Can see existing ranges', async () => {
      await expect(page.getByText(USERS.annotator.displayName)).toBeVisible()
      await expect(page.campaign.edit.firstIndexInputs.first()).toHaveValue((fileRange.firstFileIndex + 1).toString())
      await expect(page.campaign.edit.lastIndexInputs.first()).toHaveValue((fileRange.lastFileIndex + 1).toString())
      await expect(page.getByText(USERS.creator.displayName)).not.toBeVisible()
      await expect(page.getByText(USERS.staff.displayName)).not.toBeVisible()
      await expect(page.getByText(USERS.superuser.displayName)).not.toBeVisible()
    })

    await test.step('Cannot edit or remove annotator with finished tasks', async () => {
      await expect(page.campaign.edit.firstIndexInputs.first()).toBeDisabled()
      await expect(page.campaign.edit.lastIndexInputs.first()).toBeDisabled()
      //TODO: Handle forced update and remove of annotators with finished tasks
      // const button = page.locator('.table-content button').last()
      // await expect(button).toBeVisible()
      // await expect(button).toBeDisabled()
    })

    await test.step('Can add new annotator', async () => {
      await page.getByPlaceholder('Search annotator').locator('input').fill(USERS.superuser.firstName);
      await page.locator('#searchbar-results').getByText(USERS.superuser.firstName).click();
      await expect(page.getByText(USERS.superuser.displayName)).toBeVisible()
      await expect(page.campaign.edit.firstIndexInputs.nth(1)).toBeVisible()
      await expect(page.campaign.edit.lastIndexInputs.nth(1)).toBeVisible()
    })

    await test.step('Can edit or remove annotator without finished tasks', async () => {
      await page.campaign.edit.firstIndexInputs.nth(1).fill('5')
      await page.campaign.edit.lastIndexInputs.nth(1).fill('15')
      const button = page.locator('.table-content button').last()
      await expect(button).toBeEnabled()
    })

    await test.step('Can add known annotator with some files', async () => {
      await page.getByPlaceholder('Search annotator').locator('input').fill(USERS.superuser.firstName);
      await page.locator('#searchbar-results').getByText(USERS.superuser.firstName).click()
      expect(await page.locator('.table-aplose').getByText(USERS.superuser.firstName).count()).toEqual(2)
    })

    await test.step('Cannot add known annotator with all files', async () => {
      await page.getByPlaceholder('Search annotator').locator('input').fill(USERS.superuser.firstName);
      await expect(page.locator('#searchbar-results').getByText(USERS.superuser.firstName)).not.toBeVisible();
    })

    await test.step('Can annotator group', async () => {
      await page.getByPlaceholder('Search annotator').locator('input').fill(userGroup.name);
      await page.locator('#searchbar-results').getByText(userGroup.name).click();
      await expect(page.getByText(USERS.staff.displayName)).toBeVisible()
      await expect(page.campaign.edit.firstIndexInputs.nth(3)).toBeVisible()
      await expect(page.campaign.edit.lastIndexInputs.nth(3)).toBeVisible()
    })

    await test.step('Can submit', async () => {
      const [ request ] = await Promise.all([
        page.waitForRequest(gqlURL),
        page.getByRole('button', { name: 'Update annotators' }).click(),
      ])
      const variables: UpdateFileRangesMutationVariables = await request.postDataJSON().variables
      expect(variables.campaignID).toEqual(campaign.id)
      expect(variables.phaseType).toEqual(AnnotationPhaseType.Annotation)
      const expectedRanges: UpdateFileRangesMutationVariables['fileRanges'] = [
        {
          id: fileRange.id,
          annotatorId: USERS.annotator.id,
          firstFileIndex: fileRange.firstFileIndex,
          lastFileIndex: fileRange.lastFileIndex,
        }, {
          annotatorId: USERS.superuser.id,
          firstFileIndex: 4,
          lastFileIndex: 14,
        }, {
          annotatorId: USERS.superuser.id,
          firstFileIndex: 0,
          lastFileIndex: dataset.spectrogramCount - 1,
        }, {
          annotatorId: USERS.staff.id,
          firstFileIndex: 0,
          lastFileIndex: dataset.spectrogramCount - 1,
        },
      ]
      expect(variables.fileRanges).toEqual(expectedRanges)
    })
  })

})
