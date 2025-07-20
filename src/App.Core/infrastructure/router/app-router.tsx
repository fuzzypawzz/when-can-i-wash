import { useEffect } from 'react'
import { Outlet, RouterProvider, createBrowserRouter, createMemoryRouter } from 'react-router'

import { appMode } from '@/App.Core/infrastructure/app-mode'
import { appEventHub } from '@/App.Core/infrastructure/helpers/event-hub'
import { routeTable } from '@/App.Core/infrastructure/router/route-table'

export const appRouter = (function () {
  let router: ReturnType<typeof createBrowserRouter>

  createRouterInstance()

  function createRouterInstance() {
    router = appMode.isStorybook ? createMemoryRouter(routeTable) : createBrowserRouter(routeTable)
  }

  function AppRouterProvider() {
    if (!router) throw Error('Router has not been instanciated yet. This is likely a code bug.')

    useEffect(() => {
      appEventHub.send('router-is-ready')
    }, [])

    return <RouterProvider router={router} />
  }

  return {
    AppRouterProvider,
    createRouterInstance,
    Outlet,

    get currentPathName() {
      return router.state.location.pathname
    },

    get goToPage() {
      return {
        root: () => {
          return router.navigate('/')
        }
      }
    },

    get goToErrorPage() {
      return {
        internalAppError: () => {
          return router.navigate('/fejl')
        }
      }
    },

    goToRawPath(path: string, options = { replace: false }) {
      return router.navigate(path, options)
    }
  }
})()
