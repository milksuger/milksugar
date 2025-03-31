"use client"

import { useState } from "react"
import FlashcardDeck from "@/components/flashcard-deck"
import VocabularyList from "@/components/vocabulary-list"
import SpeechSettings from "@/components/speech-settings"
import ThemeToggle from "@/components/theme-toggle"
import UserProfile from "@/components/user-profile"
import QuizMode from "@/components/quiz-mode"
import { koreanVocabulary } from "@/data/vocabulary"
import { useVocabularyProgress } from "@/hooks/use-vocabulary-progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Brain, WalletCardsIcon as Cards } from "lucide-react"

export default function Home() {
  const [speechRate, setSpeechRate] = useState(1)
  const [speechPitch, setSpeechPitch] = useState(1)
  const [activeView, setActiveView] = useState<"flashcards" | "vocabulary" | "quiz">("flashcards")

  const { progress, isLoaded, updateWordStatus, resetAllProgress, getStats } = useVocabularyProgress(koreanVocabulary)

  // 获取学习统计信息
  const stats = getStats()

  return (
    <main className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 relative transition-colors duration-300">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <UserProfile stats={stats} onReset={resetAllProgress} />
        <ThemeToggle />
        <SpeechSettings
          rate={speechRate}
          pitch={speechPitch}
          onRateChange={setSpeechRate}
          onPitchChange={setSpeechPitch}
        />
      </div>

      <div className="w-full max-w-md pt-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-blue-700 dark:text-blue-400">
          韩语单词学习
        </h1>
        <p className="text-center mb-6 text-sm sm:text-base text-gray-600 dark:text-gray-300">
          {activeView === "flashcards" && "点击卡片翻转查看答案"}
          {activeView === "vocabulary" && "浏览和搜索所有单词"}
          {activeView === "quiz" && "测试你的韩语词汇量"}
        </p>

        <div className="mb-6">
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="flashcards" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Cards className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>卡片</span>
              </TabsTrigger>
              <TabsTrigger value="vocabulary" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>单词本</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>测验</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoaded && (
          <>
            {activeView === "flashcards" && (
              <FlashcardDeck
                vocabulary={koreanVocabulary}
                speechRate={speechRate}
                speechPitch={speechPitch}
                progress={progress}
                onUpdateStatus={updateWordStatus}
              />
            )}

            {activeView === "vocabulary" && (
              <VocabularyList
                vocabulary={koreanVocabulary}
                speechRate={speechRate}
                speechPitch={speechPitch}
                progress={progress}
                onUpdateStatus={updateWordStatus}
              />
            )}

            {activeView === "quiz" && (
              <QuizMode vocabulary={koreanVocabulary} progress={progress} onUpdateStatus={updateWordStatus} />
            )}
          </>
        )}
      </div>
    </main>
  )
}

