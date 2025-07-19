import { HttpResponse, http } from 'msw'

import { environmentVariables } from '@/App.Core/infrastructure/config/public-env-variables/load-public-env-variables'
import { defaultDelay } from '@/App.Core/infrastructure/mock-service-worker/delays'
import PriceJsonResponseStub from '@/App.Service/stubs/prices/price-json-stubs'

export function getPriceServiceRequestHandlers() {
  return {
    getPrices: {
      happyScenario: http.get(environmentVariables.value.backendApiUrl, async () => {
        await defaultDelay()

        return HttpResponse.json(PriceJsonResponseStub)
      }),

      networkError: http.get(environmentVariables.value.backendApiUrl, async () => {
        await defaultDelay()

        return HttpResponse.error()
      })
    }
  }
}
