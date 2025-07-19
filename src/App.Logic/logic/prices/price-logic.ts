import { useState } from 'react'

import { useOnMount } from '@/App.Core/infrastructure/helpers/hook-helpers'
import { appRouter } from '@/App.Core/infrastructure/router/app-router'
import type { ElectricityPriceDto } from '@/App.Logic/dtos/electricity-price.dto'
import { priceClassDict } from '@/App.Logic/logic/prices/price-class-dictionary'
import type { PriceEntry } from '@/App.Service/models/prices/price-entry'
import { service_v1_prices } from '@/App.Service/service/user/get-prices'

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

  return {
    bestTimeRangeToStart: '12:00 - 17:00',
    averagePriceInTimeRange: '0.45',
    priceLevel: 'Medium'
  }
}
