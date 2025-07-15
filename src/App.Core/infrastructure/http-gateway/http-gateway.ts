export const httpGateway = (function () {
  function get(url: string) {
    return fetch(url)
  }

  return {
    get
  }
})()
