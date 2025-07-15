import { appRouter } from '@/App.Core/infrastructure/router/app-router'
import '@/App.UI/assets/styles/style.scss'

export const App = () => {
  return (
    <div>
      <appRouter.Outlet />
    </div>
  )
}
