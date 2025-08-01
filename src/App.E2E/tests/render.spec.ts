import { expect, test } from '@playwright/test'

import { AppTestHarness } from '@/App.E2E/app.test-harness'

test('renders the app', async ({ page }) => {
  const app = new AppTestHarness(page)

  await app.goTo('/')

  await expect(page.getByText('Det bedste tidspunkt (i dag) at starte din vaskemaskine er')).toBeVisible()
})
