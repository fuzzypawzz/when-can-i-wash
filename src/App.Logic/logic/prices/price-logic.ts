import { useEffect } from 'react'

import { appRouter } from '@/App.Core/infrastructure/router/app-router'
import { usePricesQuery } from '@/App.Logic/logic/prices/use-prices-query'

export function usePriceLogic() {
  const pricesQuery = usePricesQuery()

  useEffect(() => {
    if (pricesQuery.isError) appRouter.goToErrorPage.internalAppError()
  }, [pricesQuery])

  return pricesQuery.data
}
