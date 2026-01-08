"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CatalogFilters } from "../types"

interface SortDropdownProps {
  value?: CatalogFilters["sortBy"]
  onChange?: (value: CatalogFilters["sortBy"]) => void
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
]

export function SortDropdown({ value = "newest", onChange }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={(newValue) => onChange?.(newValue as CatalogFilters["sortBy"])}>
      <SelectTrigger className="w-full md:w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
