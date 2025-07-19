import { appMode } from '@/App.Core/infrastructure/app-mode'
import { paths } from '@/App.Core/infrastructure/config/paths.constants'
import { appEventHub } from '@/App.Core/infrastructure/helpers/event-hub'

export async function setupMockServiceWorker() {
  if (!appMode.isOffline) return

  const { worker } = await import('@/App.Core/infrastructure/mock-service-worker/msw-browser')
  const { onUnhandledRequest } = await import(
    '@/App.Core/infrastructure/mock-service-worker/unhandled-request-handler'
  )

  if (appMode.isE2ETest || appMode.isOffline) {
    const { requestHandlers } = await import(
      '@/App.Core/infrastructure/mock-service-worker/request-handlers'
    )

    // Make MSW available to Playwright
    window.mswWorker = worker
    window.mswRequestHandlers = requestHandlers
  }

  await worker.start({
    serviceWorker: { url: paths.publicMockServiceWorkerPath },
    onUnhandledRequest
  })

  // Dispatch event to tell Playwright when to register request handlers
  appEventHub.send('worker-ready')
  window.hasMswWorkerBeenInitialised = true
}
