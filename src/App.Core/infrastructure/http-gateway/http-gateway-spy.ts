import { beforeEach, vi } from 'vitest'

import { httpGateway } from '@/App.Core/infrastructure/http-gateway/http-gateway'

export function createHttpGatewaySpy() {
  beforeEach(() => {
    if ('mockClear' in httpGateway.get) {
      throw Error(
        'HttpGateway spies has not been reset between tests. This is likely a Vitest configuration problem.'
      )
    }

    vi.spyOn(httpGateway, 'get')
  })

  return httpGateway
}
