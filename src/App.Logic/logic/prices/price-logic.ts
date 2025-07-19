import { useState } from 'react'

import { useOnMount } from '@/App.Core/infrastructure/helpers/hook-helpers'
import { appRouter } from '@/App.Core/infrastructure/router/app-router'
import type { ElectricityPriceDto } from '@/App.Logic/dtos/electricity-price.dto'
import { priceClassDict } from '@/App.Logic/logic/prices/price-class-dictionary'
import type { PriceEntry } from '@/App.Service/models/prices/price-entry'
import { service_v1_prices } from '@/App.Service/service/user/get-prices'

const WASHING_MACHINE_DURATION_HOURS = 2.5

type CheapestTimeframe = {
  startTime: string
  endTime: string
  averagePrice: number
  priceLevel: 'Cheap' | 'Medium' | 'Expensive'
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

  const startTime = new Date(startEntry.time_start).toLocaleTimeString('da-DK', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Copenhagen'
  })

  const endTime = new Date(endEntry.time_end).toLocaleTimeString('da-DK', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Copenhagen'
  })

  const fromCheapestToMostExpensive = (a: number, b: number) => a - b

  const allPrices = prices.map((price) => price.DKK_per_kWh).sort(fromCheapestToMostExpensive)
  const medianPrice = allPrices[Math.floor(allPrices.length / 2)]
  const firstQuartile = allPrices[Math.floor(allPrices.length * 0.25)]

  let priceLevel: 'Cheap' | 'Medium' | 'Expensive'

  if (cheapestAverage <= firstQuartile) {
    priceLevel = 'Cheap'
  } else if (cheapestAverage <= medianPrice) {
    priceLevel = 'Medium'
  } else {
    priceLevel = 'Expensive'
  }

  return {
    startTime,
    endTime,
    averagePrice: cheapestAverage,
    priceLevel
  }
}

export function usePriceLogic(): ElectricityPriceDto {
  const [prices, setPrices] = useState<PriceEntry[]>([])

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
  })

  const cheapestTimeframe = findCheapestTimeframe(prices)

  return {
    bestTimeRangeToStart:
      cheapestTimeframe.startTime && cheapestTimeframe.endTime
        ? `${cheapestTimeframe.startTime} - ${cheapestTimeframe.endTime}`
        : 'Indlæser...',

    averagePriceInTimeRange:
      cheapestTimeframe.averagePrice > 0 ? cheapestTimeframe.averagePrice.toFixed(2) : '0.00',

    priceLevel: cheapestTimeframe.priceLevel
  }
}
