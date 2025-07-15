import { setupServer } from 'msw/node'

import { defaultRequestHandlers } from '@/App.Core/infrastructure/mock-service-worker/request-handlers'

/**
 * @description
 * MSW server setup for Node. This server is used during testing.
 * Add the default request handlers here, so every test doesn't need
 * to call `server.use` with a request handler.
 *
 * Storybook may as well be using logic that call out to the network.
 * MSW will, in this case, step in and return the response as defined in the
 * default request handlers here.
 */
export const server = setupServer(...defaultRequestHandlers)
