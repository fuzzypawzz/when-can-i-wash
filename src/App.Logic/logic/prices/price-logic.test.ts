import { waitFor } from '@testing-library/dom'
import { expect, it } from 'vitest'

import { createHttpGatewaySpy } from '@/App.Core/infrastructure/http-gateway/http-gateway-spy'
import { server } from '@/App.Core/infrastructure/mock-service-worker/msw-node-server'
import { requestHandlers } from '@/App.Core/infrastructure/mock-service-worker/request-handlers'
import { appTestHarness } from '@/App.Core/infrastructure/testing/app-test-harness'
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

it('calculates the best time frame to run the washing machine with simple decreasing prices', async () => {
  await appTestHarness.waitForAppToStart()

  const mockPrices: PriceEntry[] = [
    {
      DKK_per_kWh: 1.0,
      EUR_per_kWh: 0.134,
      EXR: 7.462044,
      time_start: '2025-07-19T08:00:00+02:00',
      time_end: '2025-07-19T09:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.8,
      EUR_per_kWh: 0.107,
      EXR: 7.462044,
      time_start: '2025-07-19T09:00:00+02:00',
      time_end: '2025-07-19T10:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.6,
      EUR_per_kWh: 0.08,
      EXR: 7.462044,
      time_start: '2025-07-19T10:00:00+02:00',
      time_end: '2025-07-19T11:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.4,
      EUR_per_kWh: 0.054,
      EXR: 7.462044,
      time_start: '2025-07-19T11:00:00+02:00',
      time_end: '2025-07-19T12:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.2,
      EUR_per_kWh: 0.027,
      EXR: 7.462044,
      time_start: '2025-07-19T12:00:00+02:00',
      time_end: '2025-07-19T13:00:00+02:00'
    }
  ]

  server.use(requestHandlers.prices.getPrices.override(mockPrices))

  const { result } = appTestHarness.renderHookWithRouter(() => usePriceLogic())

  await waitFor(() => {
    expect(result.current.bestTimeRangeToStart).toBe('10.00 - 13.00')
    expect(result.current.averagePriceInTimeRange).toBe('0.40')
    expect(result.current.priceLevel).toBe('Cheap')
  })
})

it('calculates the best time frame with equal prices', async () => {
  await appTestHarness.waitForAppToStart()

  const mockPrices: PriceEntry[] = [
    {
      DKK_per_kWh: 0.5,
      EUR_per_kWh: 0.067,
      EXR: 7.462044,
      time_start: '2025-07-19T08:00:00+02:00',
      time_end: '2025-07-19T09:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.5,
      EUR_per_kWh: 0.067,
      EXR: 7.462044,
      time_start: '2025-07-19T09:00:00+02:00',
      time_end: '2025-07-19T10:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.5,
      EUR_per_kWh: 0.067,
      EXR: 7.462044,
      time_start: '2025-07-19T10:00:00+02:00',
      time_end: '2025-07-19T11:00:00+02:00'
    }
  ]

  server.use(requestHandlers.prices.getPrices.override(mockPrices))

  const { result } = appTestHarness.renderHookWithRouter(() => usePriceLogic())

  await waitFor(() => {
    expect(result.current.bestTimeRangeToStart).toBe('08.00 - 11.00')
    expect(result.current.averagePriceInTimeRange).toBe('0.50')
    expect(result.current.priceLevel).toBe('Cheap')
  })
})

it('calculates the best time frame with peak and valley prices', async () => {
  await appTestHarness.waitForAppToStart()

  const mockPrices: PriceEntry[] = [
    {
      DKK_per_kWh: 2.0,
      EUR_per_kWh: 0.268,
      EXR: 7.462044,
      time_start: '2025-07-19T06:00:00+02:00',
      time_end: '2025-07-19T07:00:00+02:00'
    },
    {
      DKK_per_kWh: 1.8,
      EUR_per_kWh: 0.241,
      EXR: 7.462044,
      time_start: '2025-07-19T07:00:00+02:00',
      time_end: '2025-07-19T08:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.1,
      EUR_per_kWh: 0.013,
      EXR: 7.462044,
      time_start: '2025-07-19T08:00:00+02:00',
      time_end: '2025-07-19T09:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.1,
      EUR_per_kWh: 0.013,
      EXR: 7.462044,
      time_start: '2025-07-19T09:00:00+02:00',
      time_end: '2025-07-19T10:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.1,
      EUR_per_kWh: 0.013,
      EXR: 7.462044,
      time_start: '2025-07-19T10:00:00+02:00',
      time_end: '2025-07-19T11:00:00+02:00'
    },
    {
      DKK_per_kWh: 1.5,
      EUR_per_kWh: 0.201,
      EXR: 7.462044,
      time_start: '2025-07-19T11:00:00+02:00',
      time_end: '2025-07-19T12:00:00+02:00'
    }
  ]

  server.use(requestHandlers.prices.getPrices.override(mockPrices))

  const { result } = appTestHarness.renderHookWithRouter(() => usePriceLogic())

  await waitFor(() => {
    expect(result.current.bestTimeRangeToStart).toBe('08.00 - 11.00')
    expect(result.current.averagePriceInTimeRange).toBe('0.10')
    expect(result.current.priceLevel).toBe('Medium')
  })
})

it('handles empty price data gracefully', async () => {
  await appTestHarness.waitForAppToStart()

  const mockPrices: PriceEntry[] = []

  server.use(requestHandlers.prices.getPrices.override(mockPrices))

  const { result } = appTestHarness.renderHookWithRouter(() => usePriceLogic())

  await waitFor(() => {
    expect(result.current.bestTimeRangeToStart).toBe('Indlæser...')
    expect(result.current.averagePriceInTimeRange).toBe('0.00')
    expect(result.current.priceLevel).toBe('Medium')
  })
})

it('handles insufficient hours for washing machine duration', async () => {
  await appTestHarness.waitForAppToStart()

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

  const { result } = appTestHarness.renderHookWithRouter(() => usePriceLogic())

  await waitFor(() => {
    expect(result.current.bestTimeRangeToStart).toBe('Indlæser...')
    expect(result.current.averagePriceInTimeRange).toBe('0.00')
    expect(result.current.priceLevel).toBe('Medium')
  })
})
