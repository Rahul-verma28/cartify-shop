"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  animated?: boolean
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  animated = true,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const isFilled = index < Math.floor(rating)
          const isHalfFilled = index === Math.floor(rating) && rating % 1 !== 0

          return (
            <motion.div
              key={index}
              initial={animated ? { opacity: 0, scale: 0 } : {}}
              animate={animated ? { opacity: 1, scale: 1 } : {}}
              transition={animated ? { delay: index * 0.1, type: "spring", stiffness: 300 } : {}}
            >
              <div className="relative">
                <Star
                  className={`${sizeClasses[size]} ${isFilled ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
                {isHalfFilled && (
                  <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
                    <Star className={`${sizeClasses[size]} text-yellow-400 fill-current`} />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
      {showValue && <span className="text-sm text-muted-foreground ml-2">{rating.toFixed(1)}</span>}
    </div>
  )
}
