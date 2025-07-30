// https://www.elprisenligenu.dk/elpris-api
export type PriceEntry = {
  DKK_per_kWh: number
  EUR_per_kWh: number
  EXR: number

  // Example 2022-11-25T00:00:00+01:00
  time_start: string

  // Example 2022-11-25T01:00:00+01:00
  time_end: string
}
