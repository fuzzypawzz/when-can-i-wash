import type { Worker } from '@/App.Core/infrastructure/mock-service-worker/msw-browser'
import type { RequestHandlers } from '@/App.Core/infrastructure/mock-service-worker/request-handlers'

declare global {
  export interface Window {
    mswWorker: Worker
    mswRequestHandlers: RequestHandlers
    hasMswWorkerBeenInitialised: boolean
  }
}

export {}
