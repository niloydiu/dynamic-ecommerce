"use client"

import type React from "react"

import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  size?: "sm" | "md" | "lg"
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
  size = "md",
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1)
  }

  const handleIncrement = () => {
    if (value < max) onChange(value + 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value) || min
    if (newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  const sizeClasses = {
    sm: "h-8 px-2 text-xs",
    md: "h-10 px-3 text-sm",
    lg: "h-12 px-4 text-base",
  }

  const buttonSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <div className="flex items-center border border-border rounded-lg bg-background">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("rounded-none", buttonSizes[size])}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className={iconSizes[size]} />
      </Button>

      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className={cn("border-0 text-center bg-transparent", sizeClasses[size])}
        aria-label="Product quantity"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("rounded-none", buttonSizes[size])}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className={iconSizes[size]} />
      </Button>
    </div>
  )
}
