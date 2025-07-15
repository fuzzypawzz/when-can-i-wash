import { type RenderHookOptions, type RenderHookResult, renderHook } from '@testing-library/react'
import type { PropsWithChildren, ReactElement } from 'react'
import { MemoryRouter } from 'react-router'

import { appEventHub } from '@/App.Core/infrastructure/helpers/event-hub'

export const appTestHarness = (function () {
  function waitForAppToStart(): Promise<void> {
    return new Promise((resolve, reject) => {
      const dispose = appEventHub.on('app-started', () => {
        resolve()
        dispose()
      })

      setTimeout(() => {
        reject('AppTestHarness: The app did not start within the specified timeframe.')
      }, 3000)
    })
  }

  function RouterTestWrapper({ children }: PropsWithChildren<unknown>): ReactElement {
    return <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
  }

  /**
   * Render a hook under a MemoryRouter so that `useNavigate`, `useLocation`, etc. work.
   * The generic signatures are the same as `renderHook`.
   */
  function renderHookWithRouter<Result, Props>(
    renderFn: (initialProps: Props) => Result,
    renderFnOptions?: Omit<RenderHookOptions<Props>, 'wrapper'>
  ): RenderHookResult<Result, Props> {
    return renderHook(renderFn, {
      wrapper: appTestHarness.RouterTestWrapper,
      ...renderFnOptions
    })
  }

  return {
    waitForAppToStart,
    RouterTestWrapper,
    renderHookWithRouter
  }
})()
