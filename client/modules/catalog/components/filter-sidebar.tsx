"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import type { Category } from "../types";

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory?: string;
  priceRange?: [number, number];
  onCategoryChange?: (category: string | undefined) => void;
  onPriceChange?: (range: [number, number]) => void;
  onReset?: () => void;
}

export function FilterSidebar({
  categories,
  selectedCategory,
  priceRange = [0, 1000],
  onCategoryChange,
  onPriceChange,
  onReset,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [localPrice, setLocalPrice] = useState<[number, number]>(priceRange);

  const hasActiveFilters =
    selectedCategory || priceRange[0] > 0 || priceRange[1] < 1000;

  return (
    <div className="w-full lg:w-64 space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between lg:block">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle filters"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {!isOpen && <div className="lg:hidden" />}

      {/* Filters Container */}
      <div className={`space-y-6 ${!isOpen ? "hidden lg:block" : ""}`}>
        {/* Categories */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <Checkbox
                  id={category.id}
                  checked={selectedCategory === category.slug}
                  onCheckedChange={(checked) => {
                    onCategoryChange?.(checked ? category.slug : undefined);
                  }}
                />
                <Label
                  htmlFor={category.id}
                  className="ml-2 cursor-pointer text-sm font-normal flex-1"
                >
                  {category.name}
                </Label>
                {category.productCount && (
                  <span className="text-xs text-muted-foreground">
                    ({category.productCount})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Price Range</h3>
          <Slider
            value={localPrice}
            min={0}
            max={1000}
            step={10}
            onValueChange={(value) => {
              const newRange: [number, number] = [value[0], value[1]];
              setLocalPrice((prev) =>
                prev[0] === newRange[0] && prev[1] === newRange[1]
                  ? prev
                  : newRange
              );
              onPriceChange?.(newRange);
            }}
            className="w-full"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              max={localPrice[1]}
              value={localPrice[0]}
              onChange={(e) => {
                const newMin = Number(e.target.value);
                setLocalPrice((prev) => {
                  const cand: [number, number] = [newMin, prev[1]];
                  return prev[0] === cand[0] && prev[1] === cand[1]
                    ? prev
                    : cand;
                });
              }}
              onBlur={() => onPriceChange?.(localPrice)}
              className="h-9"
              placeholder="Min"
            />
            <Input
              type="number"
              min={localPrice[0]}
              max="1000"
              value={localPrice[1]}
              onChange={(e) => {
                const newMax = Number(e.target.value);
                setLocalPrice((prev) => {
                  const cand: [number, number] = [prev[0], newMax];
                  return prev[0] === cand[0] && prev[1] === cand[1]
                    ? prev
                    : cand;
                });
              }}
              onBlur={() => onPriceChange?.(localPrice)}
              className="h-9"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            className="w-full gap-2 bg-transparent"
            onClick={() => {
              setLocalPrice([0, 1000]);
              onReset?.();
            }}
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
