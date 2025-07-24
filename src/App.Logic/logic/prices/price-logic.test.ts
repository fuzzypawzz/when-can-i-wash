import { waitFor } from '@testing-library/dom'
import { expect, it } from 'vitest'

import { createHttpGatewaySpy } from '@/App.Core/infrastructure/http-gateway/http-gateway-spy'
import { server } from '@/App.Core/infrastructure/mock-service-worker/msw-node-server'
import { requestHandlers } from '@/App.Core/infrastructure/mock-service-worker/request-handlers'
import { appRouter } from '@/App.Core/infrastructure/router/app-router'
import { appTestHarness } from '@/App.Core/infrastructure/testing/app-test-harness'
import type { findCheapestTimeframe } from '@/App.Logic/logic/prices/find-cheapest-timeframe'
import { usePriceLogic } from '@/App.Logic/logic/prices/price-logic'
import type { PriceEntry } from '@/App.Service/models/prices/price-entry'

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

it('gets prices from the backend and outputs a dto with price details', async () => {
  await appTestHarness.waitForAppToStart()

  expect(httpGateway.get).not.toHaveBeenCalled()

  server.use(requestHandlers.prices.getPrices.happyScenario)

  const { result } = appTestHarness.renderHookWithRouter(() => usePriceLogic())

  await waitFor(() => {
    expect(result.current).toMatchObject({
      priceLevel: 'Cheap',
      averagePriceInTimeRange: '0.32',
      bestTimeRangeToStart: '13.00 - 16.00'
    } satisfies ReturnType<typeof findCheapestTimeframe>)
  })

  expect(httpGateway.get).toHaveBeenCalledWith(expect.stringContaining('/prices/'))
})

it('shows the internal app error page if there are insufficient hours for washing machine duration', async () => {
  await appTestHarness.waitForAppToStart()

  expect(appRouter.currentPathName).toBe('/')

  const mockPrices: PriceEntry[] = [
    {
      DKK_per_kWh: 0.5,
      EUR_per_kWh: 0.067,
      EXR: 7.462044,
      time_start: '2025-07-19T08:00:00+02:00',
      time_end: '2025-07-19T09:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.3,
      EUR_per_kWh: 0.04,
      EXR: 7.462044,
      time_start: '2025-07-19T09:00:00+02:00',
      time_end: '2025-07-19T10:00:00+02:00'
    }
  ]

  server.use(requestHandlers.prices.getPrices.override(mockPrices))

  appTestHarness.renderHookWithRouter(() => usePriceLogic())

  await waitFor(() => {
    expect(appRouter.currentPathName).toBe('/fejl')
  })
})
