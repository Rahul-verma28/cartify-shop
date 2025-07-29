"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Category {
  _id: string
  title: string
  description?: string
  image: string
  slug: string
  productCount?: number
}

function CategorySkeleton() {
  return (
    <section className="container mx-auto px-4 py-16">
      <Skeleton className="h-9 w-64 mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
          </Card>
        ))}
      </div>
    </section>
  )
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      
      const data = await response.json()
      setCategories(data.categories || data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <CategorySkeleton />
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load categories. Please try again later.</p>
        </div>
      </section>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No categories available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="categories" className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Explore our diverse range of product categories
        </p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category) => (
            <CarouselItem
              key={category._id}
              className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <Link
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md block"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={category.image?.trim() || "/placeholder.svg"}
                    alt={category.title || "Category"}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-sm font-semibold mb-1">{category.title}</h3>
                  {category.description && (
                    <p className="text-xs text-white/80 mb-2 line-clamp-1">{category.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs hover:underline">
                      {category.productCount ? `${category.productCount} products` : 'Explore'}
                    </span>
                    <span className="flex items-center text-xs font-medium hover:underline">
                      Shop now
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </section>
  )
}
