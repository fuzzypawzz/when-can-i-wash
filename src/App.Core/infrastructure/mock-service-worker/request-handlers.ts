import { getPriceServiceRequestHandlers } from '@/App.Service/service/user/msw-request-handlers/price-service-request-handlers'

export type RequestHandlers = {
  [key in keyof typeof requestHandlers]: (typeof requestHandlers)[key]
}

export const requestHandlers = {
  user: getPriceServiceRequestHandlers()
}

/**
 * @description The default handlers used for msw-browser and msw-server.
 */
export const defaultRequestHandlers = [...[requestHandlers.user.getPrices.happyScenario]]
