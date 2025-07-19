import { expect, it } from 'vitest'

import { createHttpGatewaySpy } from '@/App.Core/infrastructure/http-gateway/http-gateway-spy'
import { appTestHarness } from '@/App.Core/infrastructure/testing/app-test-harness'
import { usePriceLogic } from '@/App.Logic/logic/prices/price-logic'

const httpGateway = createHttpGatewaySpy()

it('fetches the prices from the API only once', async () => {
  await appTestHarness.waitForAppToStart()

  expect(httpGateway.get).not.toHaveBeenCalled()

  const { rerender } = appTestHarness.renderHookWithRouter(() => usePriceLogic())

  expect(httpGateway.get).toHaveBeenCalledOnce()
  expect(httpGateway.get).toHaveBeenCalledWith(expect.stringContaining('/prices/'))

  // Force a re-render, making the component logic run again
  rerender()

  expect(httpGateway.get).toHaveBeenCalledOnce()
})
