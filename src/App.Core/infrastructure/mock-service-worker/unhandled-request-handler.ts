import { appMode } from '@/App.Core/infrastructure/app-mode'

/**
 * @example
 *
 * worker.start({ onUnhandledRequest })
 * server.listen({ onUnhandledRequest })
 */
export function onUnhandledRequest(
  request: Request,
  print: {
    warning: () => void
    error: () => void
  }
) {
  const isGetRequest = request.method === 'GET'

  function requestUrlContains(paths: string[]) {
    return paths.some((path) => request.url.includes(path))
  }

  const localDevelopmentAssetPaths = ['src/App', 'node_modules', 'chrome-extension']

  const storybookFilePaths = [
    '.storybook',
    '/iframe.html',
    'sb-common-assets',
    'axe-core.js',
    '/index.json'
  ]

  switch (true) {
    // Do not warn about individually fetching components and fonts, etc. during development.
    case requestUrlContains(localDevelopmentAssetPaths) && isGetRequest:
      break

    // Do not warn about internal storybook files
    case requestUrlContains(storybookFilePaths) && appMode.isStorybook:
      break

    default:
      print.warning()
  }
}
