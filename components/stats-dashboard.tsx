"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { WordStatus } from "@/hooks/use-vocabulary-progress"

interface StatsDashboardProps {
  stats: {
    total: number
    new: number
    learning: number
    mastered: number
  }
  onReset: () => void
}

export default function StatsDashboard({ stats, onReset }: StatsDashboardProps) {
  const getStatusColor = (status: WordStatus) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "learning":
        return "bg-yellow-500"
      case "mastered":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const calculatePercentage = (value: number) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>新单词</span>
              <span className="font-medium">
                {stats.new} / {stats.total}
              </span>
            </div>
            <Progress
              value={calculatePercentage(stats.new)}
              className="h-2 bg-gray-100"
              indicatorClassName="bg-blue-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>学习中</span>
              <span className="font-medium">
                {stats.learning} / {stats.total}
              </span>
            </div>
            <Progress
              value={calculatePercentage(stats.learning)}
              className="h-2 bg-gray-100"
              indicatorClassName="bg-yellow-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>已掌握</span>
              <span className="font-medium">
                {stats.mastered} / {stats.total}
              </span>
            </div>
            <Progress
              value={calculatePercentage(stats.mastered)}
              className="h-2 bg-gray-100"
              indicatorClassName="bg-green-500"
            />
          </div>

          <div className="pt-2 flex justify-between text-sm text-muted-foreground">
            <span>总进度</span>
            <span>{calculatePercentage(stats.mastered)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

