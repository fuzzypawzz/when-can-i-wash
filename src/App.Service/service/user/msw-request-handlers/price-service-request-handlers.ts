import { HttpResponse, http } from 'msw'

import { environmentVariables } from '@/App.Core/infrastructure/config/public-env-variables/load-public-env-variables'
import { defaultDelay } from '@/App.Core/infrastructure/mock-service-worker/delays'
import type { PriceEntry } from '@/App.Service/models/prices/price-entry'
import PriceJsonResponseStub from '@/App.Service/stubs/prices/price-json-stubs'

export function getPriceServiceRequestHandlers() {
  return {
    getPrices: {
      happyScenario: http.get(environmentVariables.value.backendApiUrl + '*', async () => {
        await defaultDelay()

        return HttpResponse.json(PriceJsonResponseStub)
      }),

      networkError: http.get(environmentVariables.value.backendApiUrl + '*', async () => {
        await defaultDelay()

        return HttpResponse.error()
      }),

      override(stubs: PriceEntry[]) {
        return http.get(environmentVariables.value.backendApiUrl + '*', async () => {
          await defaultDelay()

          return HttpResponse.json(stubs)
        })
      }
    }
  }
}
