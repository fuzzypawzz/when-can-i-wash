import { useEffect, useRef } from 'react'

export function useOnMount(callback: () => void) {
  const hookDidRun = useRef(false)

  useEffect(() => {
    if (hookDidRun.current) return

    hookDidRun.current = true
    callback()
  })
}
