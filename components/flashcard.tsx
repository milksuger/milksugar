"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Volume2, VolumeX, CheckCircle2, Circle, CircleDashed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSpeech } from "@/hooks/use-speech"
import type { VocabularyItem } from "@/data/vocabulary"
import type { WordProgress, WordStatus } from "@/hooks/use-vocabulary-progress"
import WordStatusBadge from "./word-status-badge"

interface FlashcardProps {
  card: VocabularyItem
  speechRate?: number
  speechPitch?: number
  progress?: Record<number, WordProgress>
  onUpdateStatus?: (wordId: number, status: WordStatus) => void
}

export default function Flashcard({ card, speechRate = 1, speechPitch = 1, progress, onUpdateStatus }: FlashcardProps) {
  const { speak, isPlaying, isSpeechSupported } = useSpeech({
    lang: "ko-KR",
    rate: speechRate,
    pitch: speechPitch,
  })

  const speakKorean = (text: string, event?: React.MouseEvent) => {
    event?.stopPropagation()
    speak(text)
  }

  const handleStatusUpdate = (status: WordStatus, event: React.MouseEvent) => {
    event.stopPropagation()
    if (onUpdateStatus) {
      onUpdateStatus(card.id, status)
    }
  }

  const currentStatus = progress?.[card.id]?.status || "new"

  // 高亮韩文单词的函数
  const highlightKorean = (text: string) => {
    return (
      <span className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
        {text}
      </span>
    )
  }

  return (
    <Card className="w-full h-[350px] sm:h-[400px] p-4 sm:p-6 flex flex-col items-center justify-between bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-900 rounded-xl shadow-lg relative">
      {progress && (
        <div className="absolute top-3 right-3">
          <WordStatusBadge status={currentStatus} />
        </div>
      )}

      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <div className="mb-3 sm:mb-4 text-center">{highlightKorean(card.korean)}</div>
        <div className="text-md sm:text-lg text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">[{card.pronunciation}]</div>

        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 mb-4 ${isPlaying ? "bg-blue-100 dark:bg-blue-900" : ""}`}
          onClick={(e) => speakKorean(card.korean, e)}
          disabled={isPlaying || !isSpeechSupported}
        >
          {isPlaying ? (
            <Volume2 className="h-4 w-4 text-blue-500 animate-pulse" />
          ) : isSpeechSupported ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
          听发音
        </Button>

        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold mb-2 text-purple-700 dark:text-purple-400">{card.meaning}</div>
          <div className="text-sm sm:text-md mb-1 text-gray-700 dark:text-gray-300">例句:</div>
          <div className="text-sm sm:text-md mb-1 text-gray-800 dark:text-gray-200 text-center">{card.example}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">
            {card.exampleTranslation}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 mt-2 ${isPlaying ? "bg-purple-100 dark:bg-purple-900" : ""}`}
          onClick={(e) => speakKorean(card.example, e)}
          disabled={isPlaying || !isSpeechSupported}
        >
          {isPlaying ? (
            <Volume2 className="h-4 w-4 text-purple-500 animate-pulse" />
          ) : isSpeechSupported ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
          听例句
        </Button>
      </div>

      {progress && onUpdateStatus && (
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 h-7 w-7 sm:h-8 sm:w-8 rounded-full ${currentStatus === "new" ? "bg-blue-100 dark:bg-blue-900 text-blue-500" : ""}`}
            onClick={(e) => handleStatusUpdate("new", e)}
            title="标记为新单词"
          >
            <CircleDashed className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 h-7 w-7 sm:h-8 sm:w-8 rounded-full ${currentStatus === "learning" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-500" : ""}`}
            onClick={(e) => handleStatusUpdate("learning", e)}
            title="标记为学习中"
          >
            <Circle className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 h-7 w-7 sm:h-8 sm:w-8 rounded-full ${currentStatus === "mastered" ? "bg-green-100 dark:bg-green-900 text-green-500" : ""}`}
            onClick={(e) => handleStatusUpdate("mastered", e)}
            title="标记为已掌握"
          >
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      )}
    </Card>
  )
}

