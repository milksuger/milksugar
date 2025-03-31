"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import StatsDashboard from "./stats-dashboard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface UserProfileProps {
  stats: {
    total: number
    new: number
    learning: number
    mastered: number
  }
  onReset: () => void
}

export default function UserProfile({ stats, onReset }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-white dark:bg-gray-800 shadow-md">
          <User className="h-5 w-5" />
          <span className="sr-only">我的</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>我的学习</SheetTitle>
        </SheetHeader>

        <div className="py-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt="用户头像" />
              <AvatarFallback>学</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">韩语学习者</h2>
              <p className="text-sm text-muted-foreground">已学习 {stats.learning + stats.mastered} 个单词</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">学习统计</h3>
            <StatsDashboard stats={stats} onReset={onReset} />
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">学习设置</h3>
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start" onClick={() => setIsOpen(false)}>
                继续学习
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  onReset()
                  setIsOpen(false)
                }}
              >
                重置进度
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Button className="w-full" onClick={() => setIsOpen(false)}>
            返回学习
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

