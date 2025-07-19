import { useState } from 'react'

import { useOnMount } from '@/App.Core/infrastructure/helpers/hook-helpers'
import { appRouter } from '@/App.Core/infrastructure/router/app-router'
import type { ElectricityPriceDto } from '@/App.Logic/dtos/electricity-price.dto'
import { priceClassDict } from '@/App.Logic/logic/prices/price-class-dictionary'
import type { PriceEntry } from '@/App.Service/models/prices/price-entry'
import { service_v1_prices } from '@/App.Service/service/user/get-prices'

export const usePriceLogic = (function () {
  type CheapestTimeframe = {
    startTime: string
    endTime: string
    averagePrice: number
    priceLevel: 'Cheap' | 'Medium' | 'Expensive'
  }

  const WASHING_MACHINE_DURATION_HOURS = 2.5

  return function usePriceLogic(): ElectricityPriceDto {
    const [prices, setPrices] = useState<PriceEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const navigation = appRouter.useNavigation()

    useOnMount(() => {
      service_v1_prices({
        year: 2025,
        month: '07',
        dayOfMonth: '19',
        priceClass: priceClassDict['Copenhagen/East']
      })
        .then(setPrices)
        .catch((error) => {
          console.error(error)
          navigation.goToErrorPage.internalAppError()
        })
        .finally(() => setIsLoading(false))
    })

    const cheapestTimeframe = findCheapestTimeframe(prices)

    const bestTimeRangeToStart =
      `${cheapestTimeframe.startTime || ''} - ${cheapestTimeframe.endTime || ''}`.trim()

    const averagePriceInTimeRange =
      cheapestTimeframe.averagePrice > 0 ? cheapestTimeframe.averagePrice.toFixed(2) : '0.00'

    return {
      isLoadingPrices: isLoading,
      bestTimeRangeToStart,
      averagePriceInTimeRange,
      priceLevel: cheapestTimeframe.priceLevel
    }
  }

  function findCheapestTimeframe(prices: PriceEntry[]): CheapestTimeframe {
    if (prices.length === 0) {
      return {
        startTime: '',
        endTime: '',
        averagePrice: 0,
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

    return {
      startTime,
      endTime,
      averagePrice: cheapestAverage,
      priceLevel
    }
  }
})()
