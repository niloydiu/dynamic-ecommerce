"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { Variant } from "../types"

interface VariantSelectorProps {
  variants: Variant[]
  selectedVariants: Record<string, string>
  onChange: (variants: Record<string, string>) => void
}

export function VariantSelector({ variants, selectedVariants, onChange }: VariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {variants.map((variant) => (
        <div key={variant.id} className="space-y-2">
          <Label className="font-semibold">{variant.name}</Label>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => (
              <Button
                key={option.id}
                variant={selectedVariants[variant.name] === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ ...selectedVariants, [variant.name]: option.value })}
                disabled={!option.inStock}
              >
                {option.value}
                {!option.inStock && " (Out)"}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
