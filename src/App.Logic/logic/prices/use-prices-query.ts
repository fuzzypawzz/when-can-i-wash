import { QueryObserver } from '@tanstack/query-core'
import { useSyncExternalStore } from 'react'

import { queryClient } from '@/App.Core/infrastructure/query-client/query-client'
import { findCheapestTimeframe } from '@/App.Logic/logic/prices/find-cheapest-timeframe'
import { priceClassDict } from '@/App.Logic/logic/prices/price-class-dictionary'
import { service_v1_prices } from '@/App.Service/service/user/get-prices'

export function usePricesQuery() {
  const observer = new QueryObserver(queryClient.get(), {
    queryKey: ['prices'],

    queryFn: () => {
      return service_v1_prices({
        year: 2025,
        month: '07',
        dayOfMonth: '19',
        priceClass: priceClassDict['Copenhagen/East']
      })
    },

    // ! Data should be normalized here
    select: findCheapestTimeframe,

    throwOnError: true
  })

  return useSyncExternalStore(
    (listener) => observer.subscribe(listener),
    () => observer.getCurrentResult()
  )
}
