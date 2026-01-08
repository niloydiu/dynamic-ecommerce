"use client"

import { useState, useCallback } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { debounce } from "@/lib/utils"

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Search products..." }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch?.(value)
    }, 300),
    [onSearch],
  )

  const handleChange = (value: string) => {
    setQuery(value)
    debouncedSearch(value)
  }

  const handleClear = () => {
    setQuery("")
    onSearch?.("")
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center bg-muted rounded-lg px-3 py-2 border border-border focus-within:ring-1 focus-within:ring-ring">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="ml-2 flex-1 bg-transparent text-sm outline-none border-0"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  )
}
