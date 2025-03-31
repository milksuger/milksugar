"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { VocabularyItem } from "@/data/vocabulary"
import type { WordProgress } from "@/hooks/use-vocabulary-progress"
import { CheckCircle2, XCircle } from "lucide-react"

interface QuizModeProps {
  vocabulary: VocabularyItem[]
  progress: Record<number, WordProgress>
  onUpdateStatus: (wordId: number, status: "new" | "learning" | "mastered") => void
}

export default function QuizMode({ vocabulary, progress, onUpdateStatus }: QuizModeProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [quizWords, setQuizWords] = useState<VocabularyItem[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  // 初始化测验单词
  useEffect(() => {
    // 选择所有非掌握状态的单词
    const wordsToQuiz = vocabulary.filter((word) => progress[word.id]?.status !== "mastered")

    // 如果没有非掌握的单词，使用所有单词
    if (wordsToQuiz.length === 0) {
      setQuizWords([...vocabulary].sort(() => Math.random() - 0.5).slice(0, 10))
    } else {
      // 随机选择最多10个单词
      setQuizWords([...wordsToQuiz].sort(() => Math.random() - 0.5).slice(0, 10))
    }

    setCurrentWordIndex(0)
    setShowAnswer(false)
    setQuizCompleted(false)
    setScore({ correct: 0, total: 0 })
  }, [vocabulary, progress])

  const currentWord = quizWords[currentWordIndex]

  const handleShowAnswer = () => {
    setShowAnswer(true)
  }

  const handleAnswer = (correct: boolean) => {
    // 更新分数
    setScore((prev) => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }))

    // 更新单词状态
    if (correct) {
      // 如果答对，根据当前状态提升
      const currentStatus = progress[currentWord.id]?.status
      if (currentStatus === "new") {
        onUpdateStatus(currentWord.id, "learning")
      } else if (currentStatus === "learning") {
        onUpdateStatus(currentWord.id, "mastered")
      }
    } else {
      // 如果答错，设为学习中
      onUpdateStatus(currentWord.id, "learning")
    }

    // 移动到下一个单词或完成测验
    if (currentWordIndex < quizWords.length - 1) {
      setCurrentWordIndex((prev) => prev + 1)
      setShowAnswer(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    // 重新初始化测验
    const wordsToQuiz = vocabulary.filter((word) => progress[word.id]?.status !== "mastered")

    if (wordsToQuiz.length === 0) {
      setQuizWords([...vocabulary].sort(() => Math.random() - 0.5).slice(0, 10))
    } else {
      setQuizWords([...wordsToQuiz].sort(() => Math.random() - 0.5).slice(0, 10))
    }

    setCurrentWordIndex(0)
    setShowAnswer(false)
    setQuizCompleted(false)
    setScore({ correct: 0, total: 0 })
  }

  if (!currentWord) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-lg text-gray-500 mb-4">没有可用的测验单词</p>
        <Button onClick={restartQuiz}>重新开始</Button>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">测验完成!</h2>
        <p className="text-lg mb-6">
          得分: {score.correct} / {score.total} ({Math.round((score.correct / score.total) * 100)}%)
        </p>
        <Button onClick={restartQuiz}>再次测验</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mb-4 text-sm text-gray-500 flex justify-between">
        <span>
          问题 {currentWordIndex + 1} / {quizWords.length}
        </span>
        <span>
          得分: {score.correct} / {score.total}
        </span>
      </div>

      <Card className="w-full mb-6">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">你知道这个单词的意思吗?</p>
            <h3 className="text-3xl font-bold mb-4 text-blue-700">{currentWord.korean}</h3>
            <p className="text-gray-500 mb-6">[{currentWord.pronunciation}]</p>

            {showAnswer ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xl font-medium">{currentWord.meaning}</p>
                  <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{currentWord.example}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentWord.exampleTranslation}</p>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleAnswer(false)}
                  >
                    <XCircle className="h-5 w-5" />
                    不认识
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-green-200 text-green-600 hover:bg-green-50"
                    onClick={() => handleAnswer(true)}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    认识
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={handleShowAnswer}>显示答案</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

