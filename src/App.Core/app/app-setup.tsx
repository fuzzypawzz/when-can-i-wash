import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { appMode } from '@/App.Core/infrastructure/app-mode'
import { loadPublicEnvironmentVariables } from '@/App.Core/infrastructure/config/public-env-variables/load-public-env-variables'
import { appEventHub } from '@/App.Core/infrastructure/helpers/event-hub'
import { setupMockServiceWorker } from '@/App.Core/infrastructure/mock-service-worker/setup'
import { appRouter } from '@/App.Core/infrastructure/router/app-router'

export class AppSetup {
  renderApp(): Promise<this> {
    return new Promise((resolve) => {
      setTimeout(
        () => {
          const root = createRoot(document.getElementById('app-root')!)

          root.render(
            <StrictMode>
              <appRouter.AppRouterProvider />
            </StrictMode>
          )

          resolve(this)
        },
        appMode.isDevelopment || appMode.isOffline || appMode.isE2ETest ? 0 : 1000
      )
    })
  }

  async loadPublicEnvironmentVariables(): Promise<this> {
    loadPublicEnvironmentVariables()

    return this
  }

  async setupMockServiceWorker(): Promise<this> {
    await setupMockServiceWorker()

    return this
  }

  sendAppStartEvent(): this {
    appEventHub.send('app-started')

    return this
  }

  static renderErrorView(error: unknown) {
    const message = error instanceof Error ? error.message : 'Der er gået noget galt!'

    createRoot(document.getElementById('root')!).render(<pre>{message}</pre>)
  }
}
