"use client"

import { useEffect } from "react"

interface UseKeyboardNavigationProps {
  onPrevious: () => void
  onNext: () => void
  onRandom: () => void
  enabled?: boolean
}

export function useKeyboardNavigation({ onPrevious, onNext, onRandom, enabled = true }: UseKeyboardNavigationProps) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          onPrevious()
          break
        case "ArrowRight":
          onNext()
          break
        case "ArrowUp":
          onPrevious()
          break
        case "ArrowDown":
          onNext()
          break
        case " ": // 空格键
          event.preventDefault() // 防止页面滚动
          onRandom()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onPrevious, onNext, onRandom, enabled])
}

