import type { Page } from '@playwright/test'

import { step } from '@/App.E2E/helpers/decorators'

export class AppTestHarness {
  readonly page

  constructor(page: Page) {
    this.page = page
  }

  @step((url) => `Go to ${url}`)
  async goTo(
    url: string
  ) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' })
  }

  @step((storyId) => `Render story: ${storyId}`)
  async goToStory(storyId: string) {
    await this.page.goto(`http://localhost:6006/iframe.html?id=${storyId}`)
    await this.page.waitForSelector('#storybook-root', {
      timeout: process.env.CI ? 30000 : 10000
    })
  }
}
