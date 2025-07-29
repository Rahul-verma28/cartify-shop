"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Brand {
  id: string
  name: string
  logo: string
  alt: string
}

const brands: Brand[] = [
  { id: "1", name: "Brand 1", logo: "/brands/brand-01.jpg", alt: "Brand 1 Logo" },
  { id: "2", name: "Brand 2", logo: "/brands/brand-02.jpg", alt: "Brand 2 Logo" },
  { id: "3", name: "Brand 3", logo: "/brands/brand-03.jpg", alt: "Brand 3 Logo" },
  { id: "4", name: "Brand 4", logo: "/brands/brand-04.jpg", alt: "Brand 4 Logo" },
  { id: "5", name: "Brand 5", logo: "/brands/brand-05.jpg", alt: "Brand 5 Logo" },
  { id: "6", name: "Brand 6", logo: "/brands/brand-06.jpg", alt: "Brand 6 Logo" },
  { id: "7", name: "Brand 7", logo: "/brands/brand-07.jpg", alt: "Brand 7 Logo" },
  { id: "8", name: "Brand 8", logo: "/brands/brand-08.jpg", alt: "Brand 8 Logo" },
  { id: "9", name: "Brand 9", logo: "/brands/brand-09.jpg", alt: "Brand 9 Logo" },
  { id: "10", name: "Brand 10", logo: "/brands/brand-10.jpg", alt: "Brand 10 Logo" },
  { id: "11", name: "Brand 11", logo: "/brands/brand-11.jpg", alt: "Brand 11 Logo" },
  { id: "12", name: "Brand 12", logo: "/brands/brand-12.jpg", alt: "Brand 12 Logo" },
  { id: "13", name: "Brand 13", logo: "/brands/brand-13.jpg", alt: "Brand 13 Logo" },
]

function BrandSkeleton() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-9 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-16 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function BrandShowcase() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <BrandSkeleton />
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Leading Brands
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We partner with the world's most innovative companies to bring you the best products
          </p>
        </motion.div>

        {/* Alternative: Infinite scroll animation */}
        <div className="overflow-hidden">
          <div className="flex animate-scroll space-x-2">
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="flex-shrink-0 w-40 h-20 lg:w-60 lg:h-32 flex items-center justify-center"
              >
                <Image
                  src={brand.logo}
                  alt={brand.alt}
                  width={200}
                  height={120}
                  className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
