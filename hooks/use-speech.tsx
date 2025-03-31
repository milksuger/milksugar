"use client"

import { useState, useEffect, useRef } from "react"

interface UseSpeechOptions {
  lang?: string
  pitch?: number
  rate?: number
  volume?: number
}

export function useSpeech(options: UseSpeechOptions = {}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)

  // 使用 ref 存储最新的选项，以便在回调中访问
  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    // 检查浏览器支持
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSpeechSupported(true)

      // 获取可用语音
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        if (availableVoices.length > 0) {
          setVoices(availableVoices)
        }
      }

      // Chrome和Safari处理voices加载的方式不同
      loadVoices()
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }, [])

  const speak = (text: string) => {
    if (!isSpeechSupported) return

    // 停止任何正在播放的语音
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // 应用当前选项
    const currentOptions = optionsRef.current
    utterance.lang = currentOptions.lang || "ko-KR"
    utterance.pitch = currentOptions.pitch || 1
    utterance.rate = currentOptions.rate || 1
    utterance.volume = currentOptions.volume || 1

    // 尝试找到指定语言的声音
    const targetVoice = voices.find((voice) => voice.lang.includes(utterance.lang.split("-")[0]))
    if (targetVoice) {
      utterance.voice = targetVoice
    }

    // 设置播放状态
    setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
  }

  return {
    speak,
    isPlaying,
    isSpeechSupported,
    voices,
  }
}

