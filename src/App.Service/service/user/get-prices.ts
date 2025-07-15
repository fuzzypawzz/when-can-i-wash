import { httpGateway } from '@/App.Core/infrastructure/http-gateway/http-gateway'
import type { PriceEntry } from '@/App.Service/models/prices/price-entry'

export async function service_user_getUserDetails(): Promise<PriceEntry[]> {
  const response = await httpGateway.get(
    'https://www.elprisenligenu.dk/api/v1/prices/2025/07-15_DK2.json'
  )

  return response.json()
}
