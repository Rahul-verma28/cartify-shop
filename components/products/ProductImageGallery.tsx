"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductImageGalleryProps {
  images: string[]
  title: string
  comparePrice?: number
  price: number
}

export function ProductImageGallery({ images, title, comparePrice, price }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <Image
              src={images?.[selectedImageIndex] || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {images?.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {comparePrice && (
          <Badge className="absolute top-4 left-4 bg-red-500">
            Save ${(comparePrice - price).toFixed(0)}
          </Badge>
        )}
      </div>

      {/* Thumbnail Images */}
      {images?.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image: string, index: number) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                selectedImageIndex === index
                  ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${title} ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
