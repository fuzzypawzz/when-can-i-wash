import { delay } from 'msw'

import { appMode } from '@/App.Core/infrastructure/app-mode'

type DelayOverride = number | 'infinite' | 'real'

export async function defaultDelay(override?: {
  isE2ETest?: DelayOverride
  isTest?: DelayOverride
  isOffline?: DelayOverride
}) {
  if (appMode.isE2ETest) await delay(override?.isE2ETest || 10)
  else if (appMode.isTest) await delay(override?.isTest || 10)
  else if (appMode.isOffline) await delay(override?.isOffline || 'real')
}
