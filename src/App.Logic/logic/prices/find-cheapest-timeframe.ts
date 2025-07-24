import type { PriceEntry } from '@/App.Service/models/prices/price-entry'

type CheapestTimeframe = {
  bestTimeRangeToStart: string
  averagePriceInTimeRange: string
  priceLevel: 'Cheap' | 'Medium' | 'Expensive'
}

export function findCheapestTimeframe(prices?: PriceEntry[]): CheapestTimeframe {
  const WASHING_MACHINE_DURATION_HOURS = 2.5

  if (!prices || prices.length === 0) {
    return {
      bestTimeRangeToStart: '',
      averagePriceInTimeRange: '',
      priceLevel: 'Medium'
    }
  }

  const durationHours = Math.ceil(WASHING_MACHINE_DURATION_HOURS)

  if (prices.length < durationHours) {
    throw Error(
      `Could not calculate average price: machine duration hours are ${durationHours} and amount of entries in prices are ${prices.length}.`
    )
  }

  let cheapestAverage = Infinity
  let cheapestStartIndex = 0

  for (let i = 0; i <= prices.length - durationHours; i++) {
    const timeframeSlice = prices.slice(i, i + durationHours)

    const totalPrice = timeframeSlice.reduce((accumulatedSum, entry) => {
      return accumulatedSum + entry.DKK_per_kWh
    }, 0)

    const averagePrice = totalPrice / durationHours

    if (averagePrice < cheapestAverage) {
      cheapestAverage = averagePrice
      cheapestStartIndex = i
    }
  }

  const startEntry = prices[cheapestStartIndex]
  const endEntry = prices[cheapestStartIndex + durationHours - 1]

  function getFormattedTime(time: string) {
    return new Date(time).toLocaleTimeString('da-DK', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Copenhagen'
    })
  }

  const startTime = getFormattedTime(startEntry.time_start)
  const endTime = getFormattedTime(endEntry.time_end)

  const priceLevel = (function () {
    if (cheapestAverage < 0.6) return 'Cheap'
    if (cheapestAverage <= 0.9) return 'Medium'
    return 'Expensive'
  })()

  const bestTimeRangeToStart = `${startTime || ''} - ${endTime || ''}`.trim()

  const averagePriceInTimeRange = cheapestAverage > 0 ? cheapestAverage.toFixed(2) : '0.00'

  return {
    bestTimeRangeToStart,
    averagePriceInTimeRange,
    priceLevel
  }
}
