"use client"

import { useRef, useEffect, useCallback } from "react"

interface UseSwipeGestureProps {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  threshold?: number
  enabled?: boolean
}

export function useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold = 50, enabled = true }: UseSwipeGestureProps) {
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const mouseStartX = useRef<number | null>(null)
  const isMouseDown = useRef(false)

  const handleSwipe = useCallback(
    (startX: number | null, endX: number | null) => {
      if (!startX || !endX) return

      const diff = startX - endX

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // 向左滑动/拖动
          onSwipeLeft()
        } else {
          // 向右滑动/拖动
          onSwipeRight()
        }
      }
    },
    [onSwipeLeft, onSwipeRight, threshold],
  )

  useEffect(() => {
    if (!enabled) return

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
      handleSwipe(touchStartX.current, touchEndX.current)

      // 重置
      touchStartX.current = null
      touchEndX.current = null
    }

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown.current = true
      mouseStartX.current = e.clientX
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown.current) return
      touchEndX.current = e.clientX
    }

    const handleMouseUp = () => {
      if (!isMouseDown.current || !mouseStartX.current || !touchEndX.current) {
        isMouseDown.current = false
        return
      }

      handleSwipe(mouseStartX.current, touchEndX.current)

      // 重置
      isMouseDown.current = false
      mouseStartX.current = null
      touchEndX.current = null
    }

    // 添加触摸事件监听器
    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    // 添加鼠标事件监听器
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      // 移除触摸事件监听器
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)

      // 移除鼠标事件监听器
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [onSwipeLeft, onSwipeRight, threshold, enabled, handleSwipe])
}

