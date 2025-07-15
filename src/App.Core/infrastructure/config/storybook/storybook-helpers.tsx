import type { Meta } from '@storybook/react-vite'

import { bootstrap } from '@/App.Core/app/bootstrap'
import RootForStorybook from '@/App.Core/infrastructure/config/storybook/Root.tsx'
import { appEventHub } from '@/App.Core/infrastructure/helpers/event-hub.ts'
import { Observable } from '@/App.Core/infrastructure/helpers/observable/observable'
import type { appRouter } from '@/App.Core/infrastructure/router/app-router'

export const storybook = (function () {
  const observable = new Observable<{ eventName: 'ready' | 'story-context-changed' }>()
  const currentState = { value: 'IDLE' as 'IDLE' | 'READY' }

  /**
   * Removes the web hash state that the Router uses when mounted in Storybook.
   */
  function removeWebHashHistoryFromUrl(url: string) {
    return url.split('#')[0]
  }

  const createStoryMeta = {
    /**
     * @description
     * Convenience function to start the entire app inside a story. Use the appRouter to
     * navigate to the desired route. This is often used in combination with UI regression/snapshot
     * testing where it can be really beneficial to take snapshots of the whole app.
     *
     * Use this function to construct the meta object for stories.
     * Use it together with storybook.onAppReady and storybook.controlAppRouter.
     */
    mountWholeApp: function <Component extends Meta['component']>(args: {
      relatedComponentOrPage: Component
      includedIn?: Component
      chromaticDelay?: number | false
      chromaticMode?: 'all'
    }) {
      return {
        component: args.relatedComponentOrPage,

        render: RootForStorybook,

        loaders: [
          async function appIntegrationSetup() {
            storybook.listenForRouterReady()
            bootstrap()
          }
        ],

        parameters: {
          chromatic: {
            delay: args.chromaticDelay === false ? 0 : args.chromaticDelay || 1000
          },
          layout: 'fullscreen'
        }
      } satisfies Meta
    },

    /**
     * @description
     * Convenience function for stories where you want to render specific components, instead
     * of using the appRouter to route to specific pages before render.
     * Use this function to construct the meta object for stories.
     */
    mountAppForComponentRender: function <Component extends Meta['component']>(args: {
      relatedComponentOrPage: Component
      chromaticDelay?: number
    }) {
      return {
        component: args.relatedComponentOrPage,

        loaders: [
          async function applicationSetup() {
            storybook.listenForAppReady()
            bootstrap({ withRender: false })
            await storybook.waitUntilAppReady()
          }
        ],

        parameters: {
          chromatic: { delay: args.chromaticDelay || 1000 },
          layout: 'fullscreen'
        }
      } satisfies Meta<Component>
    }
  }

  return {
    createStoryMeta,

    /**
     * Listen for the app to get to the "ready" state.
     */
    listenForAppReady(): void {
      appEventHub.on('app-started', () => {
        observable.notify({ eventName: 'ready' })
      })

      observable.subscribe((event) => {
        if (event.eventName === 'ready') {
          currentState.value = 'READY'
        }
      })
    },

    /**
     * Listen for the app router to get to the "ready" state.
     */
    listenForRouterReady(): void {
      appEventHub.on('router-is-ready', () => {
        observable.notify({ eventName: 'ready' })
      })

      observable.subscribe((event) => {
        if (event.eventName === 'ready') {
          currentState.value = 'READY'
        }
      })
    },

    /**
     * Use this to subscribe to the app ready event to run
     * side effects like registration of request handlers and
     * controlling the app router to navigate.
     */
    onAppReady(sideEffect: () => void): void {
      observable.subscribe((event) => {
        if (event.eventName === 'ready') sideEffect()
      })
    },

    /**
     * Returns a promise that resolves once the app is ready for interaction.
     * You must call listenForAppReady() first.
     */
    waitUntilAppReady(): Promise<void> {
      return new Promise((resolve) => this.onAppReady(() => resolve()))
    },

    /**
     * Used to see whether the app is ready for interaction.
     */
    get appIsReady(): boolean {
      return currentState.value === 'READY'
    },

    controlAppRouter(
      callback: (
        appRouterControls: ReturnType<typeof appRouter.useNavigation>
      ) => void | Promise<void>
    ) {
      const event = new CustomEvent('external-navigation-event', {
        detail: { callback }
      })

      window.dispatchEvent(event)
    },

    /**
     * Clean up storybook iFrame, removing the web has history and causing a reload.
     * Use it when switching between stories.
     */
    cleanUp(): void {
      observable.unsubscribeAll()
      currentState.value = 'IDLE'
      window.location.href = removeWebHashHistoryFromUrl(window.location.href)
    }
  }
})()
