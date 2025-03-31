"use client"

import { useState, useEffect } from "react"
import type { VocabularyItem } from "@/data/vocabulary"

// 单词学习状态
export type WordStatus = "new" | "learning" | "mastered"

// 单词进度类型
export interface WordProgress {
  id: number
  status: WordStatus
  lastReviewed: number // 时间戳
  reviewCount: number
}

export function useVocabularyProgress(vocabulary: VocabularyItem[]) {
  const [progress, setProgress] = useState<Record<number, WordProgress>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // 初始化或从本地存储加载进度
  useEffect(() => {
    const savedProgress = localStorage.getItem("korean-vocabulary-progress")

    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress))
      } catch (e) {
        console.error("Failed to parse saved progress", e)
        initializeProgress()
      }
    } else {
      initializeProgress()
    }

    setIsLoaded(true)
  }, [vocabulary])

  // 初始化所有单词的进度
  const initializeProgress = () => {
    const initialProgress: Record<number, WordProgress> = {}

    vocabulary.forEach((word) => {
      initialProgress[word.id] = {
        id: word.id,
        status: "new",
        lastReviewed: 0,
        reviewCount: 0,
      }
    })

    setProgress(initialProgress)
    localStorage.setItem("korean-vocabulary-progress", JSON.stringify(initialProgress))
  }

  // 更新单词状态
  const updateWordStatus = (wordId: number, status: WordStatus) => {
    setProgress((prev) => {
      const updatedProgress = {
        ...prev,
        [wordId]: {
          ...prev[wordId],
          status,
          lastReviewed: Date.now(),
          reviewCount: prev[wordId]?.reviewCount + 1 || 1,
        },
      }

      localStorage.setItem("korean-vocabulary-progress", JSON.stringify(updatedProgress))
      return updatedProgress
    })
  }

  // 重置所有进度
  const resetAllProgress = () => {
    initializeProgress()
  }

  // 获取学习统计信息
  const getStats = () => {
    const stats = {
      total: vocabulary.length,
      new: 0,
      learning: 0,
      mastered: 0,
    }

    Object.values(progress).forEach((word) => {
      stats[word.status]++
    })

    return stats
  }

  // 获取下一个要学习的单词
  const getNextWordToLearn = () => {
    // 优先选择新单词
    const newWords = vocabulary.filter((word) => progress[word.id]?.status === "new")
    if (newWords.length > 0) return newWords[0].id

    // 其次选择正在学习的单词
    const learningWords = vocabulary.filter((word) => progress[word.id]?.status === "learning")
    if (learningWords.length > 0) return learningWords[0].id

    // 最后选择已掌握的单词
    return vocabulary[0].id
  }

  return {
    progress,
    isLoaded,
    updateWordStatus,
    resetAllProgress,
    getStats,
    getNextWordToLearn,
  }
}

