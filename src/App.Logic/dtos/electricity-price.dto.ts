export type ElectricityPriceDto = {
  bestTimeRangeToStart: string
  averagePriceInTimeRange: string
  priceLevel: 'Cheap' | 'Medium' | 'Expensive'
  isLoadingPrices: boolean
}
