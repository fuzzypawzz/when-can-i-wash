export function urlIncludes(path: string) {
  return window.location.href.includes(path)
}

export function matchesUrlPattern(urlPattern: RegExp) {
  return urlPattern.test(window.location.href)
}
