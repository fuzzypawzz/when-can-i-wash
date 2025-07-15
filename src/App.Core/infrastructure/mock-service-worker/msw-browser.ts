import { setupWorker } from 'msw/browser'

import { defaultRequestHandlers } from '@/App.Core/infrastructure/mock-service-worker/request-handlers'

/**
 * @description
 * MSW server setup for the browser.
 * Add the default request handlers here that you would like to use in offline mode.
 */
export const worker = setupWorker(...defaultRequestHandlers)

export type Worker = typeof worker
