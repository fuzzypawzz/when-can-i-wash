import { AppSetup } from '@/App.Core/app/app-setup'
import { appMode } from '@/App.Core/infrastructure/app-mode'
import '@/App.UI/assets/styles/style.scss'

export function bootstrap(args = { withRender: true }) {
  new AppSetup()
    .setupMockServiceWorker()
    .then((appSetup) => (args.withRender ? appSetup.renderApp() : appSetup))
    .then((appSetup) => appSetup.sendAppStartEvent())
    .catch((error) => {
      if (appMode.isTest) return console.error(error)
      if (!appMode.isProduction) console.error(error)

      AppSetup.renderErrorView(error)
    })
}
