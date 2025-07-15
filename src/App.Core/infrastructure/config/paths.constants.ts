export const paths = Object.freeze({
  applicationSubPath: '/',
  productionUrlPatterns: ['when-can-i-run-my-dishwasher.dk'],
  preproductionUrlPatterns: ['staging-when-can-i-run-my-dishwasher.dk'],
  get publicMockServiceWorkerPath() {
    return '/mockServiceWorker.js'
  }
})
