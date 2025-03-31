"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Volume2, VolumeX, CheckCircle2, Circle, CircleDashed } from "lucide-react"
import { useSpeech } from "@/hooks/use-speech"
import type { VocabularyItem } from "@/data/vocabulary"
import type { WordProgress, WordStatus } from "@/hooks/use-vocabulary-progress"
import WordStatusBadge from "./word-status-badge"

interface VocabularyListProps {
  vocabulary: VocabularyItem[]
  speechRate: number
  speechPitch: number
  progress?: Record<number, WordProgress>
  onUpdateStatus?: (wordId: number, status: WordStatus) => void
}

export default function VocabularyList({
  vocabulary,
  speechRate,
  speechPitch,
  progress,
  onUpdateStatus,
}: VocabularyListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [playingId, setPlayingId] = useState<number | null>(null)
  const { speak, isPlaying, isSpeechSupported } = useSpeech({
    lang: "ko-KR",
    rate: speechRate,
    pitch: speechPitch,
  })

  // 过滤单词
  const filteredVocabulary = vocabulary.filter(
    (item) =>
      item.korean.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pronunciation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.exampleTranslation.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSpeak = (text: string, id: number) => {
    setPlayingId(id)
    speak(text)

    // 播放结束后重置状态
    setTimeout(() => {
      if (!isPlaying) setPlayingId(null)
    }, 2000)
  }

  const handleStatusUpdate = (wordId: number, status: WordStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(wordId, status)
    }
  }

  return (
    <div className="w-full">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          type="text"
          placeholder="搜索单词..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>

      <div className="space-y-3 max-h-[450px] sm:max-h-[600px] overflow-y-auto pr-1">
        {filteredVocabulary.length > 0 ? (
          filteredVocabulary.map((item) => {
            const currentStatus = progress?.[item.id]?.status || "new"

            return (
              <Card
                key={item.id}
                className={`border-l-4 ${
                  currentStatus === "new"
                    ? "border-l-blue-500"
                    : currentStatus === "learning"
                      ? "border-l-yellow-500"
                      : "border-l-green-500"
                }`}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-md sm:text-lg font-bold text-blue-700 dark:text-blue-400">{item.korean}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full ${playingId === item.id ? "bg-blue-100 dark:bg-blue-900" : ""}`}
                          onClick={() => handleSpeak(item.korean, item.id)}
                          disabled={!isSpeechSupported}
                        >
                          {playingId === item.id ? (
                            <Volume2 size={14} className="text-blue-500 animate-pulse" />
                          ) : isSpeechSupported ? (
                            <Volume2 size={14} />
                          ) : (
                            <VolumeX size={14} />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">[{item.pronunciation}]</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 sm:mt-0">
                      {progress && <WordStatusBadge status={currentStatus} />}
                      <p className="text-md sm:text-lg font-medium">{item.meaning}</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <p className="mb-1">例句：</p>
                    <p className="italic">{item.example}</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{item.exampleTranslation}</p>
                  </div>

                  {progress && onUpdateStatus && (
                    <div className="mt-2 pt-2 border-t flex justify-end gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-1 h-7 w-7 sm:h-8 sm:w-8 rounded-full ${currentStatus === "new" ? "bg-blue-100 dark:bg-blue-900 text-blue-500" : ""}`}
                        onClick={() => handleStatusUpdate(item.id, "new")}
                        title="标记为新单词"
                      >
                        <CircleDashed className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-1 h-7 w-7 sm:h-8 sm:w-8 rounded-full ${currentStatus === "learning" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-500" : ""}`}
                        onClick={() => handleStatusUpdate(item.id, "learning")}
                        title="标记为学习中"
                      >
                        <Circle className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-1 h-7 w-7 sm:h-8 sm:w-8 rounded-full ${currentStatus === "mastered" ? "bg-green-100 dark:bg-green-900 text-green-500" : ""}`}
                        onClick={() => handleStatusUpdate(item.id, "mastered")}
                        title="标记为已掌握"
                      >
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">没有找到匹配的单词</div>
        )}
      </div>

      <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4">
        共 {filteredVocabulary.length} 个单词
      </div>
    </div>
  )
}

