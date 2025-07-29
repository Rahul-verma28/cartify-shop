"use client"

import { useState, useEffect, use } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ProductCard from "@/components/ProductCard"
import { ArrowLeft, Package, Star, ShoppingBag, Heart, AlertCircle, RefreshCw } from "lucide-react"
import type { Collection, Product } from "@/lib/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

function CollectionSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden">
        <Skeleton className="absolute inset-0 h-96" />
        <div className="relative container mx-auto px-4 py-20">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="max-w-3xl">
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-16 w-96 mb-6" />
            <Skeleton className="h-6 w-80 mb-8" />
            <div className="flex gap-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

interface ErrorState {
  type: 'collection' | 'products' | 'network' | 'unknown'
  message: string
  retry?: boolean
}

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [collection, setCollection] = useState<Collection | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorState | null>(null)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    fetchCollection()
  }, [slug])

  const fetchCollection = async (isRetry = false) => {
    if (isRetry) {
      setRetrying(true)
      setError(null)
    } else {
      setLoading(true)
      setError(null)
    }

    try {
      // Validate slug parameter
      if (!slug || typeof slug !== 'string') {
        throw new Error('Invalid collection identifier')
      }

      // Fetch collection by slug
      const collectionResponse = await fetch(`/api/collections/${slug}`)
      
      if (!collectionResponse.ok) {
        if (collectionResponse.status === 404) {
          notFound()
        } else if (collectionResponse.status >= 500) {
          throw new Error('Server error. Please try again later.')
        } else if (collectionResponse.status === 403) {
          throw new Error('Access denied to this collection.')
        } else {
          throw new Error('Failed to load collection details.')
        }
      }

      const collectionData = await collectionResponse.json()
      
      if (!collectionData || !collectionData._id) {
        throw new Error('Invalid collection data received.')
      }

      setCollection(collectionData)

      // Fetch products in this collection
      try {
        const productsResponse = await fetch(`/api/products?collection=${collectionData._id}&limit=50`)
        
        if (!productsResponse.ok) {
          // Don't fail the entire page if products can't be loaded
          console.error('Failed to fetch products:', productsResponse.status)
          setError({
            type: 'products',
            message: 'Could not load products for this collection.',
            retry: true
          })
          setProducts([])
        } else {
          const productsData = await productsResponse.json()
          setProducts(Array.isArray(productsData.products) ? productsData.products : [])
        }
      } catch (productError) {
        console.error('Products fetch error:', productError)
        setError({
          type: 'products',
          message: 'Could not load products for this collection.',
          retry: true
        })
        setProducts([])
      }

    } catch (fetchError: any) {
      console.error('Collection fetch error:', fetchError)
      
      // Determine error type and message
      let errorState: ErrorState
      
      if (fetchError.message.includes('Failed to fetch') || fetchError.name === 'NetworkError') {
        errorState = {
          type: 'network',
          message: 'Network connection failed. Please check your internet connection.',
          retry: true
        }
      } else if (fetchError.message.includes('Server error')) {
        errorState = {
          type: 'collection',
          message: 'Server temporarily unavailable. Please try again later.',
          retry: true
        }
      } else {
        errorState = {
          type: 'collection',
          message: fetchError.message || 'An unexpected error occurred.',
          retry: true
        }
      }
      
      setError(errorState)
    } finally {
      setLoading(false)
      setRetrying(false)
    }
  }

  const handleRetry = () => {
    fetchCollection(true)
  }

  if (loading) {
    return <CollectionSkeleton />
  }

  // Show error state if collection failed to load
  if (error?.type === 'collection' || error?.type === 'network') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {error.type === 'network' ? 'Connection Error' : 'Collection Unavailable'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error.message}</p>
          
          <div className="space-y-3">
            {error.retry && (
              <Button 
                onClick={handleRetry} 
                disabled={retrying}
                className="w-full"
              >
                {retrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
            )}
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!collection) {
    notFound()
  }

  const averageRating = products.length > 0 
    ? products.reduce((sum, product) => sum + (product.rating?.average || 0), 0) / products.length 
    : 0
  const totalReviews = products.reduce((sum, product) => sum + (product.rating?.count || 0), 0)
  const priceRange = products.length > 0 
    ? {
        min: Math.min(...products.map(p => p.price || 0)),
        max: Math.max(...products.map(p => p.price || 0))
      }
    : { min: 0, max: 0 }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <div className="absolute inset-0 opacity-50 dark:opacity-30">
          <Image 
            src={collection.image?.trim() || "/placeholder.svg"} 
            alt={collection.title || "Collection"} 
            fill 
            className="object-cover" 
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent dark:from-black/60"></div>

        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-4 mb-8"
          >
            <Link href="/">
              <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30 border-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/60">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Collections
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl text-white"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Package className="w-8 h-8 text-blue-400 dark:text-blue-300" />
              <span className="text-lg font-medium text-blue-200 dark:text-blue-300">Collection</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent">
              {collection.title}
            </h1>

            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              {collection.description || "Discover our carefully curated selection of premium products"}
            </p>

            <div className="flex flex-wrap items-center gap-8 mb-8">
              <div className="flex items-center space-x-2 bg-white/10 dark:bg-gray-800/30 rounded-full px-4 py-2">
                <Package className="w-5 h-5 text-blue-300 dark:text-blue-400" />
                <span className="font-medium">{products.length} Products</span>
              </div>

              {averageRating > 0 && (
                <div className="flex items-center space-x-2 bg-white/10 dark:bg-gray-800/30 rounded-full px-4 py-2">
                  <Star className="w-5 h-5 fill-current text-yellow-400" />
                  <span className="font-medium">
                    {averageRating.toFixed(1)} ({totalReviews} reviews)
                  </span>
                </div>
              )}

              {priceRange.min > 0 && (
                <div className="flex items-center space-x-2 bg-white/10 dark:bg-gray-800/30 rounded-full px-4 py-2">
                  <ShoppingBag className="w-5 h-5 text-green-300 dark:text-green-400" />
                  <span className="font-medium">
                    ${priceRange.min.toFixed(0)} - ${priceRange.max.toFixed(0)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {/* Show products error alert if exists */}
          {error?.type === 'products' && (
            <Alert className="mb-8 border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <AlertDescription className="text-orange-800 dark:text-orange-300">
                {error.message}
                {error.retry && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleRetry}
                    disabled={retrying}
                    className="ml-2 p-0 h-auto text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    {retrying ? 'Retrying...' : 'Retry'}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Products in this Collection
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Carefully selected products that complement each other perfectly for your needs.
            </p>
          </motion.div>

          {products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <Package className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">We're working on adding products to this collection.</p>
              <Link href="/products">
                <Button>Browse All Products</Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard 
                    product={product} 
                    showDescription={true} 
                    showCategory={true}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
