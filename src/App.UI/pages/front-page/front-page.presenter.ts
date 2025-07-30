import type { SlBadge } from '@shoelace-style/shoelace'

import { usePriceLogic } from '@/App.Logic/logic/prices/price-logic'

type BadgeVariant = SlBadge['variant']

export function useFrontPagePresenter() {
  const dto = usePriceLogic()

  const badgeText = {
    Cheap: 'Billigt',
    Medium: 'Mellemdyrt',
    Expensive: 'Dyrt'
  }[dto?.priceLevel || 'Cheap']

  const badgeVariant: BadgeVariant = {
    Cheap: 'success' as const,
    Medium: 'warning' as const,
    Expensive: 'danger' as const
  }[dto?.priceLevel || 'Cheap']

  return {
    viewModel: {
      optimalTimeText: 'Det bedste tidspunkt (i dag) at starte din vaskemaskine er',
      timeRange: dto?.bestTimeRangeToStart || '',
      averagePrice: dto?.averagePriceInTimeRange || '',
      priceUnit: 'kr. per kWh',
      dishwasherIcon: 'dish-washer',
      badgeText: badgeText,
      badgeVariant: badgeVariant
    }
  }
}
