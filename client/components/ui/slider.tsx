"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  // Compute stable internal values to prevent re-render loops when parents
  // pass new array references that contain the same numeric values.
  const _value = React.useMemo(() => {
    if (!Array.isArray(value)) return undefined;
    return [value[0], value[1]] as [number, number];
  }, [value?.[0], value?.[1]]);

  const _defaultValue = React.useMemo(() => {
    if (!Array.isArray(defaultValue)) return [min, max] as [number, number];
    return [defaultValue[0], defaultValue[1]] as [number, number];
  }, [defaultValue?.[0], defaultValue?.[1], min, max]);

  const internalValues = _value ?? _defaultValue;

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      // Use the memoized stable references for value or defaultValue.
      {...(Array.isArray(value)
        ? { value: _value }
        : { defaultValue: _defaultValue })}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        }
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          }
        />
      </SliderPrimitive.Track>
      {React.useMemo(
        () =>
          internalValues.map((_, index) => (
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              key={index}
              className="border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
            />
          )),
        [internalValues.length, className]
      )}
    </SliderPrimitive.Root>
  );
}

export { Slider };
