import { appMode } from '@/App.Core/infrastructure/app-mode'
import { developmentEnvironmentVariables } from '@/App.Core/infrastructure/config/public-env-variables/env.development'
import { preProductionEnvironmentVariables } from '@/App.Core/infrastructure/config/public-env-variables/env.preproduction'
import { productionEnvironmentVariables } from '@/App.Core/infrastructure/config/public-env-variables/env.production'

export const environmentVariables = {
  value: developmentEnvironmentVariables
}

export function loadPublicEnvironmentVariables() {
  const isDevelopmentMode = appMode.isDevelopment
  const isTestMode = appMode.isTest
  const isOfflineMode = appMode.isOffline
  const isPreproductionMode = appMode.isPreproduction
  const isProductionMode = appMode.isProduction

  if (isProductionMode) {
    environmentVariables.value = Object.freeze(productionEnvironmentVariables)

    return
  }

  if (isPreproductionMode) {
    environmentVariables.value = Object.freeze(preProductionEnvironmentVariables)

    return
  }

  if (isDevelopmentMode || isTestMode || isOfflineMode) {
    environmentVariables.value = Object.freeze(developmentEnvironmentVariables)

    return
  }

  throw new Error('Environment variables could not be loaded. The environment was not detected.')
}
