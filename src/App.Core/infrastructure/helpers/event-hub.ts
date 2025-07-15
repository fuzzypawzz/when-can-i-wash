export type AppEventName = 'worker-ready' | 'app-started' | 'router-is-ready'

export const appEventHub = (function () {
  return {
    /**
     * Dispatch a custom event from the app to communicate between
     * modules in the browser. Ideal for communication with Storybook or Playwright.
     */
    send(eventName: AppEventName) {
      const event = new CustomEvent(eventName)
      window.dispatchEvent(event)
    },

    /**
     * Listen on custom events from the app.
     */
    on(eventName: AppEventName, cb: () => void) {
      window.addEventListener(eventName, cb)

      return function cleanUp() {
        window.removeEventListener(eventName, cb)
      }
    }
  }
})()
