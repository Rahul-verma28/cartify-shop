"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useDispatch } from "react-redux"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, ShoppingBag, Check, X } from "lucide-react"
import { toast } from "sonner"

interface ProductComparisonProps {
  products: Product[]
}

export default function ProductComparison({ products }: ProductComparisonProps) {
  const dispatch = useDispatch()

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }))
    toast.success("Added to cart!")
  }

  const comparisonFeatures = [
    { key: "price", label: "Price", type: "price" },
    { key: "rating", label: "Rating", type: "rating" },
    { key: "category", label: "Category", type: "text" },
    { key: "inventory", label: "In Stock", type: "stock" },
    { key: "description", label: "Description", type: "text" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle>Product Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-4 border-b">Feature</th>
                  {products?.map((product) => (
                    <th key={product?._id} className="text-center p-4 border-b min-w-[250px]">
                      <div className="space-y-4">
                        {/* Product Image */}
                        <div className="w-32 h-32 mx-auto relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                          <Image
                            src={product?.images[0] || "/placeholder.svg?height=128&width=128"}
                            alt={product?.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Title */}
                        <div>
                          <Link
                            href={`/products/${product?.slug}`}
                            className="text-lg font-semibold hover:text-primary line-clamp-2"
                          >
                            {product?.title}
                          </Link>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={product?.inventory === 0}
                          className="w-full"
                          size="sm"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          {product?.inventory === 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <motion.tr
                    key={feature.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b"
                  >
                    <td className="p-4 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900">
                      {feature.label}
                    </td>
                    {products?.map((product) => (
                      <td key={product?._id} className="p-4 text-center">
                        {feature.type === "price" && (
                          <div className="space-y-1">
                            <span className="text-xl font-bold">${product?.price}</span>
                            {product?.comparePrice && product?.comparePrice > product?.price && (
                              <div className="text-sm text-muted-foreground line-through">${product?.comparePrice}</div>
                            )}
                          </div>
                        )}

                        {feature.type === "rating" && (
                          <div className="flex items-center justify-center space-x-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product?.rating.average)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">({product?.rating.count})</span>
                          </div>
                        )}

                        {feature.type === "text" && feature.key === "category" && (
                          <Badge variant="secondary">{product?.category}</Badge>
                        )}

                        {feature.type === "text" && feature.key === "description" && (
                          <p className="text-sm text-muted-foreground line-clamp-3">{product?.description}</p>
                        )}

                        {feature.type === "stock" && (
                          <div className="flex items-center justify-center">
                            {product?.inventory > 0 ? (
                              <div className="flex items-center text-green-600">
                                <Check className="h-4 w-4 mr-1" />
                                <span className="text-sm">
                                  {product?.inventory > 10 ? "In Stock" : `${product?.inventory} left`}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-600">
                                <X className="h-4 w-4 mr-1" />
                                <span className="text-sm">Out of Stock</span>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <Separator className="my-6" />

          {/* Additional Features Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products?.map((product, index) => (
              <motion.div
                key={product?._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">SKU:</span>
                      <span className="text-sm font-medium">{product?._id.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Weight:</span>
                      <span className="text-sm font-medium">{product?.weight ? `${product?.weight}kg` : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Dimensions:</span>
                      <span className="text-sm font-medium">{product?.dimensions || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Brand:</span>
                      <span className="text-sm font-medium">{product?.brand || "Generic"}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
