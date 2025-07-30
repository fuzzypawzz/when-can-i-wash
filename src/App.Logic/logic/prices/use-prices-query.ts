import { QueryObserver } from '@tanstack/query-core'
import { useCallback, useMemo, useSyncExternalStore } from 'react'

import { queryClient } from '@/App.Core/infrastructure/query-client/query-client'
import { findCheapestTimeframe } from '@/App.Logic/logic/prices/find-cheapest-timeframe'
import { priceClassDict } from '@/App.Logic/logic/prices/price-class-dictionary'
import { service_v1_prices } from '@/App.Service/service/get-prices.ts'

export function usePricesQuery() {
  const observer = useMemo(
    () =>
      new QueryObserver(queryClient.get(), {
        queryKey: ['prices'],

        queryFn: () => {
          return service_v1_prices({
            year: 2025,
            month: '07',
            dayOfMonth: '19',
            priceClass: priceClassDict['Copenhagen/East']
          })
        },

        select: (prices) => findCheapestTimeframe(prices),

        throwOnError: true
      }),
    []
  )

  const subscribe = useCallback((listener: () => void) => observer.subscribe(listener), [observer])
  const getSnapshot = useCallback(() => observer.getCurrentResult(), [observer])

  return useSyncExternalStore(subscribe, getSnapshot)
}
