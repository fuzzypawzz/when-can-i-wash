import type { Page } from '@playwright/test'

import type { AppEventName } from '@/App.Core/infrastructure/helpers/event-hub'
import type { Worker } from '@/App.Core/infrastructure/mock-service-worker/msw-browser.ts'
import type { RequestHandlers } from '@/App.Core/infrastructure/mock-service-worker/request-handlers.ts'

/**
 * @description Use this function to register MSW (Mock Service Worker) request handlers in Playwright tests.
 * You can also use this function to override request handlers during a test run.
 */
export async function useMsw(
  page: Page,
  callback: (worker: Worker, requestHandlers: RequestHandlers) => void
) {
  await page.evaluate(
    ({ callback }) => {
      if (!window.hasMswWorkerBeenInitialised) return

      const registrationHandler = new Function('return ' + callback)()

      registrationHandler(window.mswWorker, window.mswRequestHandlers)
    },
    { callback: callback.toString() }
  )

  await page.addInitScript(
    ({ callback }) => {
      if (window.hasMswWorkerBeenInitialised) return

      // The request handlers are added when the 'worker-ready' event is dispatched from our app.
      window.addEventListener('worker-ready' satisfies AppEventName, onWorkerReady)

      function onWorkerReady() {
        const registrationHandler = new Function('return ' + callback)()

        registrationHandler(window.mswWorker, window.mswRequestHandlers)
        window.hasMswWorkerBeenInitialised = true
      }
    },
    {
      callback: callback.toString()
    }
  )
}
