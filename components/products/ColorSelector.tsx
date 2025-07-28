"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface ColorSelectorProps {
  colors: string[]
  selectedColor?: string
  onColorChange?: (color: string) => void
}

const colorMap: Record<string, string> = {
  Black: "bg-black",
  White: "bg-white border-2 border-slate-300",
  Navy: "bg-blue-900",
  Burgundy: "bg-red-900",
  Brown: "bg-amber-800",
  Tan: "bg-amber-600",
  Charcoal: "bg-slate-700",
  Red: "bg-red-500",
  Blue: "bg-blue-500",
  Green: "bg-green-500",
  Pink: "bg-pink-500",
  Purple: "bg-purple-500",
  Yellow: "bg-yellow-500",
  Orange: "bg-orange-500",
  Gray: "bg-gray-500",
  Grey: "bg-gray-500",
  Silver: "bg-gray-400",
  Gold: "bg-yellow-600",
  Beige: "bg-stone-300",
  Cream: "bg-stone-100 border-2 border-stone-300",
}

export function ColorSelector({ colors, selectedColor, onColorChange }: ColorSelectorProps) {
  const handleColorSelect = (color: string) => {
    onColorChange?.(color)
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
        Color: {selectedColor && (
          <span className="font-normal text-blue-600 ml-1">
            {selectedColor}
          </span>
        )}
      </h4>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <motion.button
            key={color}
            onClick={() => handleColorSelect(color)}
            className={`relative w-8 h-8 rounded-full ${colorMap[color] || "bg-slate-400"} ${
              selectedColor === color ? "ring-2 ring-slate-900 dark:ring-slate-100 ring-offset-2" : ""
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {selectedColor === color && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check className={`w-4 h-4 ${color === "White" ? "text-slate-900" : "text-white"}`} />
              </motion.div>
            )}
            <span className="sr-only">{color}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}