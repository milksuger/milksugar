"use client"

import { useState, useRef } from "react"
import Flashcard from "./flashcard"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Shuffle, KeyRound } from "lucide-react"
import type { VocabularyItem } from "@/data/vocabulary"
import type { WordProgress, WordStatus } from "@/hooks/use-vocabulary-progress"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"
import { useSwipeGesture } from "@/hooks/use-swipe-gesture"

interface FlashcardDeckProps {
  vocabulary: VocabularyItem[]
  speechRate?: number
  speechPitch?: number
  progress?: Record<number, WordProgress>
  onUpdateStatus?: (wordId: number, status: WordStatus) => void
}

export default function FlashcardDeck({
  vocabulary,
  speechRate = 1,
  speechPitch = 1,
  progress,
  onUpdateStatus,
}: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cards, setCards] = useState(vocabulary)
  const [showKeyboardHint, setShowKeyboardHint] = useState(true)
  const deckRef = useRef<HTMLDivElement>(null)

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : cards.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < cards.length - 1 ? prevIndex + 1 : 0))
  }

  const shuffleCards = () => {
    setCards([...cards].sort(() => Math.random() - 0.5))
    setCurrentIndex(0)
  }

  // 使用键盘导航
  useKeyboardNavigation({
    onPrevious: handlePrevious,
    onNext: handleNext,
    onRandom: shuffleCards,
    enabled: true,
  })

  // 使用滑动手势
  useSwipeGesture({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrevious,
    enabled: true,
  })

  // 隐藏键盘提示
  const hideKeyboardHint = () => {
    setShowKeyboardHint(false)
    localStorage.setItem("korean-app-keyboard-hint-shown", "true")
  }

  // 检查是否应该显示键盘提示
  useState(() => {
    const hintShown = localStorage.getItem("korean-app-keyboard-hint-shown")
    if (hintShown) {
      setShowKeyboardHint(false)
    }
  })

  return (
    <div className="flex flex-col items-center" ref={deckRef}>
      <div className="w-full mb-6 sm:mb-8 relative">
        <Flashcard
          card={cards[currentIndex]}
          speechRate={speechRate}
          speechPitch={speechPitch}
          progress={progress}
          onUpdateStatus={onUpdateStatus}
        />

        {/* 键盘导航提示 */}
        {showKeyboardHint && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-50 dark:bg-blue-900/70 text-blue-800 dark:text-blue-200 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md animate-pulse">
            <KeyRound size={12} />
            <span>使用方向键切换单词，空格键随机</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 ml-1 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800"
              onClick={hideKeyboardHint}
            >
              ×
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between w-full">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
          size="sm"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          上一个
        </Button>

        <div className="text-xs sm:text-sm text-gray-500">
          {currentIndex + 1} / {cards.length}
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
          size="sm"
        >
          下一个
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={shuffleCards}
        className="mt-4 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
        size="sm"
      >
        <Shuffle className="h-3 w-3 sm:h-4 sm:w-4" />
        随机排序
      </Button>
    </div>
  )
}

