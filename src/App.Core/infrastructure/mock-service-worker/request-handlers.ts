import { getPriceServiceRequestHandlers } from '@/App.Service/service/msw-request-handlers/price-service-request-handlers.ts'

export type RequestHandlers = {
  [key in keyof typeof requestHandlers]: (typeof requestHandlers)[key]
}

export const requestHandlers = {
  prices: getPriceServiceRequestHandlers()
}

/**
 * @description The default handlers used for msw-browser and msw-server.
 */
export const defaultRequestHandlers = [...[requestHandlers.prices.getPrices.happyScenario]]
