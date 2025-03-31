"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SpeechSettingsProps {
  rate: number
  pitch: number
  onRateChange: (value: number) => void
  onPitchChange: (value: number) => void
}

export default function SpeechSettings({ rate, pitch, onRateChange, onPitchChange }: SpeechSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-white shadow-md">
          <Settings className="h-5 w-5" />
          <span className="sr-only">语音设置</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">语音设置</h4>
            <p className="text-sm text-muted-foreground">调整韩语发音的语速和音调</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="rate">语速</Label>
              <Slider
                id="rate"
                min={0.5}
                max={2}
                step={0.1}
                value={[rate]}
                onValueChange={(value) => onRateChange(value[0])}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="pitch">音调</Label>
              <Slider
                id="pitch"
                min={0.5}
                max={2}
                step={0.1}
                value={[pitch]}
                onValueChange={(value) => onPitchChange(value[0])}
                className="col-span-2"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

