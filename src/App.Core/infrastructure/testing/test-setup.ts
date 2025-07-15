import { beforeAll, beforeEach, vi } from 'vitest'

import { bootstrap } from '@/App.Core/app/bootstrap'
import { server as mswServer } from '@/App.Core/infrastructure/mock-service-worker/msw-node-server'

vi.mock('@/App.Core/infrastructure/mock-service-worker/msw-browser', async () => {
  return await import('@/App.Core/infrastructure/mock-service-worker/msw-node-server').then(
    (module) => ({ worker: module.server })
  )
})

beforeEach(() => {
  bootstrap({ withRender: false })
})

beforeAll(() => {
  /**
   * Starts the MSW node server before all tests run.
   * Note that the `beforeAll` hook doesn't run before describe blocks.
   */
  mswServer.listen()
})
