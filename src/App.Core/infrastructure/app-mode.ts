import { paths } from '@/App.Core/infrastructure/config/paths.constants'
import { urlIncludes } from '@/App.Core/infrastructure/helpers/url-includes'

export const appMode = Object.freeze({
  get isOffline() {
    return import.meta.env?.MODE === 'offline' || import.meta.env?.VITE_STORYBOOK
  },

  get isDevelopment() {
    return import.meta.env?.MODE === 'development'
  },

  get isTest() {
    return import.meta.env?.MODE === 'test'
  },

  // Used by Playwright
  get isE2ETest() {
    return import.meta.env?.VITE_E2E_TEST
  },

  get isStorybook() {
    return !!import.meta.env?.VITE_STORYBOOK
  },

  // About isLegacy: https://www.npmjs.com/package/@vitejs/plugin-legacy
  get isLegacyProductionBuild() {
    return import.meta.env?.LEGACY
  },

  get isPreproduction() {
    const isPreproductionUrl = paths.preproductionUrlPatterns.some(urlIncludes)

    return urlIncludes(paths.applicationSubPath) && isPreproductionUrl
  },

  get isProduction() {
    if (this.isLegacyProductionBuild) return true

    const isProductionUrl = paths.productionUrlPatterns.some(urlIncludes)

    return urlIncludes(paths.applicationSubPath) && isProductionUrl
  },

  get currentAppMode() {
    return this.isProduction ? 'prod' : this.isPreproduction ? 'preprod' : import.meta.env.MODE
  }
})
