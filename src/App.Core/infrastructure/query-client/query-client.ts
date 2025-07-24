import { QueryClient } from '@tanstack/query-core'

import { appMode } from '@/App.Core/infrastructure/app-mode'

export const queryClient = (function () {
  let queryClient: QueryClient | null

  return {
    get() {
      if (queryClient) return queryClient

      queryClient = new QueryClient({
        defaultOptions: {
          ...(appMode.isE2ETest || appMode.isOffline || appMode.isTest
            ? { queries: { retry: false } }
            : {})
        }
      })

      return queryClient
    },

    set(client: QueryClient) {
      if (!(client instanceof QueryClient)) {
        throw new Error('Client must be a QueryClient from TanStack.')
      }

      queryClient = client
    },

    reset() {
      queryClient?.clear()
      queryClient?.unmount()
      queryClient = null

      return this.get()
    }
  }
})()
