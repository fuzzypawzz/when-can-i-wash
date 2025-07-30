import { expect, it } from 'vitest'

import { findCheapestTimeframe } from '@/App.Logic/logic/prices/find-cheapest-timeframe'
import type { PriceEntry } from '@/App.Service/models/price-entry.ts'

it('calculates the best time frame to run the washing machine with simple decreasing prices', async () => {
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

  const result = findCheapestTimeframe(mockPrices)

  expect(result.bestTimeRangeToStart).toBe('10.00 - 13.00')
  expect(result.averagePriceInTimeRange).toBe('0.40')
  expect(result.priceLevel).toBe('Cheap')
})

it('calculates the best time frame with equal prices', async () => {
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

  const result = findCheapestTimeframe(mockPrices)

  expect(result.bestTimeRangeToStart).toBe('08.00 - 11.00')
  expect(result.averagePriceInTimeRange).toBe('0.50')
  expect(result.priceLevel).toBe('Cheap')
})

it('calculates the best time frame with peak and valley prices', async () => {
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

  const result = findCheapestTimeframe(mockPrices)

  expect(result.bestTimeRangeToStart).toBe('08.00 - 11.00')
  expect(result.averagePriceInTimeRange).toBe('0.10')
  expect(result.priceLevel).toBe('Cheap')
})

it('handles empty price data gracefully', async () => {
  const mockPrices: PriceEntry[] = []

  const result = findCheapestTimeframe(mockPrices)

  expect(result.bestTimeRangeToStart).toBe('')
  expect(result.averagePriceInTimeRange).toBe('')
  expect(result.priceLevel).toBe('Medium')
})

it('classifies price level as Cheap when average is below 0.60', async () => {
  const mockPrices: PriceEntry[] = [
    {
      DKK_per_kWh: 0.55,
      EUR_per_kWh: 0.074,
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
      DKK_per_kWh: 0.45,
      EUR_per_kWh: 0.06,
      EXR: 7.462044,
      time_start: '2025-07-19T10:00:00+02:00',
      time_end: '2025-07-19T11:00:00+02:00'
    }
  ]

  const result = findCheapestTimeframe(mockPrices)

  expect(result.priceLevel).toBe('Cheap')
  expect(result.averagePriceInTimeRange).toBe('0.50')
})

it('classifies price level as Medium when average is between 0.60 and 0.90', async () => {
  const mockPrices: PriceEntry[] = [
    {
      DKK_per_kWh: 0.7,
      EUR_per_kWh: 0.094,
      EXR: 7.462044,
      time_start: '2025-07-19T08:00:00+02:00',
      time_end: '2025-07-19T09:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.75,
      EUR_per_kWh: 0.101,
      EXR: 7.462044,
      time_start: '2025-07-19T09:00:00+02:00',
      time_end: '2025-07-19T10:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.8,
      EUR_per_kWh: 0.107,
      EXR: 7.462044,
      time_start: '2025-07-19T10:00:00+02:00',
      time_end: '2025-07-19T11:00:00+02:00'
    }
  ]

  const result = findCheapestTimeframe(mockPrices)

  expect(result.priceLevel).toBe('Medium')
  expect(result.averagePriceInTimeRange).toBe('0.75')
})

it('classifies price level as Expensive when average is above 0.90', async () => {
  const mockPrices: PriceEntry[] = [
    {
      DKK_per_kWh: 1.0,
      EUR_per_kWh: 0.134,
      EXR: 7.462044,
      time_start: '2025-07-19T08:00:00+02:00',
      time_end: '2025-07-19T09:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.95,
      EUR_per_kWh: 0.127,
      EXR: 7.462044,
      time_start: '2025-07-19T09:00:00+02:00',
      time_end: '2025-07-19T10:00:00+02:00'
    },
    {
      DKK_per_kWh: 1.05,
      EUR_per_kWh: 0.141,
      EXR: 7.462044,
      time_start: '2025-07-19T10:00:00+02:00',
      time_end: '2025-07-19T11:00:00+02:00'
    }
  ]

  const result = findCheapestTimeframe(mockPrices)

  expect(result.priceLevel).toBe('Expensive')
  expect(result.averagePriceInTimeRange).toBe('1.00')
})

it('classifies price level boundary: exactly 0.60 should be Medium', async () => {
  const mockPrices: PriceEntry[] = [
    {
      DKK_per_kWh: 0.6,
      EUR_per_kWh: 0.08,
      EXR: 7.462044,
      time_start: '2025-07-19T08:00:00+02:00',
      time_end: '2025-07-19T09:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.6,
      EUR_per_kWh: 0.08,
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
    }
  ]

  const result = findCheapestTimeframe(mockPrices)

  expect(result.priceLevel).toBe('Medium')
  expect(result.averagePriceInTimeRange).toBe('0.60')
})

it('classifies price level boundary: exactly 0.90 should be Medium', async () => {
  const mockPrices: PriceEntry[] = [
    {
      DKK_per_kWh: 0.9,
      EUR_per_kWh: 0.121,
      EXR: 7.462044,
      time_start: '2025-07-19T08:00:00+02:00',
      time_end: '2025-07-19T09:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.9,
      EUR_per_kWh: 0.121,
      EXR: 7.462044,
      time_start: '2025-07-19T09:00:00+02:00',
      time_end: '2025-07-19T10:00:00+02:00'
    },
    {
      DKK_per_kWh: 0.9,
      EUR_per_kWh: 0.121,
      EXR: 7.462044,
      time_start: '2025-07-19T10:00:00+02:00',
      time_end: '2025-07-19T11:00:00+02:00'
    }
  ]

  const result = findCheapestTimeframe(mockPrices)

  expect(result.priceLevel).toBe('Medium')
  expect(result.averagePriceInTimeRange).toBe('0.90')
})
