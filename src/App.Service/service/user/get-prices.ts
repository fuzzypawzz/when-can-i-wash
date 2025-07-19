import { httpGateway } from '@/App.Core/infrastructure/http-gateway/http-gateway'
import type { PriceEntry } from '@/App.Service/models/prices/price-entry'

/**
 * Gets the electricity prices as JSON.
 * Endpoint documentation: https://www.elprisenligenu.dk/elpris-api
 */
export async function service_v1_prices(args: {
  year: number
  /**
   * 01 = January
   * 07 = July
   */
  month: string

  /**
   * 03 = Third day of the month
   * 14 = 14th day of the month
   */
  dayOfMonth: string
  /**
   * DK1 = Aarhus / Vest for Storebælt
   * DK2 = København / Øst for Storebælt
   */
  priceClass: 'DK1' | 'DK2'
}): Promise<PriceEntry[]> {
  /* Example url: https://www.elprisenligenu.dk/api/v1/prices/2025/07-19_DK2.json */

  const response = await httpGateway.get(
    `https://www.elprisenligenu.dk/api/v1/prices/${args.year}/${args.month}-${args.dayOfMonth}_${args.priceClass}.json`
  )

  return response.json()
}
