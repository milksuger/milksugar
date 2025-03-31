"use client"

import { Badge } from "@/components/ui/badge"
import type { WordStatus } from "@/hooks/use-vocabulary-progress"

interface WordStatusBadgeProps {
  status: WordStatus
}

export default function WordStatusBadge({ status }: WordStatusBadgeProps) {
  const getStatusDetails = (status: WordStatus) => {
    switch (status) {
      case "new":
        return { label: "新单词", variant: "default" as const, className: "bg-blue-500" }
      case "learning":
        return { label: "学习中", variant: "secondary" as const, className: "bg-yellow-500" }
      case "mastered":
        return { label: "已掌握", variant: "outline" as const, className: "bg-green-500 text-white border-green-500" }
      default:
        return { label: "未知", variant: "outline" as const, className: "" }
    }
  }

  const { label, variant, className } = getStatusDetails(status)

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}

