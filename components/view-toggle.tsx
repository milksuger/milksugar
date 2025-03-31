"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, WalletCardsIcon as Cards } from "lucide-react"

interface ViewToggleProps {
  activeView: "flashcards" | "vocabulary"
  onViewChange: (view: "flashcards" | "vocabulary") => void
}

export default function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex justify-center mb-6">
      <Tabs value={activeView} onValueChange={(value) => onViewChange(value as "flashcards" | "vocabulary")}>
        <TabsList className="grid grid-cols-2 w-[300px]">
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <Cards className="h-4 w-4" />
            <span>卡片模式</span>
          </TabsTrigger>
          <TabsTrigger value="vocabulary" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>单词本</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

