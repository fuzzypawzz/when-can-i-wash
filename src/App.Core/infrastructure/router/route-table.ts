import { type RouteObject } from 'react-router'

import { App } from '@/App.UI/components/app/App'
import InternalAppError from '@/App.UI/pages/error/internal-app-error/internal-app-error'
import { FrontPage } from '@/App.UI/pages/front-page/front-page'

type RouteTable = RouteObject[]

export const routeTable: RouteTable = [
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        Component: FrontPage
      }
    ]
  },
  {
    path: '/fejl',
    Component: InternalAppError
  }
]
